"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AdminVariantDTO, VariantInput } from "@/types/admin/variant";

type VariantFormBodyProps = {
	mode: "create" | "edit";
	initial: AdminVariantDTO | null;
	productName: string;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (input: VariantInput) => void;
	onCancel: () => void;
};

function VariantFormBody({
	mode,
	initial,
	productName,
	isPending,
	error,
	onSubmit,
	onCancel,
}: VariantFormBodyProps) {
	const [sku, setSku] = React.useState(
		mode === "edit" && initial ? initial.sku : "",
	);
	const [size, setSize] = React.useState(
		mode === "edit" && initial ? initial.size : "",
	);
	const [color, setColor] = React.useState(
		mode === "edit" && initial ? initial.color : "",
	);
	const [stock, setStock] = React.useState(
		mode === "edit" && initial ? String(initial.stock) : "",
	);
	const [price, setPrice] = React.useState(
		mode === "edit" && initial ? String(initial.price) : "",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmedSku = sku.trim();
		if (!trimmedSku) return;

		const parsedStock = Number(stock);
		const parsedPrice = Number(price);
		if (!Number.isInteger(parsedStock) || parsedStock < 0) return;
		if (!Number.isInteger(parsedPrice) || parsedPrice < 0) return;

		onSubmit({
			sku: trimmedSku,
			size: size.trim() || undefined,
			color: color.trim() || undefined,
			stock: parsedStock,
			price: parsedPrice,
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<DialogTitle>
					{mode === "create" ? "New variant" : "Edit variant"}
				</DialogTitle>
				<DialogDescription>
					{productName
						? `Variant for "${productName}". `
						: ""}
					SKU is required and must be unique. Stock and price use whole-number
					values.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-3 py-2">
				<div className="grid gap-2">
					<Label htmlFor="variant-sku">SKU</Label>
					<Input
						id="variant-sku"
						name="sku"
						autoComplete="off"
						value={sku}
						onChange={(e) => setSku(e.target.value)}
						disabled={isPending}
						placeholder="e.g. Hoodie-M-BLK"
						required
					/>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="grid gap-2">
						<Label htmlFor="variant-size">Size</Label>
						<Input
							id="variant-size"
							name="size"
							autoComplete="off"
							value={size}
							onChange={(e) => setSize(e.target.value)}
							disabled={isPending}
							placeholder="e.g. M"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="variant-color">Color</Label>
						<Input
							id="variant-color"
							name="color"
							autoComplete="off"
							value={color}
							onChange={(e) => setColor(e.target.value)}
							disabled={isPending}
							placeholder="e.g. Black"
						/>
					</div>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="grid gap-2">
						<Label htmlFor="variant-stock">Stock</Label>
						<Input
							id="variant-stock"
							name="stock"
							type="number"
							inputMode="numeric"
							min={0}
							autoComplete="off"
							value={stock}
							onChange={(e) => setStock(e.target.value)}
							disabled={isPending}
							placeholder="0"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="variant-price">Variant price (IDR)</Label>
						<Input
							id="variant-price"
							name="price"
							type="number"
							inputMode="numeric"
							min={0}
							autoComplete="off"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							disabled={isPending}
							placeholder="0"
							required
						/>
					</div>
				</div>
				{error ? (
					<p className="text-sm text-destructive" role="alert">
						{getApiErrorMessage(error)}
					</p>
				) : null}
			</div>
			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					disabled={isPending}
					onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isPending}>
					{isPending ? "Saving…" : mode === "create" ? "Create" : "Save"}
				</Button>
			</DialogFooter>
		</form>
	);
}

export type VariantFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
	initial?: AdminVariantDTO | null;
	productName: string;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (input: VariantInput) => void;
};

function VariantFormDialog({
	open,
	onOpenChange,
	mode,
	initial,
	productName,
	isPending,
	error,
	onSubmit,
}: VariantFormDialogProps) {
	const formKey = `${mode}-${initial?.id ?? "new"}`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={!isPending} className="max-w-lg">
				{open ? (
					<VariantFormBody
						key={formKey}
						mode={mode}
						initial={initial ?? null}
						productName={productName}
						isPending={isPending}
						error={error}
						onSubmit={onSubmit}
						onCancel={() => onOpenChange(false)}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}

export { VariantFormDialog };
