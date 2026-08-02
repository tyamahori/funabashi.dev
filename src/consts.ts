export const SITE_TITLE = 'Funabashi.dev';
export const SITE_DESCRIPTION =
  '船橋市を中心としたIT/Web系開発者コミュニティ、通称「ふなでぶ」。2021年から地元でゆるく長く続いています。';
// 検索でひらがな・カタカナ表記からも辿れるようにする(JSON-LDのalternateName用)
export const SITE_ALTERNATE_NAMES = ['ふなでぶ', 'ふなデブ', 'フナデブ'];

export const DISCORD_INVITE_URL = 'https://discord.gg/BhK2tpqQmn';
export const HIGAFUNA_NAME = '合同会社ひがふな';
export const HIGAFUNA_URL = 'https://higafuna.jp';
export const CONNPASS_URL = 'https://funabashidev.connpass.com';
export const X_HASHTAG_URL = 'https://x.com/share?hashtags=funabashidev';

export const NEWS_CATEGORIES = {
  discord: 'Discordの話題',
  local: '船橋ローカル',
  tech: 'テック',
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;
