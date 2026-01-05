// src/lib/utils/formatMoney.ts
/**
 * Formatuje wartość liczbową do postaci ceny z walutą.
 *
 * Funkcja wykorzystywana w całej aplikacji (sklep, checkout, konto użytkownika,
 * panel admina) do spójnego wyświetlania cen, sum zamówień oraz przychodów.
 *
 * @param amount - Kwota do sformatowania (domyślnie w jednostce głównej, np. zł, GBP)
 * @param currency - Kod waluty w formacie ISO (np. "PLN", "GBP", "EUR")
 * @param opts.locale - Lokalizacja używana do formatowania (domyślnie "en-GB")
 * @param opts.maximumFractionDigits - Maksymalna liczba miejsc po przecinku (domyślnie 2)
 * @param opts.fromMinorUnit - Ustaw na true, jeśli kwota jest w jednostce pomocniczej
 *                             (np. grosze, pensy, centy)
 *
 * @example
 * formatMoney(129.99, "GBP") // £129.99
 * formatMoney(12999, "GBP", { fromMinorUnit: true }) // £129.99
 * formatMoney(1000, "EUR", { locale: "de-DE" }) // 1.000,00 €
 */
const formatMoney = (
  amount: number,
  currency: string,
  opts?: {
    locale?: string;
    maximumFractionDigits?: number;
    // jeśli amount jest np. w pensach/groszach:
    fromMinorUnit?: boolean;
  }
) => {
  const locale = opts?.locale ?? "en-GB";
  const maximumFractionDigits = opts?.maximumFractionDigits ?? 2;

  const value = opts?.fromMinorUnit ? amount / 100 : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${value} ${currency.toUpperCase()}`;
  }
};
export default formatMoney;
