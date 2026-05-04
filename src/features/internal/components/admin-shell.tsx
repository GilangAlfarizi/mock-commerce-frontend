"use client";

import * as React from "react";

import { AdminSidebar } from "./admin-sidebar";

export type AdminShellProps = {
	children: React.ReactNode;
};

function AdminShell({ children }: AdminShellProps) {
	return (
		<div className="flex min-h-0 flex-1">
			<AdminSidebar />
			<div className="min-h-0 flex-1 overflow-auto p-6 lg:p-8">{children}</div>
		</div>
	);
}

export { AdminShell };
