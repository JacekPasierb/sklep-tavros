// src/components/account/orders/OrderTimeline.tsx
import React from "react";
import { FULFILLMENT_STEP_INDEX, FulfillmentStatus, ORDER_STEPS } from "../../../types/order";


type OrderTimelineProps = {
  fulfillmentStatus?: FulfillmentStatus;
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  fulfillmentStatus = "created",
}) => {
  const currentStep = FULFILLMENT_STEP_INDEX[fulfillmentStatus];
  const isCanceled = fulfillmentStatus === "canceled";

  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Order status
      </p>

      {isCanceled ? (
        <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase text-rose-700">
          Canceled
        </span>
      ) : (
        <>
          {/* MOBILE */}
          <div className="flex flex-col gap-2 sm:hidden">
            {ORDER_STEPS.map((label, index) => {
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={[
                      "h-2.5 w-2.5 rounded-full border",
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500"
                        : isActive
                        ? "border-emerald-500 bg-white"
                        : "border-zinc-300 bg-white",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-[11px] uppercase tracking-[0.16em]",
                      isActive
                        ? "text-zinc-900 font-semibold"
                        : "text-zinc-400",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:flex flex-wrap items-center gap-4">
            {ORDER_STEPS.map((label, index) => {
              const isActive = index <= currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={label}
                  className="flex items-center gap-2 flex-1 min-w-[80px]"
                >
                  <div
                    className={[
                      "h-2.5 w-2.5 rounded-full border",
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500"
                        : isActive
                        ? "border-emerald-500 bg-white"
                        : "border-zinc-300 bg-white",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "text-[10px] uppercase tracking-[0.16em]",
                      isActive
                        ? "text-zinc-900 font-semibold"
                        : "text-zinc-400",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                  {index < ORDER_STEPS.length - 1 && (
                    <div
                      className={[
                        "h-[1px] flex-1",
                        isCompleted ? "bg-emerald-500" : "bg-zinc-200",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
