"use client";

import * as React from "react";
import { Package, Shapes } from "lucide-react";

import {
	ConfirmDialog,
	CreateButton,
	DataTable,
	DeleteButton,
	EditButton,
	EmptyState,
	PageHeader,
	RowActions,
	ViewDetailButton,
} from "@/components/globals";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
	useAdminCategories,
	useAdminProducts,
	useCreateAdminProduct,
	useDeleteAdminProduct,
	usePublishAdminProduct,
	useUpdateAdminProduct,
} from "@/hooks";
import { AdminProductDTO } from "@/types/admin/product";
import Link from "next/link";

import { buildProductColumns } from "./product-columns";
import {
	ProductFormDialog,
	type ProductFormSubmit,
} from "./product-form-dialog";

function ProductsView() {
	const { data, isPending, error } = useAdminProducts();
	const { data: categoriesData, isPending: categoriesPending } =
		useAdminCategories();

	const createMutation = useCreateAdminProduct();
	const updateMutation = useUpdateAdminProduct();
	const deleteMutation = useDeleteAdminProduct();
	const publishMutation = usePublishAdminProduct();

	const [formOpen, setFormOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
	const [editing, setEditing] = React.useState<AdminProductDTO | null>(null);

	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [deleteTarget, setDeleteTarget] =
		React.useState<AdminProductDTO | null>(null);

	const [optimisticPublish, setOptimisticPublish] = React.useState<
		Record<string, boolean | undefined>
	>({});
	const [pendingPublishId, setPendingPublishId] = React.useState<string | null>(
		null,
	);
	const [publishError, setPublishError] = React.useState<{
		id: string;
		name: string;
		message: string;
	} | null>(null);

	const activeMutation =
		formMode === "create" ? createMutation : updateMutation;
	const formError = activeMutation.error;

	const openCreate = () => {
		setFormMode("create");
		setEditing(null);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const openEdit = (row: AdminProductDTO) => {
		setFormMode("edit");
		setEditing(row);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const openDelete = (row: AdminProductDTO) => {
		setDeleteTarget(row);
		setDeleteOpen(true);
	};

	const handleFormSubmit = (payload: ProductFormSubmit) => {
		if (payload.mode === "create") {
			createMutation.mutate(payload.data, {
				onSuccess: () => {
					setFormOpen(false);
					setEditing(null);
					updateMutation.reset();
				},
			});
			return;
		}
		if (!editing) return;
		updateMutation.mutate(
			{ id: editing.id, input: payload.data },
			{
				onSuccess: () => {
					setFormOpen(false);
					setEditing(null);
					createMutation.reset();
				},
			},
		);
	};

	const clearOptimistic = React.useCallback((id: string) => {
		setOptimisticPublish((prev) => {
			if (!(id in prev)) return prev;
			const next = { ...prev };
			delete next[id];
			return next;
		});
	}, []);

	const handlePublishToggle = React.useCallback(
		(row: AdminProductDTO, next: boolean) => {
			setPublishError(null);
			setPendingPublishId(row.id);
			setOptimisticPublish((prev) => ({ ...prev, [row.id]: next }));
			publishMutation.mutate(
				{ id: row.id, isActive: next },
				{
					onSuccess: () => {
						clearOptimistic(row.id);
						setPendingPublishId(null);
					},
					onError: (err) => {
						clearOptimistic(row.id);
						setPendingPublishId(null);
						setPublishError({
							id: row.id,
							name: row.name,
							message: getApiErrorMessage(err),
						});
					},
				},
			);
		},
		[clearOptimistic, publishMutation],
	);

	const columns = React.useMemo(
		() =>
			buildProductColumns({
				pendingPublishId,
				optimisticPublish,
				onPublishToggle: handlePublishToggle,
			}),
		[pendingPublishId, optimisticPublish, handlePublishToggle],
	);

	return (
		<div>
			<PageHeader
				title="Products"
				description="Manage products. Toggle publish per row; variant products require variants before publishing."
				actions={<CreateButton label="New product" onClick={openCreate} />}
			/>

			{publishError ? (
				<div
					role="alert"
					className="mb-4 flex flex-col gap-1 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="font-medium">
							Could not update “{publishError.name}”
						</p>
						<p className="text-xs text-destructive/90">{publishError.message}</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="self-start text-destructive hover:bg-destructive/15 sm:self-center"
						onClick={() => setPublishError(null)}>
						Dismiss
					</Button>
				</div>
			) : null}

			<DataTable
				data={data?.data}
				columns={columns}
				getRowKey={(row) => row.id}
				isLoading={isPending}
				error={error}
				emptyState={
					<EmptyState
						icon={Package}
						title="No products yet"
						description="Create your first product to start filling the storefront."
					/>
				}
				rowActions={(row) => (
					<RowActions>
						<ViewDetailButton href={`/admin/products/${row.id}`} />
						{row.hasVariant ? (
							<Button
								asChild
								size="icon"
								variant="ghost"
								className="size-8"
								title="Manage variants">
								<Link href={`/admin/variants?productId=${row.id}`}>
									<Shapes className="size-4" />
									<span className="sr-only">Manage variants</span>
								</Link>
							</Button>
						) : null}
						<EditButton onClick={() => openEdit(row)} />
						<DeleteButton onClick={() => openDelete(row)} />
					</RowActions>
				)}
			/>

			<ProductFormDialog
				open={formOpen}
				onOpenChange={(open) => {
					setFormOpen(open);
					if (!open) {
						setEditing(null);
						createMutation.reset();
						updateMutation.reset();
					}
				}}
				mode={formMode}
				initial={editing}
				categories={categoriesData?.data ?? []}
				categoriesLoading={categoriesPending}
				isPending={activeMutation.isPending}
				error={formError}
				onSubmit={handleFormSubmit}
			/>

			<ConfirmDialog
				open={deleteOpen}
				onOpenChange={(open) => {
					setDeleteOpen(open);
					if (!open) setDeleteTarget(null);
				}}
				title="Delete product?"
				description={
					deleteTarget
						? `This will remove “${deleteTarget.name}” (${deleteTarget.slug}). Variants and stock will also be deleted.`
						: undefined
				}
				confirmLabel="Delete"
				variant="destructive"
				loading={deleteMutation.isPending}
				onConfirm={async () => {
					if (!deleteTarget) return;
					await deleteMutation.mutateAsync(deleteTarget.id);
					setDeleteTarget(null);
				}}
			/>
		</div>
	);
}

export { ProductsView };
