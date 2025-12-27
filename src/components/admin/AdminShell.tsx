import {AdminNav} from "./AdminNav";
import {AdminSignOut} from "./AdminSignOut";
import {AdminPreviewStore} from "./AdminPreviewStore";
import {AdminMobileMenu} from "./AdminMobileMenu";

export function AdminShell({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl border border-zinc-200 flex items-center justify-center">
              <span className="text-xs font-semibold tracking-[0.18em]">T</span>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Admin
              </div>
              <div className="text-sm font-semibold text-black">Tavros</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <AdminNav />
            <AdminPreviewStore />
            <AdminSignOut />
          </div>

          <div className="sm:hidden">
            <AdminMobileMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
