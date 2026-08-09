import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_LIMIT_OPTIONS = [5, 10, 25, 50]

interface LimitSelectProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
}

export function LimitSelect({
  value,
  onChange,
  options = DEFAULT_LIMIT_OPTIONS,
}: LimitSelectProps) {
  const handleChange = (val: string) => {
    if (!val) return
    onChange(Number(val))
  }

  return (
    <Select value={value.toString()} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-16 cursor-pointer border-border bg-background transition-colors focus-visible:border-primary focus-visible:ring-0 dark:bg-input/30 dark:hover:bg-input/50">
        <SelectValue placeholder={value.toString()}/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tampilkan</SelectLabel>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt.toString()}>
              {opt}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}