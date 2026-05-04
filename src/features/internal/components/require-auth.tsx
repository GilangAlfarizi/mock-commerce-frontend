"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/hooks/use-auth-session";

export type RequireAuthProps = {
	children: React.ReactNode;
};

function RequireAuth({ children }: RequireAuthProps) {
	const { status } = useAuthSession();
	const router = useRouter();

	React.useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="flex min-h-[50vh] flex-col gap-4 p-6">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-64 w-full max-w-3xl" />
			</div>
		);
	}

	if (status === "unauthenticated") {
		return null;
	}

	return <>{children}</>;
}

export { RequireAuth };
