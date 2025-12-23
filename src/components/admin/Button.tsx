import type {ButtonHTMLAttributes} from "react";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ring-offset-white " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/90",
  secondary: "bg-white text-black border border-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-black hover:bg-zinc-50",
};

export function Button({variant = "primary", className = "", ...props}: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
