import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

const defaultProfile = {
  name: "Lorem Ipsum",
  department: "DEFAULT",
  avatar: "https://shorturl.at/CI9p1",
};

export default function Profile01() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const name = session?.user?.name || defaultProfile.name;
  // Assuming the session holds a "department" property.
  const department = session?.user?.department || defaultProfile.department;
  const avatar = session?.user?.image || defaultProfile.avatar;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative shrink-0">
              <Image
                src={avatar}
                alt={name}
                width={72}
                height={72}
                className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {name}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">{department}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                signOut({ callbackUrl: "/" });
                localStorage.removeItem("profile");
              }}
              className="w-full flex items-center justify-between p-2
                              hover:bg-zinc-50 dark:hover:bg-zinc-800/50
                              rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
