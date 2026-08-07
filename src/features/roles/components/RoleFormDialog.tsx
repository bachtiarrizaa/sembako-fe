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
import { useCreateRole } from "../hooks/useCreateRole"
import { useUpdateRole } from "../hooks/useUpdateRole"
import { CreateRoleRequest, roleSchema, UpdateRoleRequest } from "../schemas/role.schema"
import { Role } from "../types/role"

interface RoleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
}

export function RoleFormDialog({ open, onOpenChange, role }: RoleFormDialogProps) {
  const isEdit = Boolean(role)

  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleRequest>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (open) {
      reset({ name: role?.name ?? "" })
    }
  }, [open, role, reset])

  const onSubmit = (values: UpdateRoleRequest) => {
    if (isEdit && role) {
      updateMutation.mutate(
        { id: role.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createMutation.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[425px] sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Role" : "Tambah Role"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2 px-6 py-4">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nama Role
            </Label>
            <Input
              id="name"
              placeholder="Coffee"
              className="bg-background w-full transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/20"
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
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}