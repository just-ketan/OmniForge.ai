"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/brands", label: "Brands" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">
        OmniForge
      </h1>

      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 hover:bg-zinc-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}