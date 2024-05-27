import { Separator } from './ui/separator'
import { convertAmountFromMiliunits, formatCurrency } from '@/lib/utils'

const CategoryTooltip = ({ active, payload }) => {
  if (!active) return null

  // data.
  const name = payload[0].payload.name
  const value = payload[0].value

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      {/* date. */}
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {name}
      </div>

      <Separator />

      {/* expenses. */}
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>

            <p className="text-sm text-right font-medium">
              {formatCurrency(value * -1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryTooltip
