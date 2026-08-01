import fallbackData from '../data/events-fallback.json';

export interface ConnpassEvent {
  title: string;
  url: string;
  start: string; // ISO8601 (UTC)
}

export interface EventsData {
  upcoming: ConnpassEvent[];
  past: ConnpassEvent[];
  live: boolean;
}

const LIST_URL = 'https://funabashidev.connpass.com/event/';

// connpassはデフォルトUAのHTTPクライアントに空応答(202)を返すため、ブラウザ相当のヘッダで取得する
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ja,en;q=0.9',
};

// hCalendar形式(.group_event_list.vevent + a.url.summary + .dtstart .value-title)を前提にパースする
function parse(html: string): ConnpassEvent[] {
  return html
    .split('class="group_event_list vevent"')
    .slice(1)
    .flatMap((block) => {
      const link = block.match(
        /<a class="url summary" href="(https:\/\/funabashidev\.connpass\.com\/event\/\d+\/)"[^>]*>([^<]+)<\/a>/,
      );
      const start = block.match(/class="dtstart"><span class="value-title" title="([^"]+)"/);
      if (!link || !start) return [];
      // タイトル中の「\.」はconnpass側のエスケープ表記なので外す
      return [{ url: link[1], title: link[2].replace(/\\(.)/g, '$1').trim(), start: start[1] }];
    });
}

async function fetchAll(): Promise<ConnpassEvent[]> {
  // 範囲外のページ番号でもconnpassは同じ一覧を返すため、既知イベントだけのページで打ち切る
  const seen = new Map<string, ConnpassEvent>();
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`${LIST_URL}?page=${page}`, { headers: HEADERS });
    if (!res.ok) throw new Error(`connpass HTTP ${res.status}`);
    const found = parse(await res.text());
    const fresh = found.filter((e) => !seen.has(e.url));
    if (fresh.length === 0) break;
    fresh.forEach((e) => seen.set(e.url, e));
  }
  if (seen.size === 0) throw new Error('0 events parsed');
  return [...seen.values()];
}

let cached: Promise<EventsData> | undefined;

/** ビルド時にconnpassのイベント一覧を取得する。失敗時は events-fallback.json にフォールバック */
export function getEvents(): Promise<EventsData> {
  cached ??= (async () => {
    try {
      const all = await fetchAll();
      const now = Date.now();
      return {
        upcoming: all
          .filter((e) => Date.parse(e.start) >= now)
          .sort((a, b) => a.start.localeCompare(b.start)),
        past: all
          .filter((e) => Date.parse(e.start) < now)
          .sort((a, b) => b.start.localeCompare(a.start)),
        live: true,
      };
    } catch (err) {
      console.warn(`[connpass] ビルド時取得に失敗、フォールバックを使用: ${err}`);
      const { upcoming, past } = fallbackData as { upcoming: ConnpassEvent[]; past: ConnpassEvent[] };
      const now = Date.now();
      // フォールバックの「開催予定」も古くなり得るので、日時で仕分けし直す
      const all = [...upcoming, ...past];
      return {
        upcoming: all
          .filter((e) => Date.parse(e.start) >= now)
          .sort((a, b) => a.start.localeCompare(b.start)),
        past: all
          .filter((e) => Date.parse(e.start) < now)
          .sort((a, b) => b.start.localeCompare(a.start)),
        live: false,
      };
    }
  })();
  return cached;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function toJst(iso: string): Date {
  return new Date(Date.parse(iso) + 9 * 3600_000);
}

/** 例: 2026年9月12日(土) 13:30〜 */
export function formatDateLabel(iso: string): string {
  const d = toJst(iso);
  const hm = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日(${WEEKDAYS[d.getUTCDay()]}) ${hm}〜`;
}

/** 例: 2026/09/12 */
export function formatDateShort(iso: string): string {
  const d = toJst(iso);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
}
