import { cva } from 'class-variance-authority'

import { cn, formatCurrency, formatPercentage } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CountUp } from '@/components/count-up'
import { Skeleton } from '@/components/ui/skeleton'

const boxVariants = cva('rounded-md p-3 shrink-0', {
  variants: {
    variant: {
      default: 'bg-blue-500/20',
      success: 'bg-emerald-500/20',
      danger: 'bg-rose-500/20',
      warning: 'bg-yellow-500/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const iconVariants = cva('size-6', {
  variants: {
    variant: {
      default: 'fill-blue-500',
      success: 'fill-emerald-500',
      danger: 'fill-rose-500',
      warning: 'fill-yellow-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
}) => {
  return (
    <Card className="border-none drop-shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        {/* date and title. */}
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>

        {/* icon. */}
        <div className={cn(boxVariants({ variant }))}>
          <Icon className={cn(iconVariants({ variant }))} />
        </div>
      </CardHeader>

      {/* value & percentage. */}
      <CardContent>
        <h1 className="font-bold text-3xl mb-2 line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>

        <p
          className={cn(
            'text-muted-foreground text-sm line-clamp-1',
            percentageChange > 0 ? 'text-emerald-500' : 'text-rose-500'
          )}
        >
          {formatPercentage(percentageChange, { addPrefix: true })} from last
          period.
        </p>
      </CardContent>
    </Card>
  )
}

export default DataCard

export const DataCardLoading = () => {
  return (
    <Card className="border-none drop-shadow-lg h-[192px]">
      {/* loading header. */}
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>

      {/* loading body. */}
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-24" />
        <Skeleton className="shrink-0 h-4 w-40" />
      </CardContent>
    </Card>
  )
}
