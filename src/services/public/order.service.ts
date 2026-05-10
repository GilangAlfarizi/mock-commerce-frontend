import { api } from "@/services/axios";
import type { AdminOrderDetailDTO } from "@/types/admin/order";

function unwrapOrderDetailPayload(data: unknown): AdminOrderDetailDTO {
	if (data && typeof data === "object" && "data" in data) {
		const inner = (data as { data: unknown }).data;
		if (inner && typeof inner === "object") return inner as AdminOrderDetailDTO;
	}
	return data as AdminOrderDetailDTO;
}

/** `GET /order/{orderNumber}` — public tracking (no auth). */
export async function getPublicOrderByNumber(
	orderNumber: string,
): Promise<AdminOrderDetailDTO> {
	const { data } = await api.get<unknown>(
		`/order/${encodeURIComponent(orderNumber)}`,
	);
	return unwrapOrderDetailPayload(data);
}
