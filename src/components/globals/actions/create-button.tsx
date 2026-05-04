"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CreateButtonProps = React.ComponentProps<typeof Button> & {
	label?: string;
};

function CreateButton({ label = "New", className, children, ...props }: CreateButtonProps) {
	return (
		<Button type="button" className={cn("gap-1.5", className)} {...props}>
			<Plus className="size-4" aria-hidden />
			{children ?? label}
		</Button>
	);
}

export { CreateButton };
