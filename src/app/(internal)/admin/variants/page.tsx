"use client";

import * as React from "react";

import { VariantsView } from "@/features/internal/variants";

export default function AdminVariantsPage() {
	return (
		<React.Suspense fallback={null}>
			<VariantsView />
		</React.Suspense>
	);
}
