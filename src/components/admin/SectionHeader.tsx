type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

const SectionHeader = ({eyebrow, title, description}: Props) => {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="text-xl font-semibold text-black">{title}</h1>
      {description ? (
        <p className="text-sm text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
};
export default SectionHeader;
