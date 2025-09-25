//timezone 7

const TIMEZONE_GMT = (d: string, h: number) =>
  new Date(new Date(d).getTime() + h * 3600000).toISOString();

export { TIMEZONE_GMT };
