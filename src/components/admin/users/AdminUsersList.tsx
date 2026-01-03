import {PublicUser} from "../../../types/admin/users";
import {DeleteUserButton} from "../DeleteUserButton";

type Props = {
  users: PublicUser[];
};

const formatDate = (value: string) =>{
  return new Date(value).toLocaleDateString("en-GB");
}

const AdminUsersList = ({users}: Props) => {
  return (
    <div className="divide-y divide-zinc-200">
      {users.map((u) => {
        const fullName = `${u.firstName} ${u.lastName}`.trim();

        return (
          <div key={u.id} className="px-5 py-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4 sm:items-center">
              <div className="sm:col-span-4 min-w-0">
                <div className="text-sm font-semibold text-black truncate">
                  {fullName || "Customer"}
                </div>

                <div className="mt-1 sm:hidden text-xs text-zinc-500">
                  Created: {formatDate(u.createdAt)}
                </div>
              </div>

              <div className="sm:col-span-5 min-w-0">
                <a
                  href={`mailto:${u.email}`}
                  className="text-sm text-zinc-600 underline-offset-4 hover:underline break-all sm:break-normal sm:truncate block"
                >
                  {u.email}
                </a>
              </div>

              <div className="hidden sm:block sm:col-span-2 text-right text-xs text-zinc-500">
                {formatDate(u.createdAt)}
              </div>

              <div className="sm:col-span-1 flex sm:justify-end">
                <DeleteUserButton userId={u.id} />
              </div>
            </div>
          </div>
        );
      })}

      {users.length === 0 ? (
        <div className="px-5 py-10 text-sm text-zinc-600">No users found.</div>
      ) : null}
    </div>
  );
};
export default AdminUsersList;
