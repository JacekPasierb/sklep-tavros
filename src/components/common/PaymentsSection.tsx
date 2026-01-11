"use client";

import Image from "next/image";
import { PAYMENT_METHODS } from "../../lib/config/shop/payments";


const PaymentsSection = () =>{
  return (
    <section className="container mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-center text-lg font-semibold tracking-tight text-neutral-800">
        Payment Methods
      </h2>

      <div className="flex flex-wrap items-center justify-center  justify-evenly">
        {PAYMENT_METHODS.map((m) => (
          <div key={m.alt} className="flex items-center justify-center">
            <Image
              src={m.src}
              alt={m.alt}
              width={0}
              height={0}
              sizes="100vw"
              className="h-6 sm:h-8 md:h-10 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default PaymentsSection;