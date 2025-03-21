import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  SendHorizontal,
  QrCode,
  Plus,
  ArrowRight,
  CreditCard,
} from "lucide-react";

interface AccountItem {
  id: string;
  title: string;
  description?: string;
  balance: string;
  type: "savings" | "checking" | "investment" | "debt";
}

interface List01Props {
  totalBalance?: string;
  accounts?: AccountItem[];
  className?: string;
  role?: "admin" | "hod" | "staff";
}

const ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "Main Savings",
    description: "Personal savings",
    balance: "$8,459.45",
    type: "savings",
  },
  {
    id: "2",
    title: "Checking Account",
    description: "Daily expenses",
    balance: "$2,850.00",
    type: "checking",
  },
  {
    id: "3",
    title: "Investment Portfolio",
    description: "Stock & ETFs",
    balance: "$15,230.80",
    type: "investment",
  },
  {
    id: "4",
    title: "Credit Card",
    description: "Pending charges",
    balance: "$1,200.00",
    type: "debt",
  },
  {
    id: "5",
    title: "Savings Account",
    description: "Emergency fund",
    balance: "$3,000.00",
    type: "savings",
  },
];

// Define role-based options
const optionsByRole = {
  admin: [
    { label: "Create Event", icon: Plus },
    { label: "Manage HOD", icon: SendHorizontal },
    { label: "Manage Staff", icon: ArrowDownLeft },
    { label: "Student Management", icon: ArrowRight },
  ],
  hod: [
    { label: "Request Join", icon: Plus },
    { label: "Create Event", icon: SendHorizontal },
    { label: "Staff Management", icon: ArrowDownLeft },
    { label: "Student Management", icon: ArrowRight },
  ],
  staff: [
    { label: "Create Event", icon: Plus },
    { label: "Student Management", icon: ArrowRight },
  ],
};

export default function List01({
  totalBalance = "$26,540.25",
  accounts = ACCOUNTS,
  className,
  role = "staff",
}: List01Props) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      {/* Total Balance Section */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Total Balance
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {totalBalance}
        </h1>
      </div>

      {/* Accounts List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
            Your Accounts
          </h2>
        </div>

        <div className="space-y-1">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30":
                      account.type === "savings",
                    "bg-blue-100 dark:bg-blue-900/30":
                      account.type === "checking",
                    "bg-purple-100 dark:bg-purple-900/30":
                      account.type === "investment",
                  })}
                >
                  {account.type === "savings" && (
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {account.type === "checking" && (
                    <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  )}
                  {account.type === "investment" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  {account.type === "debt" && (
                    <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {account.title}
                  </h3>
                  {account.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                      {account.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                  {account.balance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated footer with role-based buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className={`grid grid-cols-${optionsByRole[role].length} gap-2`}>
          {optionsByRole[role].map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex items-center justify-center gap-2",
                "py-2 px-3 rounded-lg",
                "text-xs font-medium",
                "bg-zinc-900 dark:bg-zinc-50",
                "text-zinc-50 dark:text-zinc-900",
                "hover:bg-zinc-800 dark:hover:bg-zinc-200",
                "shadow-sm hover:shadow",
                "transition-all duration-200",
              )}
            >
              <opt.icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
