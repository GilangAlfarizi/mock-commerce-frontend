"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
	useAdminProduct,
	useDeleteAdminProduct,
	useUpdateAdminProduct,
} from "@/hooks";
import { DeleteButton, EditButton } from "@/components/globals";
import React from "react";
import { AdminProductDTO } from "@/types/admin/product";

type ProductDetailViewProps = {
	id: string;
};

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 rounded-xl border bg-card p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="break-all text-sm font-medium">{value || "-"}</p>
		</div>
	);
}

function ProductDetailView({ id }: ProductDetailViewProps) {
	const { data, isPending, error } = useAdminProduct(id);
	const product = data?.data;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Product detail
					</h1>
					<p className="text-sm text-muted-foreground">
						View full product metadata without expanding table columns.
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link href="/admin/products">
						<ArrowLeft className="size-4" />
						Back to products
					</Link>
				</Button>
			</div>

			{isPending ? (
				<p className="text-sm text-muted-foreground">
					Loading product detail...
				</p>
			) : null}
			{error ? (
				<p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
			) : null}

			{product ? (
				<div className="space-y-4">
					<div className="grid gap-3 md:grid-cols-2">
						<DetailRow label="UUID" value={product.id} />
						<DetailRow label="Slug" value={product.slug} />
						<DetailRow label="Image ID" value={product.imageFileId} />
						<DetailRow label="Category" value={product.categoryName} />
					</div>
					<div className="grid gap-2 rounded-xl border bg-card p-3">
						<p className="text-xs text-muted-foreground">Description</p>
						<p className="text-sm">{product.description || "-"}</p>
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
					) : null}
				</div>
			) : null}
		</div>
	);
}

export { ProductDetailView };
