"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type EditButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "asChild"> & {
	href?: string;
};

function EditButton({ href, onClick, disabled, className, ...props }: EditButtonProps) {
	const content = (
		<>
			<Pencil className="size-4" />
			<span className="sr-only">Edit</span>
		</>
	);

	const trigger = href ? (
		<Button type="button" size="icon-sm" variant="outline" className={className} disabled={disabled} asChild {...props}>
			<Link href={href}>{content}</Link>
		</Button>
	) : (
		<Button
			type="button"
			size="icon-sm"
			variant="outline"
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
			<TooltipContent>Edit</TooltipContent>
		</Tooltip>
	);
}

export { EditButton };
