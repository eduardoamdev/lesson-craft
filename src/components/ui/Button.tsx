import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "purple" | "teal" | "outline" | "gradient";
  href?: string;
  icon?: ReactNode;
  className?: string;
}

export default function Button({
  variant = "blue",
  href,
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    blue: "btn-blue",
    purple: "btn-purple",
    teal: "btn-teal",
    outline: "border border-[#1e3a8a]/50 text-[#60a5fa] hover:bg-[#1e3a8a]/10",
    gradient:
      "bg-gradient-to-r from-[#1e3a8a] to-[#581c87] hover:brightness-110 active:scale-[0.98] shadow-xl shadow-blue-950/40",
  };

  const baseClasses = "btn-base";
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
