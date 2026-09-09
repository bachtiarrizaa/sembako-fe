"use client"

import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { handleApiError } from "@/lib/error"
import { downloadFile } from "@/utils/download"
import { TransactionSearch } from "../schemas/transaction.schema"
import { transactionService } from "../services/transaction.service"

export function useExportTransactions() {
  const [isExporting, setIsExporting] = useState(false)

  const exportExcel = async (filters: Partial<TransactionSearch>) => {
    try {
      setIsExporting(true)
      const blob = await transactionService.exportTransactions(filters)

      const dateStr = new Date().toISOString().split("T")[0]
      downloadFile(blob, `riwayat-transaksi-${dateStr}.xlsx`)

      toast.add({
        title: "Berhasil mengunduh Laporan Transaksi Excel",
        type: "success",
      })
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsExporting(false)
    }
  }

  return { exportExcel, isExporting }
}
