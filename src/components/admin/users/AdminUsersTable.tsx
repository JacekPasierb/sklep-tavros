
import { PublicUser } from "../../../types/admin/users";
import { Pagination } from "../../products/Pagination";
import AdminUsersList from "./AdminUsersList";
import AdminUsersTopBar from "./AdminUsersTopBar";


type Props = {
  users: PublicUser[];
  total: number;
  page: number;
  pages: number;
};

const AdminUsersTable=({ users, total, page, pages }: Props) =>{
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
      <AdminUsersTopBar total={total} page={page} pages={pages} />

      <div className="hidden sm:block px-5 py-3 border-b border-zinc-200">
        <div className="grid grid-cols-12 gap-4 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <div className="col-span-4">Name</div>
          <div className="col-span-5">Email</div>
          <div className="col-span-2 text-right">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
      </div>

      <AdminUsersList users={users} />

      <div className="px-5 py-4 border-t border-zinc-200">
        <Pagination currentPage={page} totalPages={pages} />
      </div>
    </div>
  );
}
export default AdminUsersTable;