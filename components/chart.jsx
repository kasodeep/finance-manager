import { useState } from 'react'

import {
  AreaChart,
  BarChart,
  FileSearch,
  LineChart,
  Loader2,
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import AreaVariant from './area-variant'
import BarVariant from './bar-variant'
import LineVariant from './line-variant'

const Chart = ({ data = [] }) => {
  const [chartType, setChartType] = useState('area')

  const onTypeChange = (type) => {
    setChartType(type)
  }

  return (
    <Card className="border-none drop-shadow-lg">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        {/* title. */}
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>

        {/* select to select the chart type. */}
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Select Chart Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px]">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for this period.
            </p>
          </div>
        ) : (
          <>
            {/* displaying the charts. */}
            {chartType === 'line' && <LineVariant data={data} />}
            {chartType === 'bar' && <BarVariant data={data} />}
            {chartType === 'area' && <AreaVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default Chart

export const ChartLoading = () => {
  return (
    <Card className="border-none drop-shadow-lg ">
      {/* loading header. */}
      <CardHeader className="flex space-y-2 lg:items-center lg:justify-between lg:flex-row lg:space-y-0">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      </CardHeader>

      {/* loading body. */}
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-slate-300" />
        </div>
      </CardContent>
    </Card>
  )
}
