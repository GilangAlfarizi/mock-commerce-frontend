"use client";

import * as React from "react";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
	useAdminOrderDetail,
	usePatchAdminOrderCustomerDetail,
	usePatchAdminOrderDetail,
	usePatchAdminOrderShippingDetail,
} from "@/hooks";
import { getApiErrorMessage } from "@/lib/api-error";
import type {
	AdminOrderDetailDTO,
	OrderDetailPatchStatus,
} from "@/types/admin/order";

const PATCHABLE_STATUSES: OrderDetailPatchStatus[] = [
	"processing",
	"shipped",
	"delivered",
	"cancelled",
];

function isPatchableStatus(s: string): s is OrderDetailPatchStatus {
	return PATCHABLE_STATUSES.includes(s as OrderDetailPatchStatus);
}

type EditSection = "order" | "customer" | "shipping";

export type OrderEditDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderId: string | null;
};

function OrderEditDialog({ open, onOpenChange, orderId }: OrderEditDialogProps) {
	const { data, isPending, error, refetch } = useAdminOrderDetail(orderId, open);
	const patchOrder = usePatchAdminOrderDetail();
	const patchCustomer = usePatchAdminOrderCustomerDetail();
	const patchShipping = usePatchAdminOrderShippingDetail();

	const [activeSection, setActiveSection] = React.useState<EditSection | null>(null);
	const [sectionError, setSectionError] = React.useState<string | null>(null);

	const [orderDraft, setOrderDraft] = React.useState({
		status: "",
		courier: "",
		trackingNumber: "",
	});
	const [customerDraft, setCustomerDraft] = React.useState({
		customerName: "",
		customerEmail: "",
		customerPhone: "",
	});
	const [shippingDraft, setShippingDraft] = React.useState({
		shippingAddress: "",
		shippingCity: "",
		shippingPostalCode: "",
	});

	const resetLocal = React.useCallback(() => {
		setActiveSection(null);
		setSectionError(null);
		setOrderDraft({ status: "", courier: "", trackingNumber: "" });
		setCustomerDraft({ customerName: "", customerEmail: "", customerPhone: "" });
		setShippingDraft({
			shippingAddress: "",
			shippingCity: "",
			shippingPostalCode: "",
		});
	}, []);

	const handleOpenChange = (next: boolean) => {
		if (!next) resetLocal();
		onOpenChange(next);
	};

	const beginEdit = (section: EditSection, detail: AdminOrderDetailDTO) => {
		setSectionError(null);
		setActiveSection(section);
		if (section === "order") {
			setOrderDraft({
				status: isPatchableStatus(detail.status) ? detail.status : "",
				courier: detail.courier ?? "",
				trackingNumber: detail.trackingNumber ?? "",
			});
		}
		if (section === "customer") {
			setCustomerDraft({
				customerName: detail.customerName ?? "",
				customerEmail: detail.customerEmail ?? "",
				customerPhone: detail.customerPhone ?? "",
			});
		}
		if (section === "shipping") {
			setShippingDraft({
				shippingAddress: detail.shippingAddress ?? "",
				shippingCity: detail.shippingCity ?? "",
				shippingPostalCode: detail.shippingPostalCode ?? "",
			});
		}
	};

	const cancelSection = (section: EditSection, detail: AdminOrderDetailDTO) => {
		setSectionError(null);
		setActiveSection(null);
		if (section === "order") {
			setOrderDraft({
				status: isPatchableStatus(detail.status) ? detail.status : "",
				courier: detail.courier ?? "",
				trackingNumber: detail.trackingNumber ?? "",
			});
		}
		if (section === "customer") {
			setCustomerDraft({
				customerName: detail.customerName ?? "",
				customerEmail: detail.customerEmail ?? "",
				customerPhone: detail.customerPhone ?? "",
			});
		}
		if (section === "shipping") {
			setShippingDraft({
				shippingAddress: detail.shippingAddress ?? "",
				shippingCity: detail.shippingCity ?? "",
				shippingPostalCode: detail.shippingPostalCode ?? "",
			});
		}
	};

	const saveOrder = () => {
		if (!orderId) return;
		setSectionError(null);
		const status = orderDraft.status.trim();
		if (!isPatchableStatus(status)) {
			setSectionError("Choose a fulfillment status (processing → delivered).");
			return;
		}
		const courier = orderDraft.courier.trim();
		const trackingNumber = orderDraft.trackingNumber.trim();
		if (!courier || !trackingNumber) {
			setSectionError("Courier and tracking number are required.");
			return;
		}
		patchOrder.mutate(
			{
				id: orderId,
				body: { status, courier, trackingNumber },
			},
			{
				onSuccess: () => {
					setActiveSection(null);
					handleOpenChange(false);
				},
				onError: (e) => setSectionError(getApiErrorMessage(e)),
			},
		);
	};

	const saveCustomer = () => {
		if (!orderId) return;
		setSectionError(null);
		const customerName = customerDraft.customerName.trim();
		const customerEmail = customerDraft.customerEmail.trim();
		const customerPhone = customerDraft.customerPhone.trim();
		if (!customerName || !customerEmail || !customerPhone) {
			setSectionError("Name, email, and phone are required.");
			return;
		}
		patchCustomer.mutate(
			{ id: orderId, body: { customerName, customerEmail, customerPhone } },
			{
				onSuccess: () => setActiveSection(null),
				onError: (e) => setSectionError(getApiErrorMessage(e)),
			},
		);
	};

	const saveShipping = () => {
		if (!orderId) return;
		setSectionError(null);
		const shippingAddress = shippingDraft.shippingAddress.trim();
		const shippingCity = shippingDraft.shippingCity.trim();
		const shippingPostalCode = shippingDraft.shippingPostalCode.trim();
		if (!shippingAddress || !shippingCity || !shippingPostalCode) {
			setSectionError("Address, city, and postal code are required.");
			return;
		}
		patchShipping.mutate(
			{ id: orderId, body: { shippingAddress, shippingCity, shippingPostalCode } },
			{
				onSuccess: () => setActiveSection(null),
				onError: (e) => setSectionError(getApiErrorMessage(e)),
			},
		);
	};

	const busy =
		patchOrder.isPending || patchCustomer.isPending || patchShipping.isPending;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-h-[min(90vh,800px)] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit order</DialogTitle>
					<DialogDescription>
						Each block has its own Edit / Save. Only one section can be edited at a
						time.
					</DialogDescription>
				</DialogHeader>

				{isPending ? (
					<div className="grid gap-3 py-2">
						<Skeleton className="h-8 w-2/3" />
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				) : error ? (
					<p className="text-sm text-destructive" role="alert">
						{getApiErrorMessage(error)}
					</p>
				) : data ? (
					<div className="space-y-6">
						{sectionError ? (
							<p className="text-sm text-destructive" role="alert">
								{sectionError}
							</p>
						) : null}

						<section className="space-y-3 rounded-2xl border border-border p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h3 className="text-sm font-semibold">Order & fulfillment</h3>
								{activeSection === "order" ? (
									<div className="flex flex-wrap gap-2">
										<Button
											type="button"
											size="sm"
											variant="outline"
											disabled={busy}
											onClick={() => cancelSection("order", data)}>
											Cancel
										</Button>
										<Button type="button" size="sm" disabled={busy} onClick={saveOrder}>
											{patchOrder.isPending ? "Saving…" : "Save"}
										</Button>
									</div>
								) : (
									<Button
										type="button"
										size="sm"
										variant="secondary"
										disabled={busy || activeSection !== null}
										onClick={() => beginEdit("order", data)}>
										Edit
									</Button>
								)}
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-2 sm:col-span-2">
									<Label htmlFor="ord-status">Status</Label>
									{activeSection === "order" ? (
										<select
											id="ord-status"
											className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
											disabled={busy}
											required
											value={orderDraft.status}
											onChange={(e) =>
												setOrderDraft((d) => ({ ...d, status: e.target.value }))
											}>
											<option value="" disabled>
												Select status…
											</option>
											{PATCHABLE_STATUSES.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									) : (
										<Input
											id="ord-status"
											disabled
											readOnly
											className="capitalize"
											value={data.status}
										/>
									)}
								</div>
								<div className="grid gap-2">
									<Label htmlFor="ord-courier">Courier</Label>
									<Input
										id="ord-courier"
										disabled={activeSection !== "order" || busy}
										value={
											activeSection === "order"
												? orderDraft.courier
												: (data.courier ?? "")
										}
										onChange={(e) =>
											setOrderDraft((d) => ({ ...d, courier: e.target.value }))
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="ord-track">Tracking number</Label>
									<Input
										id="ord-track"
										disabled={activeSection !== "order" || busy}
										value={
											activeSection === "order"
												? orderDraft.trackingNumber
												: (data.trackingNumber ?? "")
										}
										onChange={(e) =>
											setOrderDraft((d) => ({ ...d, trackingNumber: e.target.value }))
										}
										required
									/>
								</div>
							</div>
						</section>

						<section className="space-y-3 rounded-2xl border border-border p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h3 className="text-sm font-semibold">Customer</h3>
								{activeSection === "customer" ? (
									<div className="flex flex-wrap gap-2">
										<Button
											type="button"
											size="sm"
											variant="outline"
											disabled={busy}
											onClick={() => cancelSection("customer", data)}>
											Cancel
										</Button>
										<Button
											type="button"
											size="sm"
											disabled={busy}
											onClick={saveCustomer}>
											{patchCustomer.isPending ? "Saving…" : "Save"}
										</Button>
									</div>
								) : (
									<Button
										type="button"
										size="sm"
										variant="secondary"
										disabled={busy || activeSection !== null}
										onClick={() => beginEdit("customer", data)}>
										Edit
									</Button>
								)}
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<div className="grid gap-2 sm:col-span-2">
									<Label htmlFor="cust-name">Name</Label>
									<Input
										id="cust-name"
										disabled={activeSection !== "customer" || busy}
										value={
											activeSection === "customer"
												? customerDraft.customerName
												: data.customerName
										}
										onChange={(e) =>
											setCustomerDraft((d) => ({ ...d, customerName: e.target.value }))
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="cust-email">Email</Label>
									<Input
										id="cust-email"
										type="email"
										disabled={activeSection !== "customer" || busy}
										value={
											activeSection === "customer"
												? customerDraft.customerEmail
												: data.customerEmail
										}
										onChange={(e) =>
											setCustomerDraft((d) => ({ ...d, customerEmail: e.target.value }))
										}
										required
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="cust-phone">Phone</Label>
									<Input
										id="cust-phone"
										disabled={activeSection !== "customer" || busy}
										value={
											activeSection === "customer"
												? customerDraft.customerPhone
												: data.customerPhone
										}
										onChange={(e) =>
											setCustomerDraft((d) => ({ ...d, customerPhone: e.target.value }))
										}
										required
									/>
								</div>
							</div>
						</section>

						<section className="space-y-3 rounded-2xl border border-border p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h3 className="text-sm font-semibold">Shipping address</h3>
								{activeSection === "shipping" ? (
									<div className="flex flex-wrap gap-2">
										<Button
											type="button"
											size="sm"
											variant="outline"
											disabled={busy}
											onClick={() => cancelSection("shipping", data)}>
											Cancel
										</Button>
										<Button
											type="button"
											size="sm"
											disabled={busy}
											onClick={saveShipping}>
											{patchShipping.isPending ? "Saving…" : "Save"}
										</Button>
									</div>
								) : (
									<Button
										type="button"
										size="sm"
										variant="secondary"
										disabled={busy || activeSection !== null}
										onClick={() => beginEdit("shipping", data)}>
										Edit
									</Button>
								)}
							</div>
							<div className="grid gap-3">
								<div className="grid gap-2">
									<Label htmlFor="ship-addr">Street address</Label>
									<textarea
										id="ship-addr"
										rows={3}
										className="border-input bg-background field-sizing-content flex min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
										disabled={activeSection !== "shipping" || busy}
										value={
											activeSection === "shipping"
												? shippingDraft.shippingAddress
												: (data.shippingAddress ?? "")
										}
										onChange={(e) =>
											setShippingDraft((d) => ({
												...d,
												shippingAddress: e.target.value,
											}))
										}
										required
									/>
								</div>
								<div className="grid gap-2 sm:grid-cols-2">
									<div className="grid gap-2">
										<Label htmlFor="ship-city">City</Label>
										<Input
											id="ship-city"
											disabled={activeSection !== "shipping" || busy}
											value={
												activeSection === "shipping"
													? shippingDraft.shippingCity
													: (data.shippingCity ?? "")
											}
											onChange={(e) =>
												setShippingDraft((d) => ({
													...d,
													shippingCity: e.target.value,
												}))
											}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="ship-postal">Postal code</Label>
										<Input
											id="ship-postal"
											disabled={activeSection !== "shipping" || busy}
											value={
												activeSection === "shipping"
													? shippingDraft.shippingPostalCode
													: (data.shippingPostalCode ?? "")
											}
											onChange={(e) =>
												setShippingDraft((d) => ({
													...d,
													shippingPostalCode: e.target.value,
												}))
											}
											required
										/>
									</div>
								</div>
							</div>
						</section>
					</div>
				) : null}

				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
						Close
					</Button>
					{error && orderId ? (
						<Button type="button" variant="secondary" onClick={() => refetch()}>
							Retry
						</Button>
					) : null}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export { OrderEditDialog };
