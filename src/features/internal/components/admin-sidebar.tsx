"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	FolderTree,
	LayoutDashboard,
	Package,
	Receipt,
	Shapes,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useLogout } from "@/hooks/use-logout";

const nav = [
	{ href: "/admin/categories", label: "Categories", icon: FolderTree },
	{ href: "/admin/products", label: "Products", icon: Package },
	{ href: "/admin/variants", label: "Variants", icon: Shapes },
	{ href: "/admin/orders", label: "Orders", icon: Receipt },
] as const;

function AdminSidebar() {
	const pathname = usePathname();
	const { status, user } = useAuthSession();
	const logout = useLogout();

	return (
		<aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-muted/30">
			<div className="flex items-center gap-2 px-4 py-4">
				<LayoutDashboard className="size-5 text-muted-foreground" aria-hidden />
				<span className="text-sm font-semibold">Admin</span>
			</div>
			<nav className="flex flex-1 flex-col gap-0.5 px-2">
				{nav.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(`${href}/`);
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								"flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
								active
									? "bg-background font-medium text-foreground shadow-sm"
									: "text-muted-foreground hover:bg-background/60 hover:text-foreground",
							)}>
							<Icon className="size-4 shrink-0" aria-hidden />
							{label}
						</Link>
					);
				})}
			</nav>
			<div className="mt-auto space-y-3 p-3">
				<Separator />
				{status === "authenticated" ? (
					<div className="space-y-2 rounded-xl border border-border bg-background/80 px-3 py-2">
						<p className="truncate text-xs font-medium">{user.name}</p>
						<p className="truncate text-xs text-muted-foreground">
							{user.email}
						</p>
						<Badge variant="outline" className="text-[10px]">
							{user.role}
						</Badge>
					</div>
				) : null}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full"
					onClick={logout}>
					Log out
				</Button>
			</div>
		</aside>
	);
}

export { AdminSidebar };
