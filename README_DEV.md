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

// TYPES UTILS HOOKS STRUCTURE


---

## Zasady

### Typy
- Wszystkie typy w `src/types`
- Brak duplikacji typów w `lib` i `components`
- Typy wspólne (np. `ProductImage`) tylko w jednym miejscu

### Services vs API
**Services (`lib/services`)**
- logika biznesowa
- DB / fetch
- obliczenia i mapowanie danych

**API Routes (`app/api`)**
- auth
- walidacja requestu
- wywołanie service
- zwrot response

### Components
- tylko UI
- brak fetchowania
- hooki tylko w komponentach klienta

### Hooks
- logika kliencka
- SWR / redirecty / paginacja
- brak bezpośredniego dostępu do DB

### Utils
- czyste funkcje
- brak fetch
- brak logiki domenowej

---

## Feature flags

`lib/config/shop/`
- enabled genders (np. tylko `mens`)
- sekcje home
- czasowe wyłączenia funkcji

---

## Typy

### AUTH
`types/(shop)/(auth)/`
- `register.ts`  
  - `RegisterFormValues`
- `signin.ts`  
  - `SignInFormValues`
  - `SignInReason`

### SHOP
`types/(shop)/`
- `product.ts`
  - `ShopGender`
  - `ProductCategory`
  - `ProductStatus`
  - `ProductImage`
  - `Variant`
  - `ProductSection`
  - `ProductTextBlock`
  - `TypeProduct`
- `productsList.ts`
  - `ProductsSort`
  - `ProductsListQuery`
  - `ProductsListMode`
- `cart.ts`
  - `CartItem`
- `checkout.ts`
  - `UiCartItem`
  - `CheckoutPayload`
  - `CheckoutResult`
- `collections.ts`

### ACCOUNT
`types/(shop)/account/`
- `favorites.ts`
- `orders.ts`

### ADMIN
`types/admin/`
- `orders.ts`

---

## Services

`lib/services/(shop)/`
- `(auth)/`
  - `register.service.ts`
  - `signin.service.ts`
- `checkout/checkout.service.ts`
- `orders/payNow.service.ts`
- `products/products.service.ts`
- `collections/collections.service.ts`

---

## Validations

`lib/validations/(shop)/(auth)/`
- `register.schema.ts`
- `signin.schema.ts`

---

## Hooks

`lib/hooks/shop/`
- `useUserFavorites.ts`
- `useUserCart.ts`

`lib/hooks/shop/auth/`
- `useAuthRedirect.ts`
- `useSuccessCleanupCart.ts`

`lib/hooks/account/`
- `useOrders.ts`

`lib/hooks/shared/`
- `useClientPageSlice.ts`

---

## Store (Zustand)

`store/`
- `favoritesStore.ts`
- `cartStore.ts`
- `cartUiStore.ts`

---

## Utils

`lib/utils/(shop)/(auth)/`
- `normalizeSignInReason.ts`
- `sanitizeCallbackUrl.ts`

`lib/utils/(shop)/account/`
- `orderFetcher.ts`
- `computeOrderTotals.ts`

`lib/utils/(shop)/products/`
- `view.ts`
- `mongo.ts`
- `where.ts`
- `sort.ts`
- `paging.ts`
- `filter.ts`
- `smartSizeSort.ts`

`lib/utils/(shop)/productsList/`
- `normalizeQuery.ts`
- `normalizeSizes.ts`
- `parseSort.ts`
- `toStringArray.ts`
- `getProductsListBasePath.ts`
- `getProductsListHeading.ts`

`lib/utils/shared/`
- `number.ts`
- `formatMoney.ts`
- `formatDate.ts`
- `formatTime.ts`
- `formatText.ts`
- `getImageSrc.ts`

`lib/utils/shared/auth/`
- `sessionGuards.ts`
- `getUserLabel.ts`

---

## Notatka produkcyjna

- WOMENS/KIDS: wyłączone w UI (bez fetchów)
- Feature flags zamiast ifów
- ENV dla Mongo / Stripe / Mail / GA
- Brak logiki biznesowej w komponentach



// WAŻNE //
DLA URUCHOMIENIA KOLEKCJI WOMENS I KIDS ODKOMENTOWAC W KOMPONENTACH KOD
components/layout/header/MobileMenu
WYŁĄCZYC PRZEKIEROWANIA na coming-soon w PROXY.ts
1
ODKOMENTOWAĆ KOD DLA TABS W :
app/(shop)/page.tsx