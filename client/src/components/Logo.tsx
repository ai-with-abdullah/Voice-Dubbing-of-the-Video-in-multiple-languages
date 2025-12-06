import { Link } from "wouter";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} data-testid="link-logo">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Play button triangle */}
          <path
            d="M8 5.5v13l10-6.5L8 5.5z"
            fill="white"
            opacity="0.9"
          />
          {/* Sound waves for voice/dubbing */}
          <path
            d="M19 9c1 0.8 1.5 1.8 1.5 3s-0.5 2.2-1.5 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M21.5 7c1.3 1.3 2 2.9 2 5s-0.7 3.7-2 5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
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
