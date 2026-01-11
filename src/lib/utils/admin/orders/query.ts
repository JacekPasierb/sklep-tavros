import {OrdersQuery, OrdersSearchParams} from "../../../../types/admin/orders";
import {FulfillmentStatus, PaymentStatus} from "../../../../types/shop/order";
import { parsePositiveInt } from "../../shared/number";



/**
 * Normalizuje tekst:
 * - zamienia undefined na pusty string,
 * - usuwa zbędne białe znaki.
 */
const normalizeText = (value: string | undefined) => {
  return (value ?? "").trim();
};

/**
 * normalizeOrdersQuery
 *
 * Normalizuje parametry wyszukiwania zamówień pochodzące z URL (searchParams)
 * do postaci bezpiecznej i przewidywalnej dla warstwy serwisowej (DB).
 *
 * Wejście:
 * - dane typu OrdersSearchParams (stringi, undefined)
 *
 * Wyjście:
 * - obiekt OrdersQuery z poprawnymi typami (number, enumy, string)
 *
 * Funkcja:
 * - ustawia domyślne wartości (page, limit),
 * - sanitizuje tekst (trim),
 * - chroni serwis przed nieprawidłowymi danymi z URL.
 *
 * @param sp - Parametry wyszukiwania z URL (searchParams)
 * @param options.limit - Liczba elementów na stronę (domyślnie 20)
 */
export const normalizeOrdersQuery = (
  sp: OrdersSearchParams,
  options?: {limit?: number, maxLimit?:number}
): OrdersQuery => {
  const maxLimit = options?.maxLimit ?? 100;

  const limitFromUrl = sp.limit ? parsePositiveInt(sp.limit, 20) : 20;
  const limit = Math.min(options?.limit ?? limitFromUrl, maxLimit);

  return {
    page: parsePositiveInt(sp.page, 1),
    limit,
    q: normalizeText(sp.q),
    paymentStatus: normalizeText(sp.paymentStatus as string) as
      | PaymentStatus
      | "",
    fulfillmentStatus: normalizeText(sp.fulfillmentStatus as string) as
      | FulfillmentStatus
      | "",
  };
};
