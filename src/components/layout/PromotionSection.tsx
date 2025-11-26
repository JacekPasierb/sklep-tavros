import React from "react";

const PromotionSection = () => {
  return (
    <section className="bg-[#f6f6f6]">
      <div className="container mx-auto grid place-items-center gap-0.5  py-1.5 text-center">
        <span className="text-[11px] text-black font-semibold tracking-widest">
          FREE UK EXPRESS DELIVERY
        </span>
        <small className="text-[11px] text-gray-700 opacity-70 tracking-widest">
          ON ORDERS OVER £125
        </small>
      </div>
    </section>
  );
};

export default PromotionSection;
