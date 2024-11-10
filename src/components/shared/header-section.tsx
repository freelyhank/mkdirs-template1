import { cn } from "@/lib/utils";

interface HeaderSectionProps {
  id?: string;
  label?: string;
  labelAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  title?: string;
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  subtitle?: string;
  subtitleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  className?: string;
}

/**
 * different pages may use this component as different heading style for SEO friendly
 */
export function HeaderSection({
  id,
  label,
  labelAs = "p",
  title,
  titleAs = "p",
  subtitle,
  subtitleAs = "p",
  className,
}: HeaderSectionProps) {
  const LabelComponent = labelAs;
  const TitleComponent = titleAs;
  const SubtitleComponent = subtitleAs;
  return (
    <div
      id={id}
      className={cn("flex flex-col items-center text-center", className)}
    >
      {label ? (
        <LabelComponent className="uppercase tracking-wider text-gradient_indigo-purple font-semibold">
          {label}
        </LabelComponent>
      ) : null}
      {title ? (
        <TitleComponent className="mt-4 text-2xl md:text-4xl">
          {title}
        </TitleComponent>
      ) : null}
      {subtitle ? (
        <SubtitleComponent className="mt-6 text-balance text-lg text-muted-foreground">
          {subtitle}
        </SubtitleComponent>
      ) : null}
    </div>
  );
}
