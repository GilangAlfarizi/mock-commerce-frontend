"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	patchAdminOrderCustomerDetail,
	patchAdminOrderDetail,
	patchAdminOrderShippingDetail,
} from "@/services/admin/orders/order.service";
import { adminOrdersQueryKey } from "./use-admin-orders";
import { adminOrderDetailQueryKey } from "./use-admin-order-detail";
import type {
	CustomerDetailUpdateInput,
	OrderDetailUpdateInput,
	ShippingDetailUpdateInput,
} from "@/types/admin/order";

function invalidateOrderQueries(qc: ReturnType<typeof useQueryClient>, id: string) {
	qc.invalidateQueries({ queryKey: [...adminOrdersQueryKey] });
	qc.invalidateQueries({ queryKey: adminOrderDetailQueryKey(id) });
}

export function usePatchAdminOrderDetail() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: OrderDetailUpdateInput }) =>
			patchAdminOrderDetail(id, body),
		onSuccess: (_, { id }) => invalidateOrderQueries(qc, id),
	});
}

export function usePatchAdminOrderCustomerDetail() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: CustomerDetailUpdateInput }) =>
			patchAdminOrderCustomerDetail(id, body),
		onSuccess: (_, { id }) => invalidateOrderQueries(qc, id),
	});
}

export function usePatchAdminOrderShippingDetail() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: ShippingDetailUpdateInput }) =>
			patchAdminOrderShippingDetail(id, body),
		onSuccess: (_, { id }) => invalidateOrderQueries(qc, id),
	});
}
