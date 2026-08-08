import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  isFetching?: boolean
  className?: string
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Cari data...",
  isFetching = false,
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={`relative w-full sm:max-w-sm ${className}`}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.(value)
      }}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="text"
        inputMode="search"
        placeholder={placeholder}
        className="pl-9 pr-9 w-full bg-background dark:bg-input/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isFetching ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
      ) : value ? (
        <button
          type="button"
          aria-label="Bersihkan pencarian"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </form>
  )
}