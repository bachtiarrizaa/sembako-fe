"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ComboboxSelect } from "@/components/common/ComboboxSelect"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/utils/cn"
import { DiscountResponse } from "../types/discount"
import { useCreateDiscount, useUpdateDiscount } from "../hooks"
import { discountSchema, CreateDiscountRequest } from "../schemas/discount.schema"
import { DISCOUNT_TYPES } from "../constants/discount.constant"
import { formatStartDate, formatEndDate } from "@/utils/format"

interface DiscountFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discount?: DiscountResponse | null
}

const discountTypeOptions = [
  { value: DISCOUNT_TYPES.PERCENT, label: "Persentase" },
  { value: DISCOUNT_TYPES.NOMINAL, label: "Nominal" },
]

export function DiscountFormDialog({ open, onOpenChange, discount }: DiscountFormDialogProps) {
  const isEdit = Boolean(discount)

  const createDiscount = useCreateDiscount()
  const updateDiscount = useUpdateDiscount()
  const isPending = createDiscount.isPending || updateDiscount.isPending

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateDiscountRequest>({
    resolver: zodResolver(discountSchema) as any,
    defaultValues: {
      name: "",
      type: DISCOUNT_TYPES.PERCENT,
      value: undefined as any,
      startDate: null,
      endDate: null,
    },
  })

  const discountType = watch("type")
  const discountValue = watch("value")

  useEffect(() => {
    if (discountType === DISCOUNT_TYPES.PERCENT && Number(discountValue) > 100) {
      setValue("value", 100)
    }
  }, [discountType, discountValue, setValue])

  useEffect(() => {
    if (open) {
      reset({
        name: discount?.name ?? "",
        type: discount?.type ?? DISCOUNT_TYPES.PERCENT,
        value: discount ? Number(discount.value) : (undefined as any),
        startDate: discount?.startDate ?? null,
        endDate: discount?.endDate ?? null,
      })
      clearErrors()
    }
  }, [open, discount, reset, clearErrors])

  const onSubmit = (values: CreateDiscountRequest) => {
    const payload = {
      name: values.name,
      type: values.type,
      value: values.value,
      startDate: values.startDate ? formatStartDate(new Date(values.startDate)) : null,
      endDate: values.endDate ? formatEndDate(new Date(values.endDate)) : null,
    }

    if (isEdit && discount) {
      updateDiscount.mutate(
        { id: discount.id, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createDiscount.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            {isEdit ? "Edit Diskon" : "Tambah Diskon"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
            {/* Nama Diskon */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Nama Diskon <span className="text-destructive">*</span>
              </Label>
              <InputGroup className="bg-background">
                <InputGroupInput
                  id="name"
                  placeholder="Diskon Awal Tahun"
                  {...register("name")}
                />
              </InputGroup>
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Tipe & Nilai Diskon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Tipe Diskon <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <ComboboxSelect
                      items={discountTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      getOptionValue={(opt) => opt.value}
                      getOptionLabel={(opt) => opt.label}
                      placeholder="Pilih tipe..."
                      searchPlaceholder="Cari tipe..."
                      emptyText="Tipe diskon tidak ditemukan."
                    />
                  )}
                />
                {errors.type && (
                  <p className="text-xs font-medium text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-semibold text-foreground">
                  Nilai Diskon <span className="text-destructive">*</span>
                </Label>
                <InputGroup className="bg-background">
                  {discountType === DISCOUNT_TYPES.NOMINAL && (
                    <InputGroupAddon align="inline-start">Rp</InputGroupAddon>
                  )}
                  <InputGroupInput
                    id="value"
                    type="number"
                    placeholder={discountType === DISCOUNT_TYPES.PERCENT ? "25" : "10000"}
                    max={discountType === DISCOUNT_TYPES.PERCENT ? 100 : undefined}
                    {...register("value")}
                  />
                  {discountType === DISCOUNT_TYPES.PERCENT && (
                    <InputGroupAddon align="inline-end">%</InputGroupAddon>
                  )}
                </InputGroup>
                {errors.value && (
                  <p className="text-xs font-medium text-destructive">{errors.value.message}</p>
                )}
              </div>
            </div>

            {/* Tanggal Mulai & Tanggal Berakhir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Tanggal Mulai</Label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <div className="relative flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background h-8 px-2.5 pr-8 py-1 text-xs md:text-xs",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {field.value ? (
                              format(new Date(field.value), "dd MMMM yyyy", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : null)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            field.onChange(null)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                />
                {errors.startDate && (
                  <p className="text-xs font-medium text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground">Tanggal Berakhir</Label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <div className="relative flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background h-8 px-2.5 pr-8 py-1 text-xs md:text-xs",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {field.value ? (
                              format(new Date(field.value), "dd MMMM yyyy", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date ? date.toISOString() : null)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            field.onChange(null)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                />
                {errors.endDate && (
                  <p className="text-xs font-medium text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>
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
            <Button
              type="submit"
              className="cursor-pointer font-medium px-3 py-4"
              disabled={isPending}
            >
              {isPending ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
