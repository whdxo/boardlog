import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  ctaHref?: string;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-4 text-center",
        className
      )}
    >
      <span className="text-4xl">{icon}</span>
      <p className="text-h3 font-semibold text-gray-700">{title}</p>
      {description && (
        <p className="text-body text-gray-500 max-w-xs">{description}</p>
      )}
      {ctaLabel && (
        ctaHref ? (
          <Link href={ctaHref} className={cn(buttonVariants({ size: "sm" }), "mt-2")}>
            {ctaLabel}
          </Link>
        ) : (
          <button
            type="button"
            className={cn(buttonVariants({ size: "sm" }), "mt-2")}
            onClick={onCta}
          >
            {ctaLabel}
          </button>
        )
      )}
    </div>
  );
}
