import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Category } from "../types/category"
import { useCreateCategory } from "../hooks/useCreateCategory"
import { useUpdateCategory } from "../hooks/useUpdateCategory"
import { categorySchema, CreateCategoryRequest, UpdateCategoryRequest } from "../schemas/category.schema"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEdit = Boolean(category)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateCategoryRequest>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (open) {
      reset({ name: category?.name ?? "" })
      clearErrors()
    }
  }, [open, category, reset, clearErrors])

  const onSubmit = (updateCategoryRequest: UpdateCategoryRequest) => {
    if (isEdit && category) {
      updateCategory.mutate(
        { id: category.id, payload: updateCategoryRequest },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createCategory.mutate(
        updateCategoryRequest,
        {
          onSuccess: () => onOpenChange(false)
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[425px] sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2 px-6 py-4">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nama Kategori
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Sembako, Beras, Minyak"
              className="bg-background w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer font-medium px-3 py-4"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit"
              className="cursor-pointer font-medium px-3 py-4"
              disabled={isPending}>
              {isPending ? (
                <Spinner data-icon="inline-start" className="size-4" />
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}