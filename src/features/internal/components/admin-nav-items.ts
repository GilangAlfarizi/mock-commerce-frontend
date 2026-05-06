import type { LucideIcon } from "lucide-react";
import {
	FolderTree,
	LayoutDashboard,
	Package,
	Receipt,
	Shapes,
} from "lucide-react";

export type AdminNavItem = {
	href: string;
	label: string;
	icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/categories", label: "Categories", icon: FolderTree },
	{ href: "/admin/products", label: "Products", icon: Package },
	{ href: "/admin/variants", label: "Variants", icon: Shapes },
	{ href: "/admin/orders", label: "Orders", icon: Receipt },
];

export function isAdminNavItemActive(pathname: string, href: string) {
	if (href === "/admin") return pathname === "/admin";
	return pathname === href || pathname.startsWith(`${href}/`);
}
