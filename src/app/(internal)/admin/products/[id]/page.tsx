"use client";

import { useParams } from "next/navigation";
import { ProductDetailView } from "@/features/internal/products/product-detail-view";

export default function AdminProductDetailPage() {
	const params = useParams<{ id: string }>();
	const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

	if (!id) return null;

	return <ProductDetailView id={id} />;
}
