import { api } from "@/services/axios";
import type {
	AdminOrderDetailDTO,
	CustomerDetailUpdateInput,
	OrderDetailUpdateInput,
	OrderListResponse,
	ShippingDetailUpdateInput,
} from "@/types/admin/order";

function unwrapOrderDetailPayload(data: unknown): AdminOrderDetailDTO {
	if (data && typeof data === "object" && "data" in data) {
		const inner = (data as { data: unknown }).data;
		if (inner && typeof inner === "object") return inner as AdminOrderDetailDTO;
	}
	return data as AdminOrderDetailDTO;
}

export async function listAdminOrders(
	status: "active" | "history",
): Promise<OrderListResponse> {
	const { data } = await api.get<OrderListResponse>("/admin/orders", {
		params: { status: status },
	});
	return data;
}

export async function getAdminOrder(id: string): Promise<AdminOrderDetailDTO> {
	const { data } = await api.get<unknown>(
		`/admin/orders/${encodeURIComponent(id)}`,
	);
	return unwrapOrderDetailPayload(data);
}

export async function patchAdminOrderDetail(
	id: string,
	body: OrderDetailUpdateInput,
): Promise<void> {
	await api.patch(`/admin/orders/${encodeURIComponent(id)}/order-detail`, body);
}

export async function patchAdminOrderCustomerDetail(
	id: string,
	body: CustomerDetailUpdateInput,
): Promise<void> {
	await api.patch(
		`/admin/orders/${encodeURIComponent(id)}/customer-detail`,
		body,
	);
}

export async function patchAdminOrderShippingDetail(
	id: string,
	body: ShippingDetailUpdateInput,
): Promise<void> {
	await api.patch(
		`/admin/orders/${encodeURIComponent(id)}/shipping-detail`,
		body,
	);
}
