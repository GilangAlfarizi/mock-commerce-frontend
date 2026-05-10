"use client";

import * as React from "react";
import { ChevronDown, ClipboardList } from "lucide-react";

import {
	DataTable,
	EditButton,
	EmptyState,
	PageHeader,
	RowActions,
	ViewDetailButton,
} from "@/components/globals";
import { Button } from "@/components/ui/button";
import { useAdminActiveOrders, useAdminHistoryOrders } from "@/hooks";
import { AdminOrderDTO } from "@/types/admin/order";
import { cn } from "@/lib/utils";

import { orderColumns } from "./order-columns";
import { OrderEditDialog } from "./order-edit-dialog";
import { OrderReadDialog } from "./order-read-dialog";

function OrdersView() {
	const {
		data: activeData,
		isPending: activeIsPending,
		error: activeError,
	} = useAdminActiveOrders();

	const [historyOpen, setHistoryOpen] = React.useState(false);
	const {
		data: historyData,
		isPending: historyIsPending,
		error: historyError,
	} = useAdminHistoryOrders({ enabled: historyOpen });

	const [readOrderId, setReadOrderId] = React.useState<string | null>(null);
	const [editOrderId, setEditOrderId] = React.useState<string | null>(null);

	const openRead = (row: AdminOrderDTO) => {
		setEditOrderId(null);
		setReadOrderId(row.id);
	};

	const openEdit = (row: AdminOrderDTO) => {
		setReadOrderId(null);
		setEditOrderId(row.id);
	};

	const activeCount = activeData?.data?.length ?? 0;
	const historyCount = historyData?.data?.length ?? 0;

	return (
		<div>
			<PageHeader
				title="Orders"
				description="Fulfill active orders, then review completed or cancelled orders in history."
			/>

			<section
				className={cn(
					"space-y-3 rounded-2xl border-2 border-primary/35 bg-primary/[0.07] p-4 shadow-sm",
					"sm:p-5",
				)}>
				<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-lg font-semibold tracking-tight text-foreground">
							Active orders
						</h2>
						<p className="text-sm text-muted-foreground">
							Pending, processing, and shipped — needs your attention first.
							{activeCount > 0 ? (
								<span className="ml-1 font-medium text-foreground">
									({activeCount} {activeCount === 1 ? "order" : "orders"})
								</span>
							) : null}
						</p>
					</div>
				</div>

				<div className="rounded-xl border border-border/80 bg-background">
					<DataTable
						data={activeData?.data}
						columns={orderColumns}
						getRowKey={(row) => row.id}
						isLoading={activeIsPending}
						error={activeError}
						emptyState={
							<EmptyState
								icon={ClipboardList}
								title="No active orders"
								description="When customers place orders, they will appear here for fulfillment."
							/>
						}
						rowActions={(row) => (
							<RowActions>
								<ViewDetailButton onClick={() => openRead(row)} />
								<EditButton onClick={() => openEdit(row)} />
							</RowActions>
						)}
					/>
				</div>
			</section>

			<div className="mt-10">
				<Button
					type="button"
					variant="outline"
					className="h-auto w-full justify-between gap-3 rounded-2xl border-border px-4 py-3 text-left font-medium shadow-none hover:bg-muted/40"
					onClick={() => setHistoryOpen((o) => !o)}
					aria-expanded={historyOpen}>
					<span className="flex flex-col items-start gap-0.5">
						<span>Order history</span>
						<span className="text-xs font-normal text-muted-foreground">
							Delivered & cancelled — hidden until you expand
							{historyOpen && historyCount > 0
								? ` · ${historyCount} ${historyCount === 1 ? "order" : "orders"}`
								: null}
						</span>
					</span>
					<ChevronDown
						className={cn(
							"size-5 shrink-0 text-muted-foreground transition-transform duration-200",
							historyOpen && "rotate-180",
						)}
					/>
				</Button>

				{historyOpen ? (
					<div className="mt-3 rounded-2xl border border-border bg-background p-1 sm:p-2">
						<DataTable
							data={historyData?.data}
							columns={orderColumns}
							getRowKey={(row) => row.id}
							isLoading={historyIsPending}
							error={historyError}
							emptyState={
								<EmptyState
									icon={ClipboardList}
									title="No history yet"
									description="Completed or cancelled orders will show here."
								/>
							}
							rowActions={(row) => (
								<RowActions>
									<ViewDetailButton onClick={() => openRead(row)} />
									<EditButton onClick={() => openEdit(row)} />
								</RowActions>
							)}
						/>
					</div>
				) : null}
			</div>

			<OrderReadDialog
				open={readOrderId !== null}
				onOpenChange={(open) => {
					if (!open) setReadOrderId(null);
				}}
				orderId={readOrderId}
			/>

			<OrderEditDialog
				open={editOrderId !== null}
				onOpenChange={(open) => {
					if (!open) setEditOrderId(null);
				}}
				orderId={editOrderId}
			/>
		</div>
	);
}

export { OrdersView };
