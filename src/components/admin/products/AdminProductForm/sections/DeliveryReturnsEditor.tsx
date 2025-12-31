type Props = {
    deliveryTitle: string;
    setDeliveryTitle: (v: string) => void;
    deliveryContent: string;
    setDeliveryContent: (v: string) => void;
  };
  
  export function DeliveryReturnsEditor({
    deliveryTitle,
    setDeliveryTitle,
    deliveryContent,
    setDeliveryContent,
  }: Props) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 space-y-2">
        <p className="text-xs font-semibold text-zinc-700">Delivery & Returns</p>
  
        <input
          value={deliveryTitle}
          onChange={(e) => setDeliveryTitle(e.target.value)}
          className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm outline-none focus:border-black"
        />
  
        <textarea
          value={deliveryContent}
          onChange={(e) => setDeliveryContent(e.target.value)}
          className="w-full min-h-[90px] rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
    );
  }
  