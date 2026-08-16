import { Badge } from "@/components/ui/badge"
import { OPNAME_STATUSES, OPNAME_STATUS_LABELS, OpnameStatus } from "../constants/inventory.constant"

const statusBadgeClass: Record<OpnameStatus, string> = {
  [OPNAME_STATUSES.PENDING]: "border-transparent bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  [OPNAME_STATUSES.APPROVED]: "border-transparent bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  [OPNAME_STATUSES.REJECTED]: "border-transparent bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
}

export function OpnameStatusBadge({ status }: { status: OpnameStatus }) {
  return <Badge className={statusBadgeClass[status]}>{OPNAME_STATUS_LABELS[status]}</Badge>
}