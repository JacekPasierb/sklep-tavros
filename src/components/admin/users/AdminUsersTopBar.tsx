type Props = {
    total: number;
    page: number;
    pages: number;
  };
  
  const AdminUsersTopBar=({ total, page, pages }: Props)=> {
    return (
      <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {total} total
        </div>
  
        <div className="text-xs text-zinc-500">
          Page <span className="text-black font-medium">{page}</span> / {pages}
        </div>
      </div>
    );
  }
  export default AdminUsersTopBar;