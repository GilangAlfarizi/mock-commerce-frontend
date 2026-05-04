"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type DeleteButtonProps = Omit<React.ComponentProps<typeof Button>, "children" | "variant">;

function DeleteButton(props: DeleteButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button type="button" size="icon-sm" variant="destructive" {...props}>
					<Trash2 className="size-4" />
					<span className="sr-only">Delete</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>Delete</TooltipContent>
		</Tooltip>
	);
}

export { DeleteButton };
