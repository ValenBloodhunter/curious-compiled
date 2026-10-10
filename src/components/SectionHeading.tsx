
type SectionHeadingProps = {
  number: string;
  label: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  number,
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-3">
        <p className="font-mono text-xs tracking-[0.15em] text-accent">
          {number} / {label}
        </p>
      </div>

      <div className="lg:col-span-9">
        <h2 className="max-w-4xl font-display text-[clamp(2.75rem,6vw,6rem)] font-bold leading-[1.05] tracking-[-0.06em]">
          {title}
        </h2>

        {description && (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
