import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

/* Spinner -------------------------------------------------------- */
export function Spinner({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full border-2 border-current/25 border-t-current spin ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/* Primary button ------------------------------------------------- */
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'dark';
}
export function PrimaryButton({ children, loading, variant = 'primary', className = '', disabled, ...rest }: BtnProps) {
  const styles: Record<string, string> = {
    primary: 'bg-moss-600 hover:bg-moss-700 text-white',
    dark: 'bg-black hover:bg-zinc-800 text-white',
    ghost: 'bg-white border border-line hover:border-ink/25 text-ink',
  };
  return (
    <button
      disabled={disabled || loading}
      className={`w-full h-[52px] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors disabled:opacity-40 active:scale-[.99] ${styles[variant]} ${className}`}
      {...rest}
    >
      {loading ? <Spinner className="text-white" /> : children}
    </button>
  );
}

/* Text field ----------------------------------------------------- */
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
}
export function Field({ label, error, className = '', ...rest }: FieldProps) {
  return (
    <label className="block">
      {label && <span className="block text-[12px] font-medium text-sub mb-1">{label}</span>}
      <input
        className={`w-full h-[48px] rounded-xl border bg-sand px-4 text-[15px] transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-ink/15 focus:border-moss-600'
        } ${className}`}
        {...rest}
      />
    </label>
  );
}

/* Trust line ----------------------------------------------------- */
export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-1 text-[11px] text-ink/35">
      <span className="flex-1 h-px bg-ink/10" />
      {children}
      <span className="flex-1 h-px bg-ink/10" />
    </div>
  );
}

/* Key/value row -------------------------------------------------- */
export function KV({ k, v, mono }: { k: string; v: ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="text-ink/50">{k}</span>
      <span className={`text-ink/85 font-medium text-right break-all ${mono ? 'font-mono' : ''}`}>{v}</span>
    </div>
  );
}
