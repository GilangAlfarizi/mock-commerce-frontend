import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type EmptyStateProps = {
	icon?: LucideIcon;
	title: string;
	description?: string;
	children?: React.ReactNode;
	className?: string;
};

function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center",
				className,
			)}>
			{Icon ? (
				<div className="flex size-12 items-center justify-center rounded-full bg-muted">
					<Icon className="size-6 text-muted-foreground" aria-hidden />
				</div>
			) : null}
			<p className="text-sm font-medium">{title}</p>
			{description ? <p className="max-w-sm text-xs text-muted-foreground">{description}</p> : null}
			{children}
		</div>
	);
}

export { EmptyState };
