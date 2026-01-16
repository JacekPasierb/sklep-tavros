import SectionHeader from "@/components/admin/SectionHeader";

import type {AdminUsersSearchParams} from "@/types/admin/users";
import {normalizeAdminUsersQuery} from "@/lib/utils/admin/users/query";
import getAdminUsers from "@/lib/services/admin/users.service";

import AdminUsersTable from "@/components/admin/users/AdminUsersTable";
import AdminUsersFilters from "@/components/admin/users/AdminUsersFilter";

const AdminUsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<AdminUsersSearchParams>;
}) => {
  const sp = await searchParams;

  const query = normalizeAdminUsersQuery(sp, {limit: 20});
  const {users, total, page, pages} = await getAdminUsers(query);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Management"
        title="Users"
        description="Admin-only list of registered accounts."
      />
      <AdminUsersFilters defaultQ={query.q} />
      <AdminUsersTable users={users} total={total} page={page} pages={pages} />
    </div>
  );
};

export default AdminUsersPage;
