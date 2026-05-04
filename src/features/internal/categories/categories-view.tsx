"use client";

import * as React from "react";
import { FolderTree } from "lucide-react";

import {
	ConfirmDialog,
	CreateButton,
	DataTable,
	DeleteButton,
	EditButton,
	EmptyState,
	PageHeader,
	RowActions,
} from "@/components/globals";
import {
	useAdminCategories,
	useCreateAdminCategory,
	useDeleteAdminCategory,
	useUpdateAdminCategory,
} from "@/hooks";
import type { AdminCategoryDTO } from "@/types/admin/category";

import { categoryColumns } from "./category-columns";
import { CategoryFormDialog } from "./category-form-dialog";

function CategoriesView() {
	const { data, isPending, error } = useAdminCategories();
	const createMutation = useCreateAdminCategory();
	const updateMutation = useUpdateAdminCategory();
	const deleteMutation = useDeleteAdminCategory();

	const [formOpen, setFormOpen] = React.useState(false);
	const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
	const [editing, setEditing] = React.useState<AdminCategoryDTO | null>(null);

	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [deleteTarget, setDeleteTarget] = React.useState<AdminCategoryDTO | null>(null);

	const activeMutation = formMode === "create" ? createMutation : updateMutation;
	const formError = activeMutation.error;

	const openCreate = () => {
		setFormMode("create");
		setEditing(null);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const openEdit = (row: AdminCategoryDTO) => {
		setFormMode("edit");
		setEditing(row);
		setFormOpen(true);
		createMutation.reset();
		updateMutation.reset();
	};

	const handleFormSubmit = (name: string) => {
		if (formMode === "create") {
			createMutation.mutate(
				{ name },
				{
					onSuccess: () => {
						setFormOpen(false);
						createMutation.reset();
					},
				},
			);
		} else if (editing) {
			updateMutation.mutate(
				{ id: editing.id, input: { name } },
				{
					onSuccess: () => {
						setFormOpen(false);
						setEditing(null);
						updateMutation.reset();
					},
				},
			);
		}
	};

	const openDelete = (row: AdminCategoryDTO) => {
		setDeleteTarget(row);
		setDeleteOpen(true);
	};

	return (
		<div>
			<PageHeader
				title="Categories"
				description="Manage catalog categories. Slugs are generated automatically on the server."
				actions={<CreateButton label="New category" onClick={openCreate} />}
			/>

			<DataTable
				data={data?.data}
				columns={categoryColumns}
				getRowKey={(row) => row.id}
				isLoading={isPending}
				error={error}
				emptyState={
					<EmptyState
						icon={FolderTree}
						title="No categories yet"
						description="Create your first category to organize products in the storefront."
					/>
				}
				rowActions={(row) => (
					<RowActions>
						<EditButton onClick={() => openEdit(row)} />
						<DeleteButton onClick={() => openDelete(row)} />
					</RowActions>
				)}
			/>

			<CategoryFormDialog
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
				title="Delete category?"
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

export { CategoriesView };
