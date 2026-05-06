"use client";

import * as React from "react";
import Image from "next/image";
import { AlertTriangle, Info } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import type { AdminCategoryDTO } from "@/types/admin/category";
import type {
	AdminProductDTO,
	ProductCreateInput,
	ProductUpdateInput,
} from "@/types/admin/product";

const fieldClassName = cn(
	"w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
);

export type ProductFormSubmit =
	| { mode: "create"; data: ProductCreateInput }
	| { mode: "edit"; data: ProductUpdateInput };

type ProductFormBodyProps = {
	mode: "create" | "edit";
	initial: AdminProductDTO | null;
	categories: AdminCategoryDTO[];
	categoriesLoading: boolean;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (payload: ProductFormSubmit) => void;
	onCancel: () => void;
};

function ProductFormBody({
	mode,
	initial,
	categories,
	categoriesLoading,
	isPending,
	error,
	onSubmit,
	onCancel,
}: ProductFormBodyProps) {
	const initialHasVariant =
		mode === "edit" && initial ? initial.hasVariant : false;

	const [name, setName] = React.useState(
		mode === "edit" && initial ? initial.name : "",
	);
	const [description, setDescription] = React.useState(
		mode === "edit" && initial ? initial.description : "",
	);
	const [price, setPrice] = React.useState(
		mode === "edit" && initial ? String(initial.price) : "",
	);
	const [categoryId, setCategoryId] = React.useState(
		mode === "edit" && initial ? initial.categoryId : "",
	);
	const [hasVariant, setHasVariant] = React.useState(initialHasVariant);
	const [stock, setStock] = React.useState("");
	const [image, setImage] = React.useState<File | null>(null);

	const isVariantLocked = mode === "edit" && initialHasVariant === true;
	const isConverting = mode === "edit" && !initialHasVariant && hasVariant;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedDescription = description.trim();
		if (!trimmedName || !trimmedDescription) return;
		if (!categoryId) return;

		const parsedPrice = Number(price);
		if (!Number.isFinite(parsedPrice) || parsedPrice < 0) return;

		if (mode === "create") {
			if (!image) return;

			let parsedStock: number | undefined;
			if (!hasVariant) {
				parsedStock = Number(stock);
				if (!Number.isFinite(parsedStock) || parsedStock < 0) return;
			}

			const data: ProductCreateInput = {
				name: trimmedName,
				description: trimmedDescription,
				price: parsedPrice,
				categoryId,
				hasVariant,
				stock: parsedStock,
				image,
			};
			onSubmit({ mode: "create", data });
			return;
		}

		const data: ProductUpdateInput = {
			name: trimmedName,
			description: trimmedDescription,
			price: parsedPrice,
			categoryId,
			hasVariant,
			isActive: isConverting ? false : undefined,
			image: image ?? undefined,
		};
		onSubmit({ mode: "edit", data });
	};

	return (
		<form onSubmit={handleSubmit}>
			<DialogHeader>
				<DialogTitle>
					{mode === "create" ? "New product" : "Edit product"}
				</DialogTitle>
				<DialogDescription>
					Slug is generated on the server when you save. Set listing details and
					choose between a simple product (single stock) or a variant product
					(SKUs created in Variants).
				</DialogDescription>
			</DialogHeader>
			<div className="grid max-h-[min(70vh,32rem)] gap-3 overflow-y-auto py-2 pr-1">
				<div className="grid gap-2">
					<Label htmlFor="product-name">Name</Label>
					<Input
						id="product-name"
						name="name"
						autoComplete="off"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isPending}
						placeholder="e.g. Linen overshirt"
						required
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="product-description">Description</Label>
					<textarea
						id="product-description"
						name="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						disabled={isPending}
						placeholder="Short listing copy for the storefront"
						required
						rows={4}
						className={cn(fieldClassName, "min-h-24 resize-y")}
					/>
				</div>
				<div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
					<div className="grid gap-2">
						<Label htmlFor="product-price">Price (IDR)</Label>
						<Input
							id="product-price"
							name="price"
							inputMode="decimal"
							autoComplete="off"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							disabled={isPending}
							placeholder="0"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="product-category">Category</Label>
						<select
							id="product-category"
							name="categoryId"
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							disabled={isPending || categoriesLoading}
							required
							className={cn(fieldClassName, "h-9 py-1")}>
							<option value="">
								{categoriesLoading ? "Loading…" : "Select a category"}
							</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="rounded-2xl border border-border bg-muted/20 p-3">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1">
							<Label htmlFor="product-has-variant" className="font-medium">
								Variant product
							</Label>
							<p className="text-xs text-muted-foreground">
								Off = simple product with a single stock value. On = create
								separate SKUs in the Variants page.
							</p>
						</div>
						<Switch
							id="product-has-variant"
							checked={hasVariant}
							onCheckedChange={(next) => setHasVariant(Boolean(next))}
							disabled={isPending || isVariantLocked}
						/>
					</div>

					{isVariantLocked ? (
						<p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
							<Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
							Variant -&gt; simple conversion is not supported.
						</p>
					) : null}

					{!hasVariant && mode === "create" ? (
						<div className="mt-3 grid gap-2">
							<Label htmlFor="product-stock">Stock</Label>
							<Input
								id="product-stock"
								name="stock"
								type="number"
								min={0}
								inputMode="numeric"
								autoComplete="off"
								value={stock}
								onChange={(e) => setStock(e.target.value)}
								disabled={isPending}
								placeholder="0"
								required
							/>
							<p className="text-xs text-muted-foreground">
								The backend creates a single default variant with this stock
								value.
							</p>
						</div>
					) : null}

					{!hasVariant && mode === "edit" && initial ? (
						<div className="mt-3 rounded-xl border border-dashed bg-background p-3">
							<p className="text-xs text-muted-foreground">Total stock</p>
							<p className="text-sm font-medium">{initial.totalStock}</p>
							<p className="mt-1 text-xs text-muted-foreground">
								Stock is managed in Variants -&gt; default variant for simple
								products.
							</p>
						</div>
					) : null}

					{hasVariant ? (
						<p className="mt-3 flex items-start gap-1.5 rounded-xl border border-dashed bg-background px-3 py-2 text-xs text-muted-foreground">
							<Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
							This product requires variants before it can be published.
						</p>
					) : null}

					{isConverting ? (
						<p className="mt-3 flex items-start gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
							<AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
							Converting to a variant product will require variants before
							publishing. The product will be saved as draft.
						</p>
					) : null}
				</div>

				<div className="grid gap-2">
					<Label htmlFor="product-image">
						Image{" "}
						{mode === "create" ? "(required)" : "(optional — replaces current)"}
					</Label>
					{mode === "edit" && initial?.imageUrl ? (
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">Current image</p>
							<Image
								src={initial.imageUrl}
								alt={initial.name}
								width={96}
								height={96}
								className="size-24 rounded-md border object-cover"
							/>
						</div>
					) : null}
					<Input
						id="product-image"
						name="image"
						type="file"
						accept="image/*"
						disabled={isPending}
						required={mode === "create"}
						onChange={(e) => {
							const file = e.target.files?.[0];
							setImage(file ?? null);
						}}
					/>
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

export type ProductFormDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode: "create" | "edit";
	initial?: AdminProductDTO | null;
	categories?: AdminCategoryDTO[];
	categoriesLoading?: boolean;
	isPending: boolean;
	error: unknown | null;
	onSubmit: (payload: ProductFormSubmit) => void;
};

function ProductFormDialog({
	open,
	onOpenChange,
	mode,
	initial,
	categories = [],
	categoriesLoading = false,
	isPending,
	error,
	onSubmit,
}: ProductFormDialogProps) {
	const formKey = `${mode}-${initial?.id ?? "new"}`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={!isPending} className="max-w-lg">
				{open ? (
					<ProductFormBody
						key={formKey}
						mode={mode}
						initial={initial ?? null}
						categories={categories}
						categoriesLoading={categoriesLoading}
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

export { ProductFormDialog };
