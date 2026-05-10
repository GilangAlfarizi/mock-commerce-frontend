"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";
import { getAdminOrder } from "@/services/admin/orders/order.service";
import type { AdminOrderDetailDTO } from "@/types/admin/order";

export const adminOrderDetailQueryKey = (id: string) =>
	["admin", "orders", "detail", id] as const;

export function useAdminOrderDetail(
	orderId: string | null,
	enabled: boolean,
): UseQueryResult<AdminOrderDetailDTO, Error> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: orderId ? adminOrderDetailQueryKey(orderId) : ["admin", "orders", "detail", "none"],
		queryFn: () => getAdminOrder(orderId!),
		enabled: status === "authenticated" && Boolean(orderId) && enabled,
	});
}
