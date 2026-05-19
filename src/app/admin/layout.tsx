import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/");

  const navLinks = [
    { href: "/admin", label: "대시보드" },
    { href: "/admin/products", label: "상품 관리" },
    { href: "/admin/orders", label: "주문 관리" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-48 bg-stone-900 text-white shrink-0">
        <div className="p-4 border-b border-stone-700">
          <p className="text-xs tracking-widest text-stone-400">ADMIN</p>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 text-sm text-stone-300 hover:text-white hover:bg-stone-800 rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 bg-stone-50 overflow-auto">{children}</div>
    </div>
  );
}
