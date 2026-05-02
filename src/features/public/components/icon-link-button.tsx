import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type IconLinkButtonProps = {
	href: string;
	icon: LucideIcon;
	tooltip?: string;
	side?: "top" | "right" | "bottom" | "left";
};

export default function IconLinkButton({
	href,
	icon: Icon,
	tooltip,
	side,
}: IconLinkButtonProps) {
	const button = (
		<Button
			variant="outline"
			size="default"
			className="rounded-none border-black bg-cream"
			asChild>
			<Link href={href}>
				<Icon className="size-4"></Icon>
			</Link>
		</Button>
	);

	if (!tooltip) return button;

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipContent side={side}>{tooltip}</TooltipContent>
		</Tooltip>
	);
}
