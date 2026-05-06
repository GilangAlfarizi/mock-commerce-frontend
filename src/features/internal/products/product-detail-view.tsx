"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff, Shapes } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DataTable, EmptyState, type DataTableColumn } from "@/components/globals";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatIdr } from "@/lib/format-currency";
import {
	useAdminProduct,
	useAdminVariants,
	usePublishAdminProduct,
} from "@/hooks";
import type { AdminVariantDTO } from "@/types/admin/variant";

type ProductDetailViewProps = {
	id: string;
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="grid gap-1 rounded-xl border bg-card p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<div className="break-all text-sm font-medium">{value || "—"}</div>
		</div>
	);
}

const variantSummaryColumns: DataTableColumn<AdminVariantDTO>[] = [
	{
		id: "sku",
		header: "SKU",
		cell: (row) => <span className="font-mono text-xs">{row.sku || "—"}</span>,
	},
	{ id: "size", header: "Size", cell: (row) => row.size || "—" },
	{ id: "color", header: "Color", cell: (row) => row.color || "—" },
	{
		id: "stock",
		header: "Stock",
		align: "right",
		cell: (row) => <span className="tabular-nums">{row.stock}</span>,
	},
	{
		id: "price",
		header: "Variant price",
		align: "right",
		cell: (row) => (
			<span className="tabular-nums">
				{row.price > 0 ? formatIdr(row.price) : "—"}
			</span>
		),
	},
];

function ProductDetailView({ id }: ProductDetailViewProps) {
	const { data, isPending, error } = useAdminProduct(id);
	const product = data?.data;

	const variantsQuery = useAdminVariants(
		product?.hasVariant ? id : undefined,
	);
	const publishMutation = usePublishAdminProduct();

	const [optimisticActive, setOptimisticActive] = React.useState<
		boolean | null
	>(null);
	const [publishError, setPublishError] = React.useState<string | null>(null);
	const [pendingPublish, setPendingPublish] = React.useState(false);

	const isActive =
		optimisticActive !== null ? optimisticActive : (product?.isActive ?? false);

	const onTogglePublish = (next: boolean) => {
		if (!product) return;
		setPublishError(null);
		setOptimisticActive(next);
		setPendingPublish(true);
		publishMutation.mutate(
			{ id: product.id, isActive: next },
			{
				onSuccess: () => {
					setOptimisticActive(null);
					setPendingPublish(false);
				},
				onError: (err) => {
					setOptimisticActive(null);
					setPendingPublish(false);
					setPublishError(getApiErrorMessage(err));
				},
			},
		);
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Product detail
					</h1>
					<p className="text-sm text-muted-foreground">
						View metadata, manage publish state, and jump to variants.
					</p>
				</div>
				<Button variant="outline" asChild className="self-start sm:self-auto">
					<Link href="/admin/products">
						<ArrowLeft className="size-4" />
						Back to products
					</Link>
				</Button>
			</div>

			{isPending ? (
				<p className="text-sm text-muted-foreground">
					Loading product detail…
				</p>
			) : null}
			{error ? (
				<p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
			) : null}

			{product ? (
				<div className="space-y-4">
					<div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="text-lg font-medium">{product.name}</h2>
							{product.hasVariant ? (
								<Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
									Variant
								</Badge>
							) : (
								<Badge variant="outline">Simple</Badge>
							)}
							{isActive ? (
								<Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
									Published
								</Badge>
							) : (
								<Badge variant="outline" className="text-muted-foreground">
									Draft
								</Badge>
							)}
						</div>
						<div className="flex items-center gap-3">
							<span className="text-xs text-muted-foreground">
								{isActive ? "Published" : "Draft"}
							</span>
							<Switch
								checked={isActive}
								onCheckedChange={(next) => onTogglePublish(Boolean(next))}
								disabled={pendingPublish}
								aria-label={
									isActive
										? `Unpublish ${product.name}`
										: `Publish ${product.name}`
								}
							/>
						</div>
					</div>

					{publishError ? (
						<div
							role="alert"
							className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							<p className="font-medium">Could not update publish state</p>
							<p className="text-xs text-destructive/90">{publishError}</p>
						</div>
					) : null}

					<div className="grid gap-3 md:grid-cols-2">
						<DetailRow label="UUID" value={product.id} />
						<DetailRow label="Slug" value={product.slug} />
						<DetailRow label="Category" value={product.categoryName} />
						<DetailRow label="Image ID" value={product.imageFileId} />
						<DetailRow label="Base price" value={formatIdr(product.price)} />
						<DetailRow label="Total stock" value={String(product.totalStock)} />
					</div>
					<div className="grid gap-2 rounded-xl border bg-card p-3">
						<p className="text-xs text-muted-foreground">Description</p>
						<p className="text-sm">{product.description || "—"}</p>
					</div>
					{product.imageUrl ? (
						<div className="grid gap-2 rounded-xl border bg-card p-3">
							<p className="text-xs text-muted-foreground">Image preview</p>
							<Image
								src={product.imageUrl}
								alt={product.name}
								width={800}
								height={800}
								className="max-h-80 w-auto rounded-md border object-cover"
							/>
						</div>
					) : (
						<div className="flex items-center gap-2 rounded-xl border border-dashed bg-card p-3 text-xs text-muted-foreground">
							<ImageOff className="size-4" aria-hidden />
							No image uploaded.
						</div>
					)}

					{product.hasVariant ? (
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-3">
								<div>
									<h3 className="text-base font-medium">Variants</h3>
									<p className="text-xs text-muted-foreground">
										Read-only summary. Use Manage variants to add, edit, or
										delete SKUs.
									</p>
								</div>
								<Button asChild size="sm" variant="outline">
									<Link href={`/admin/variants?productId=${product.id}`}>
										<Shapes className="size-4" />
										Manage variants
									</Link>
								</Button>
							</div>
							<DataTable
								data={variantsQuery.data?.data}
								columns={variantSummaryColumns}
								getRowKey={(row) => row.id}
								isLoading={variantsQuery.isPending}
								error={variantsQuery.error}
								emptyState={
									<EmptyState
										icon={Shapes}
										title="No variants yet"
										description="Add variants in the Variants page so this product can be published."
									/>
								}
							/>
						</div>
					) : null}
				</div>
			) : null}
		</div>
	);
}

export { ProductDetailView };
