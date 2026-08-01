export const SITE_TITLE = 'Funabashi.dev';
export const SITE_DESCRIPTION =
  '船橋市を中心としたIT/Web系開発者コミュニティ。2021年から地元でゆるく長く続いています。';

export const DISCORD_INVITE_URL = 'https://discord.gg/BhK2tpqQmn';
export const CONNPASS_URL = 'https://funabashidev.connpass.com';
export const X_HASHTAG_URL = 'https://x.com/share?hashtags=funabashidev';

export const NEWS_CATEGORIES = {
  discord: 'Discordの話題',
  local: '船橋ローカル',
  tech: 'テック',
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;
