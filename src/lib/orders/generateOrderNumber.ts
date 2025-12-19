import OrderCounter from "../../models/OrderCounter";


export async function getNextOrderNumber() {
  // Atomowy update – zwiększa seq i zwraca nową wartość
  const counter = await OrderCounter.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // tworzy dokument przy pierwszym użyciu
  );

  const num = counter.seq.toString().padStart(6, "0");
  return `TVR-${num}`;
}
//generowanie kolejnych numerów zamówień To jest bezpieczne, nawet jeśli 100 osób kupuje jednocześnie — MongoDB gwarantuje atomiczność findOneAndUpdate.