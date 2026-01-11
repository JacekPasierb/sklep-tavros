# Project Architecture – DEV NOTES

Ten plik to moja mapa projektu.
Ma mi przypominać:
- gdzie trzymać typy
- gdzie trzymać logikę
- kiedy używać API, a kiedy service
- jak NIE duplikować kodu

Projekt: SHOP + ADMIN + API (Next.js App Router)


src/
├─ app/
│  ├─ (admin)/       # UI panelu admina
│  ├─ (shop)/        # UI sklepu (pages + layouts)
│  ├─ api/           # Endpointy API (route.ts)
│
├─ components/       # Czyste komponenty UI
│
├─ lib/
|  ├─ config/                # stałe dane / “content config”
│  │  ├─ shop/
│  │  │  ├─ pagination.ts    # np. FAVORITES_PAGE_SIZE, PRODUCTS_PAGE_SIZE
│  │  │  ├─ shipping.ts      # ceny dostawy, progi darmowej dostawy
│  │  │  ├─ payments.ts      # PAYMENT_METHODS (same dane)
│  │  │  └─ socials.ts       # SOCIALS (same dane, bez JSX)
|  ├─ hooks
│  ├─ mappers/       # Transformacja danych (DB ↔ UI)
│  ├─ services/      # Logika biznesowa + DB / fetch
│  ├─ utils/         # Czyste funkcje pomocnicze
│  ├─ validations/         
│
├─ models/           # Modele DB (Mongoose)
├─ store/            # Zustand / global state
├─ types/            # Typy TS (JEDYNE ŹRÓDŁO PRAWDY)
