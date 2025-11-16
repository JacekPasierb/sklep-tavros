import React from "react";

interface TitleProps {
  title: string;
}

const TitleSection = ({title}: TitleProps) => {
  return (
    <h2 className="mb-6 py-5 text-center text-sm font-extrabold tracking-[0.25em] uppercase md:text-lg lg:text-[25px]">
      {title}
    </h2>
  );
};

export default TitleSection;
