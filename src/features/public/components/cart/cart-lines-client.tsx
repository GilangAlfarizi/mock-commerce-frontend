"use client";

import { Button } from "@/components/ui/button";
import {
	removeCartLine,
	updateCartLineQuantity,
} from "@/lib/cart/actions";
import type { EnrichedCartLine } from "@/types/cart";
import { formatIdr } from "@/lib/format-currency";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type CartLinesClientProps = {
	lines: EnrichedCartLine[];
};

export default function CartLinesClient({ lines }: CartLinesClientProps) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	if (lines.length === 0) {
		return (
			<p className="border border-black bg-surface px-4 py-6 text-sm text-muted-foreground">
				Your cart is empty. Browse{" "}
				<Link href="/products" className="font-semibold underline">
					products
				</Link>{" "}
				to add items.
			</p>
		);
	}

	function run(action: () => Promise<unknown>) {
		startTransition(async () => {
			await action();
			router.refresh();
		});
	}

	return (
		<div className="space-y-3">
			{lines.map((line) => (
				<div
					key={`${line.slug}-${line.variantId ?? ""}`}
					className={`flex flex-col gap-3 border border-black bg-surface p-4 sm:flex-row sm:items-center ${
						line.valid ? "" : "border-dashed opacity-90"
					}`}>
					<div className="flex min-w-0 flex-1 gap-3">
						{line.imageUrl ? (
							// eslint-disable-next-line @next/next/no-img-element -- product URLs from API vary
							<img
								src={line.imageUrl}
								alt=""
								className="size-20 border border-black object-cover"
							/>
						) : (
							<div className="size-20 shrink-0 border border-black bg-cream" />
						)}
						<div className="min-w-0 space-y-1">
							<p className="font-mono font-semibold leading-tight">{line.name}</p>
							{line.variantLabel ? (
								<p className="text-xs text-muted-foreground">{line.variantLabel}</p>
							) : null}
							{line.error ? (
								<p className="text-xs font-medium text-destructive">{line.error}</p>
							) : (
								<p className="font-mono text-sm">{formatIdr(line.unitPrice)} each</p>
							)}
						</div>
					</div>

					<div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
						{line.valid ? (
							<div className="flex items-center border border-black bg-cream">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									disabled={pending || line.quantity <= 1}
									className="rounded-none"
									onClick={() =>
										run(() =>
											updateCartLineQuantity(
												line.slug,
												line.quantity - 1,
												line.variantId,
											),
										)
									}
									aria-label="Decrease quantity">
									<Minus className="size-4" />
								</Button>
								<span className="min-w-8 text-center font-mono text-sm">
									{line.quantity}
								</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									disabled={pending}
									className="rounded-none"
									onClick={() =>
										run(() =>
											updateCartLineQuantity(
												line.slug,
												line.quantity + 1,
												line.variantId,
											),
										)
									}
									aria-label="Increase quantity">
									<Plus className="size-4" />
								</Button>
							</div>
						) : null}

						<div className="font-mono text-sm font-semibold sm:min-w-28 sm:text-right">
							{line.valid ? formatIdr(line.lineTotal) : "—"}
						</div>

						<Button
							type="button"
							variant="outline"
							size="icon"
							disabled={pending}
							className="rounded-none border-black bg-cream"
							onClick={() => run(() => removeCartLine(line.slug, line.variantId))}
							aria-label="Remove line">
							<Trash2 className="size-4" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
