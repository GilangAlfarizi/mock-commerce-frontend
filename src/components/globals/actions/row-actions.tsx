import * as React from "react";

import { cn } from "@/lib/utils";

export type RowActionsProps = {
	children: React.ReactNode;
	className?: string;
};

function RowActions({ children, className }: RowActionsProps) {
	return <div className={cn("flex items-center justify-end gap-1", className)}>{children}</div>;
}

export { RowActions };
