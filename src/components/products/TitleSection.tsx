import React from "react";

type Props = {
  title: string;
};

const TitleSection = ({title}: Props) => {
  return (
    <h2 className="mb-6 py-5 text-center text-sm font-extrabold tracking-[0.25em] uppercase md:text-lg lg:text-[25px]">
      {title}
    </h2>
  );
};

export default TitleSection;
