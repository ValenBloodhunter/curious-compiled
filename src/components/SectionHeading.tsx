type SectionHeadingProps = {
  title: string;
  description?: string;
};

export default function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}
