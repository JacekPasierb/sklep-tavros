"use client";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination, A11y} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";

const Banner = () => {
  return (
    <section className=" md:grid md:grid-cols-2 ">
      {/* Mobile swiper */}
      <div className="md:hidden">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={10}
          slidesPerView={1}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              const number = (index + 1).toString().padStart(2, "0"); // 01, 02, 03...
              return `<span class="${className} !bg-transparent !w-auto !h-auto !text-white text-2xl font-bold mx-8 px-3">${number}</span>`;
            },
          }}
        >
          <SwiperSlide>
            <div className="relative  overflow-hidden">
              <video
                src="/videos/film1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className=" w-full object-cover"
              />{" "}
              <div className="absolute inset-0 flex items-end mb-15 justify-center">
                <Link
                  href="/collections/mens/christmas20"
                  className="rounded-2xl bg-white px-6 py-2 text-lg font-bold uppercase text-black shadow hover:bg-black hover:text-white transition"
                >
                  Mens New Collection
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative  overflow-hidden">
              <video
                src="/videos/film2.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end mb-15 justify-center">
                <Link
                  href="/collections/womens/christmas20"
                  className="rounded-2xl bg-white px-6 py-2 text-lg font-bold uppercase text-black shadow hover:bg-black hover:text-white transition"
                >
                  Womens New Collection
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Desktop grid */}
      <div className="relative hidden  md:block ">
        <video
          src="/videos/film1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute  w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end mb-20 justify-center">
          <Link
            href="/collections/mens/new"
            className="rounded-2xl bg-white px-6 py-2 text-lg font-bold uppercase text-black shadow hover:bg-black hover:text-white transition"
          >
            Mens New Collection
          </Link>
        </div>
      </div>
      <div className=" relative hidden md:block">
        <video
          src="/videos/film2.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full object-cover"
        />{" "}
        <div className="absolute inset-0 flex items-end mb-20 justify-center">
          <Link
            href="/collections/womens/new"
            className="rounded-2xl bg-white px-6 py-2 text-lg font-bold uppercase text-black shadow hover:bg-black hover:text-white transition"
          >
            Womens New Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
