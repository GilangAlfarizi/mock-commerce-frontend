import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAuthSession } from "./use-auth-session";
import { OrderListResponse } from "@/types/admin/order";
import { listAdminOrders } from "@/services/admin/orders/order.service";

export const adminOrdersQueryKey = ["admin", "orders", "list"] as const;

export function useAdminActiveOrders(): UseQueryResult<
	OrderListResponse,
	Error
> {
	const { status } = useAuthSession();

	return useQuery({
		queryKey: [...adminOrdersQueryKey, "active"],
		queryFn: () => listAdminOrders("active"),
		enabled: status === "authenticated",
	});
}

type HistoryOptions = {
	/** When false, the query does not run (e.g. history panel still collapsed). */
	enabled?: boolean;
};

export function useAdminHistoryOrders(
	options?: HistoryOptions,
): UseQueryResult<OrderListResponse, Error> {
	const { status } = useAuthSession();
	const extraEnabled = options?.enabled ?? true;

	return useQuery({
		queryKey: [...adminOrdersQueryKey, "history"],
		queryFn: () => listAdminOrders("history"),
		enabled: status === "authenticated" && extraEnabled,
	});
}
