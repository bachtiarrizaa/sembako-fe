"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { useApproveOpname } from "../hooks"
import { OpnameSubmission } from "../types/inventory"

interface OpnameRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  submission: OpnameSubmission | null
}

export function OpnameRejectDialog({ open, onOpenChange, submission }: OpnameRejectDialogProps) {
  const approveOpname = useApproveOpname()
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setNote("")
      setError("")
    }
  }, [open])

  if (!submission) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (note.length > 500) {
      setError("Catatan maksimal 500 karakter")
      return
    }

    approveOpname.mutate(
      {
        id: submission.id,
        payload: {
          approve: false,
          note: note.trim() || undefined,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Tolak Pengajuan Opname Stok
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Apakah Anda yakin ingin menolak penyesuaian stok untuk produk{" "}
            <strong className="font-bold">{submission.product.name}</strong>? Tindakan ini tidak mengubah data stok sistem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-6 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="rejectNote" className="text-xs font-semibold text-foreground">
                Catatan Penolakan
              </Label>
              <Textarea
                id="rejectNote"
                placeholder="Masukkan alasan penolakan (opsional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={approveOpname.isPending}
                rows={3}
                className="resize-none bg-background"
              />
              {error && (
                <span className="flex items-center gap-1 text-[11px] text-destructive leading-none mt-1">
                  <AlertCircle className="size-3 shrink-0" />
                  {error}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={approveOpname.isPending}
              className="cursor-pointer font-medium px-3 py-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={approveOpname.isPending}
              className="cursor-pointer font-medium px-3 py-4 bg-red-700/85 text-white border border-red-700 hover:bg-red-700 hover:text-white"
            >
              {approveOpname.isPending ? (
                <Spinner className="size-4" />
              ) : (
                "Tolak"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
