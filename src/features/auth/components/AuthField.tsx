import type { ComponentType, InputHTMLAttributes } from "react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  error?: string;
}

export default function AuthField({
  id,
  label,
  icon: Icon,
  error,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
        />
        <input
          id={id}
          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-hidden transition focus:ring-4 ${
            error
              ? "border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-teal-600 focus:ring-teal-100"
          }`}
          {...inputProps}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
}
