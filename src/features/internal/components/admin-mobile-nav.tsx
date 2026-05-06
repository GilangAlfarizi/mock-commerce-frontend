"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";

import { adminNavItems, isAdminNavItemActive } from "./admin-nav-items";

function AdminMobileNav() {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();
	const { status, user } = useAuthSession();
	const logout = useLogout();

	const closeDrawer = React.useCallback(() => setOpen(false), []);

	return (
		<>
			<header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="size-9"
					aria-label="Open navigation menu"
					onClick={() => setOpen(true)}>
					<Menu className="size-5" />
				</Button>
				<div className="flex items-center gap-2">
					<LayoutDashboard
						className="size-5 text-muted-foreground"
						aria-hidden
					/>
					<span className="text-sm font-semibold">Admin</span>
				</div>
			</header>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent
					side="left"
					className="md:hidden"
					aria-describedby="admin-mobile-nav-desc">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2">
							<LayoutDashboard
								className="size-5 text-muted-foreground"
								aria-hidden
							/>
							Admin
						</SheetTitle>
						<SheetDescription id="admin-mobile-nav-desc">
							Navigate the admin sections.
						</SheetDescription>
					</SheetHeader>
					<nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
						{adminNavItems.map(({ href, label, icon: Icon }) => {
							const active = isAdminNavItemActive(pathname ?? "", href);
							return (
								<Link
									key={href}
									href={href}
									onClick={closeDrawer}
									className={cn(
										"flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors",
										active
											? "bg-muted font-medium text-foreground"
											: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
									)}>
									<Icon className="size-5 shrink-0" aria-hidden />
									{label}
								</Link>
							);
						})}
					</nav>
					<div className="mt-auto space-y-3 border-t border-border p-4">
						<Separator className="hidden" />
						{status === "authenticated" ? (
							<div className="space-y-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
								<p className="truncate text-sm font-medium">{user.name}</p>
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
							onClick={() => {
								setOpen(false);
								logout();
							}}>
							Log out
						</Button>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
}

export { AdminMobileNav };
