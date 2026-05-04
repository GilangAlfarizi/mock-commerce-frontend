"use client";

import * as React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type ViewDetailButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "asChild"> & {
	href?: string;
};

function ViewDetailButton({ href, onClick, disabled, className, ...props }: ViewDetailButtonProps) {
	const content = (
		<>
			<Eye className="size-4" />
			<span className="sr-only">View</span>
		</>
	);

	const trigger = href ? (
		<Button type="button" size="icon-sm" variant="ghost" className={className} disabled={disabled} asChild {...props}>
			<Link href={href}>{content}</Link>
		</Button>
	) : (
		<Button
			type="button"
			size="icon-sm"
			variant="ghost"
			className={className}
			disabled={disabled}
			onClick={onClick}
			{...props}>
			{content}
		</Button>
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>{trigger}</TooltipTrigger>
			<TooltipContent>View</TooltipContent>
		</Tooltip>
	);
}

export { ViewDetailButton };
