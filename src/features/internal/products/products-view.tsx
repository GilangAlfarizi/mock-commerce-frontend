"use client";

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
import {
	useAdminCategories,
	useAdminProducts,
	useCreateAdminProduct,
	useDeleteAdminProduct,
	useUpdateAdminProduct,
} from "@/hooks";
import { AdminProductDTO, ProductInput } from "@/types/admin/product";
import React from "react";
import { FolderTree } from "lucide-react";
import { productColumns } from "./product-columns";
import { ProductFormDialog } from "./product-form-dialog";

function ProductsView() {
	const { data, isPending, error } = useAdminProducts();
	const { data: categoriesData, isPending: categoriesPending } =
		useAdminCategories();
	//hooks
	const createMutation = useCreateAdminProduct();
	const updateMutation = useUpdateAdminProduct();
	const deleteMutation = useDeleteAdminProduct();

	const [formOpen, setFormOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
	const [editing, setEditing] = React.useState<AdminProductDTO | null>(null);

	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [deleteTarget, setDeleteTarget] =
		React.useState<AdminProductDTO | null>(null);

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

	const handleFormSubmit = (data: ProductInput) => {
		if (formMode === "create") {
			createMutation.mutate(data, {
				onSuccess: () => {
					setFormOpen(false);
					setEditing(null);
					updateMutation.reset();
				},
			});
		} else if (editing) {
			updateMutation.mutate(
				{ id: editing.id, input: data },
				{
					onSuccess: () => {
						setFormOpen(false);
						setEditing(null);
						createMutation.reset();
					},
				},
			);
		}
	};

	return (
		<div>
			<PageHeader
				title="Products"
				description="Manage products. Ensure product data correct and sync with variants"
				actions={<CreateButton label="New Product" onClick={openCreate} />}
			/>

			<DataTable
				data={data?.data}
				columns={productColumns}
				getRowKey={(row) => row.id}
				isLoading={isPending}
				error={error}
				emptyState={
					<EmptyState
						icon={FolderTree}
						title="No products yet"
						description="Create your first product to organize variants in the storefront."
					/>
				}
				rowActions={(row) => (
					<RowActions>
						<ViewDetailButton href={`/admin/products/${row.id}`} />
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
						? `This will remove “${deleteTarget.name}” (${deleteTarget.slug}). Products referencing it may be affected.`
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
