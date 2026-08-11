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
import { Unit } from "../types/unit"
import { useCreateUnit, useUpdateUnit } from "../hooks"
import { CreateUnitRequest, unitSchema, UpdateUnitRequest } from "../schemas/unit.schema"

interface UnitFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit?: Unit | null
}

export function UnitFormDialog({ open, onOpenChange, unit }: UnitFormDialogProps) {
  const isEdit = Boolean(unit)

  const createUnit = useCreateUnit()
  const updateUnit = useUpdateUnit()
  const isPending = createUnit.isPending || updateUnit.isPending

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateUnitRequest>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: "" },
  })

  useEffect(() => {
    if (open) {
      reset({ name: unit?.name ?? "" })
      clearErrors()
    }
  }, [open, unit, reset, clearErrors])

  const onSubmit = (updateUnitRequest: UpdateUnitRequest) => {
    if (isEdit && unit) {
      updateUnit.mutate(
        { id: unit.id, payload: updateUnitRequest },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createUnit.mutate(
        updateUnitRequest,
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
            {isEdit ? "Edit Satuan" : "Tambah Satuan"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2 px-6 py-4">
            <Label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nama Satuan
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Karung, Liter, Kg"
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