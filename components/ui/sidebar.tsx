"use client";

import {
  Home,
  BarChart2,
  Building2,
  Receipt,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

// Define the navigation item type
type NavItemType = {
  href: string;
  label: string;
  icon: any;
};

// Setup the nav items for each role
const adminNavItems: NavItemType[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/events", label: "Event Creation", icon: BarChart2 },
  { href: "/hod-management", label: "HOD Management", icon: Building2 },
  { href: "/staff-management", label: "Staff Management", icon: Users2 },
  { href: "/student-management", label: "Student Management", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const hodNavItems: NavItemType[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/events", label: "Event Creation", icon: BarChart2 },
  { href: "/staff-management", label: "Staff Management", icon: Folder },
  { href: "/student-management", label: "Student Management", icon: Wallet },
  // { href: "/join-request", label: "Join Request", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const staffNavItems: NavItemType[] = [
  { href: "/staff/dashboard", label: "Dashboard", icon: Home },
  { href: "/staff/events", label: "Event Creation", icon: BarChart2 },
  { href: "/staff/manage", label: "Student Management", icon: Receipt },
  { href: "/staff/events/feedbacks", label: "Feedback", icon: MessagesSquare },
  { href: "/staff/workshop", label: "Workshop", icon: Shield },
  // { href: "/join-request", label: "Join Request", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const studentNavItems: NavItemType[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: Home },
  { href: "/student/events", label: "Events", icon: Video },
  { href: "/student/workshop", label: "Workshop", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const VisitorNavItems: NavItemType[] = [
  { href: "/events", label: "Events", icon: Video },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

interface SidebarProps {
  role: "administrator" | "hod" | "staff" | "student" | "";
}

export default function Sidebar({ role }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  // Determine which nav items to display based on the role
  let navItems: NavItemType[];
  switch (role) {
    case "administrator":
      navItems = adminNavItems;
      break;
    case "hod":
      navItems = hodNavItems;
      break;
    case "staff":
      navItems = staffNavItems;
      break;
    case "student":
      navItems = studentNavItems;
      break;
    default:
      navItems = [];
  }

  const topNavItems = navItems.filter(
    (item) => item.href !== "/settings" && item.href !== "/help",
  );
  const bottomNavItems = navItems.filter(
    (item) => item.href === "/settings" || item.href === "/help",
  );

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: any;
    children: React.ReactNode;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <Link
            href="https://xhelios.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-center gap-3">
              <Image
                src="https://xhelios.vercel.app/logobw.png"
                alt="Logo"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="https://xhelios.vercel.app/logobw.png"
                alt="Logo"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
              />
              <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                X-Helios
              </span>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-1">
              {topNavItems.map((item) => (
                <NavItem key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </NavItem>
              ))}
            </div>
          </div>

          {/* Bottom Navigation with Settings and Help */}
          {bottomNavItems.length > 0 && (
            <div className="px-4 pb-4">
              <div className="space-y-1">
                {bottomNavItems.map((item) => (
                  <NavItem key={item.href} href={item.href} icon={item.icon}>
                    {item.label}
                  </NavItem>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
