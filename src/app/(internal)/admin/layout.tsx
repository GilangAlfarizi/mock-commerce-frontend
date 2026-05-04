"use client";

import type { ReactNode } from "react";

import { AdminShell } from "@/features/internal/components/admin-shell";
import { RequireAuth } from "@/features/internal/components/require-auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<RequireAuth>
				<AdminShell>{children}</AdminShell>
			</RequireAuth>
		</div>
	);
}
