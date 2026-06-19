export const money = (n: number): string =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Format an amount in the merchant settlement asset (USDm). */
export const settlementAmount = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USDm';

/** Random-ish but stable-looking demo ids. */
export const makeOrderNumber = (): string =>
  'PP-' + Math.random().toString(36).slice(2, 7).toUpperCase();

export const makeReference = (): string => 'mref_' + Math.random().toString(36).slice(2, 12);

export const maskEmail = (email: string): string => {
  const [user, domain] = email.split('@');
  if (!domain) return email;
  return `${user.slice(0, 1)}•••@${domain}`;
};
