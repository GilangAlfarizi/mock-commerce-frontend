"use client";

import * as React from "react";

import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminSidebar } from "./admin-sidebar";

export type AdminShellProps = {
	children: React.ReactNode;
};

function AdminShell({ children }: AdminShellProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col md:flex-row">
			<AdminSidebar />
			<div className="flex min-h-0 flex-1 flex-col">
				<AdminMobileNav />
				<main className="min-h-0 flex-1 overflow-auto px-4 py-6 sm:px-6 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}

export { AdminShell };
