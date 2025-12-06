import { Link } from "wouter";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} data-testid="link-logo">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4h6a8 8 0 0 1 0 16H6V4z"
            fill="white"
          />
          <path
            d="M17 8.5c1.5 1 2.5 2.5 2.5 4s-1 3-2.5 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 6c2 1.5 3.5 4 3.5 6.5S22 17.5 20 19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className="hidden font-semibold text-foreground sm:inline-block">
          Dubbio
        </span>
      )}
    </Link>
  );
}
