// src/lib/utils/dates/startOfThisMonthUTC.ts
/**
 * Zwraca początek bieżącego miesiąca w UTC (YYYY-MM-01 00:00:00Z).
 * Użyteczne do filtrowania danych agregowanych w bazie niezależnie od strefy czasowej serwera.
 */
export const startOfThisMonthUTC = (date = new Date()) => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0)
  );
};
