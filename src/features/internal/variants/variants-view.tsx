"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Package, Shapes } from "lucide-react";

import {
	ConfirmDialog,
	CreateButton,
	DataTable,
	DeleteButton,
	EditButton,
	EmptyState,
	PageHeader,
	RowActions,
} from "@/components/globals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useAdminProducts,
	useAdminVariants,
	useCreateAdminVariant,
	useDeleteAdminVariant,
	useUpdateAdminVariant,
} from "@/hooks";
import { formatIdr } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import type { AdminVariantDTO } from "@/types/admin/variant";

import { buildVariantColumns } from "./variant-columns";
import { VariantFormDialog } from "./variant-form-dialog";

const fieldClassName = cn(
	"w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
);

function VariantsView() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const productId = searchParams?.get("productId") ?? "";

	const { data: productsData, isPending: productsPending } = useAdminProducts();
	const variantProducts = React.useMemo(
		() => (productsData?.data ?? []).filter((p) => p.hasVariant),
		[productsData?.data],
	);
	const selectedProduct = React.useMemo(
		() => variantProducts.find((p) => p.id === productId),
		[variantProducts, productId],
	);

	const {
		data: variantsData,
		isPending: variantsPending,
		error: variantsError,
	} = useAdminVariants(productId || undefined);

	const createMutation = useCreateAdminVariant();
	const updateMutation = useUpdateAdminVariant();
	const deleteMutation = useDeleteAdminVariant();

	const [formOpen, setFormOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
	const [editing, setEditing] = React.useState<AdminVariantDTO | null>(null);
	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [deleteTarget, setDeleteTarget] =
		React.useState<AdminVariantDTO | null>(null);

	const activeMutation =
		formMode === "create" ? createMutation : updateMutation;
	const formError = activeMutation.error;

	const setProductId = React.useCallback(
		(next: string) => {
			const params = new URLSearchParams(searchParams?.toString());
			if (next) {
				params.set("productId", next);
			} else {
				params.delete("productId");
			}
			const qs = params.toString();
			router.replace(qs ? `${pathname}?${qs}` : pathname);
		},
		[pathname, router, searchParams],
	);

	const openCreate = () => {
		if (!productId) return;
		setFormMode("create");
		setEditing(null);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const openEdit = (row: AdminVariantDTO) => {
		setFormMode("edit");
		setEditing(row);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const openDelete = (row: AdminVariantDTO) => {
		setDeleteTarget(row);
		setDeleteOpen(true);
	};

	const columns = React.useMemo(
		() => buildVariantColumns({ product: selectedProduct }),
		[selectedProduct],
	);

	return (
		<div>
			<PageHeader
				title="Variants"
				description="Manage SKUs for variant products. Stock and price live on the variant; the product price is used as the effective fallback when the variant price is 0."
				actions={
					productId ? (
						<CreateButton
							label="New variant"
							onClick={openCreate}
							disabled={!selectedProduct}
						/>
					) : null
				}
			/>

			<div className="mb-4 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
				<div className="grid gap-2">
					<label
						htmlFor="variant-product-picker"
						className="text-xs font-medium text-muted-foreground">
						Product
					</label>
					<select
						id="variant-product-picker"
						value={productId}
						onChange={(e) => setProductId(e.target.value)}
						disabled={productsPending}
						className={cn(fieldClassName, "h-9 py-1")}>
						<option value="">
							{productsPending
								? "Loading products…"
								: variantProducts.length === 0
									? "No variant products available"
									: "Select a variant product"}
						</option>
						{variantProducts.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					asChild
					className="self-end">
					<Link href="/admin/products">
						<ArrowLeft className="size-4" />
						Back to products
					</Link>
				</Button>
			</div>

			{selectedProduct ? (
				<div className="mb-4 grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
					<div className="min-w-0 space-y-1">
						<p className="truncate text-base font-medium">
							{selectedProduct.name}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{selectedProduct.categoryName} · {selectedProduct.slug}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Base price</p>
						<p className="text-sm font-medium tabular-nums">
							{formatIdr(selectedProduct.price)}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Total stock</p>
						<p className="text-sm font-medium tabular-nums">
							{selectedProduct.totalStock}
						</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">Status</p>
						{selectedProduct.isActive ? (
							<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
								Published
							</Badge>
						) : (
							<Badge variant="outline" className="text-muted-foreground">
								Draft
							</Badge>
						)}
					</div>
				</div>
			) : null}

			{!productId ? (
				<EmptyState
					icon={Shapes}
					title="Pick a product"
					description={
						variantProducts.length === 0
							? "No variant products yet. Toggle a product to “Variant product” in the products page to get started."
							: "Choose a variant product above to manage its SKUs."
					}
				/>
			) : (
				<DataTable
					data={variantsData?.data}
					columns={columns}
					getRowKey={(row) => row.id}
					isLoading={variantsPending}
					error={variantsError}
					emptyState={
						<EmptyState
							icon={Package}
							title="No variants yet"
							description="Create variants (SKU, size, color, stock, price) so this product can be published."
						/>
					}
					rowActions={(row) => (
						<RowActions>
							<EditButton onClick={() => openEdit(row)} />
							<DeleteButton onClick={() => openDelete(row)} />
						</RowActions>
					)}
				/>
			)}

			<VariantFormDialog
				open={formOpen}
				onOpenChange={(open) => {
					setFormOpen(open);
					if (!open) {
						setEditing(null);
						createMutation.reset();
						updateMutation.reset();
					}
				}}
				mode={formMode}
				initial={editing}
				productName={selectedProduct?.name ?? ""}
				isPending={activeMutation.isPending}
				error={formError}
				onSubmit={(input) => {
					if (!productId) return;
					if (formMode === "create") {
						createMutation.mutate(
							{ productId, input },
							{
								onSuccess: () => {
									setFormOpen(false);
									setEditing(null);
									updateMutation.reset();
								},
							},
						);
						return;
					}
					if (!editing) return;
					updateMutation.mutate(
						{ productId, variantId: editing.id, input },
						{
							onSuccess: () => {
								setFormOpen(false);
								setEditing(null);
								createMutation.reset();
							},
						},
					);
				}}
			/>

			<ConfirmDialog
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);
					if (!open) setDeleteTarget(null);
				}}
				title="Delete variant?"
				description={
					deleteTarget
						? `This will remove SKU "${deleteTarget.sku}". Stock for this variant will be lost.`
						: undefined
				}
				confirmLabel="Delete"
				variant="destructive"
				loading={deleteMutation.isPending}
				onConfirm={async () => {
					if (!productId || !deleteTarget) return;
					await deleteMutation.mutateAsync({
						productId,
						variantId: deleteTarget.id,
					});
					setDeleteTarget(null);
				}}
			/>
		</div>
	);
}

export { VariantsView };
