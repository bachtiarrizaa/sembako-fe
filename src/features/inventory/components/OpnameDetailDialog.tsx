"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDateTime } from "@/utils/format"
import { OpnameSubmission } from "../types/inventory"
import { OPNAME_STATUSES } from "../constants/inventory.constant"
import { OpnameStatusBadge } from "./OpnameStatusBadge"
import { useApproveOpname } from "../hooks"

function getSubmitterNote(note: string) {
  if (!note) return ""
  const parts = note.split(" - Note Approval: ")
  return parts[0]
}

function getActionNote(note: string) {
  if (!note) return null
  const parts = note.split(" - Note Approval: ")
  if (parts.length > 1) {
    return parts[1]
  }
  return null
}

interface OpnameDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: OpnameSubmission | null;
  canApprove?: boolean;
  onReject?: (submission: OpnameSubmission) => void;
}

export function OpnameDetailDialog({
  open,
  onOpenChange,
  submission,
  canApprove = false,
  onReject,
}: OpnameDetailDialogProps) {
  const approveOpname = useApproveOpname()

  if (!submission) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl sm:rounded-xl">
        <button type="button" className="sr-only" />

        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
            Detail Pengajuan Opname
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto no-scrollbar space-y-5">
          {/* Section 1: Informasi Penyesuaian */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Informasi Penyesuaian</h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem label="Nama Produk" value={submission.product?.name || "-"} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <DetailItem label="Stok Sistem" value={String(submission.systemQty)} />
              <DetailItem label="Stok Fisik" value={String(submission.physicalQty)} />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Selisih</p>
                <p className={`text-sm font-semibold ${
                  submission.discrepancy > 0
                    ? "text-emerald-600"
                    : submission.discrepancy < 0
                    ? "text-destructive"
                    : "text-slate-600"
                }`}>
                  {submission.discrepancy > 0 ? "+" : ""}
                  {submission.discrepancy}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <div className="mt-0.5"><OpnameStatusBadge status={submission.status} /></div>
              </div>
            </div>
            <div className={submission.status === OPNAME_STATUSES.PENDING ? "space-y-1 mt-2" : "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"}>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Catatan Penyesuaian</p>
                <p className="text-sm font-medium text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/60 min-h-12 text-justify">
                  {getSubmitterNote(submission.note) || <span className="text-muted-foreground italic text-xs">Tidak ada catatan</span>}
                </p>
              </div>

              {submission.status !== OPNAME_STATUSES.PENDING && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {submission.status === OPNAME_STATUSES.APPROVED ? "Catatan Persetujuan" : "Catatan Penolakan"}
                  </p>
                  <p className="text-sm font-medium text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/60 min-h-12 text-justify">
                    {getActionNote(submission.note) || (
                      <span className="text-muted-foreground italic text-xs">
                        {submission.status === OPNAME_STATUSES.APPROVED ? "Tidak ada catatan persetujuan" : "Tidak ada catatan penolakan"}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <hr className="border-border" />

          {/* Section 2: Informasi Pengaju */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Informasi Pengajuan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem label="Diajukan Oleh" value={submission.submitter?.name || "-"} />
              <DetailItem label="Waktu Diajukan" value={formatDateTime(submission.submittedAt)} />
            </div>
          </div>

          {/* Section 3: Informasi Persetujuan (jika status != pending) */}
          {submission.status !== OPNAME_STATUSES.PENDING && (
            <>
              <hr className="border-border" />
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground">Informasi Persetujuan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem
                    label={submission.status === OPNAME_STATUSES.APPROVED ? "Disetujui Oleh" : "Ditolak Oleh"}
                    value={submission.approver?.name || "-"}
                  />
                  <DetailItem
                    label="Waktu Tindakan"
                    value={formatDateTime(submission.approvedAt)}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-border px-6 py-4 flex flex-row items-center justify-end gap-2">
          {submission.status === OPNAME_STATUSES.PENDING && canApprove ? (
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={approveOpname.isPending}
                className="cursor-pointer font-medium px-3 py-4 bg-red-700/85 text-white border border-red-700 hover:bg-red-700 hover:text-white"
                onClick={() => {
                  onOpenChange(false)
                  onReject?.(submission)
                }}
              >
                Tolak
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={approveOpname.isPending}
                className="cursor-pointer font-medium px-3 py-4"
                onClick={() => {
                  approveOpname.mutate(
                    {
                      id: submission.id,
                      payload: {
                        approve: true,
                        note: "",
                      },
                    },
                    {
                      onSuccess: () => {
                        onOpenChange(false)
                      },
                    }
                  )
                }}
              >
                {approveOpname.isPending ? <Spinner className="size-4" /> : "Setujui"}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer font-medium px-3 py-4"
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground wrap-break-words">{value}</p>
    </div>
  )
}
