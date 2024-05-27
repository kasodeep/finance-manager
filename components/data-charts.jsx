'use client'

import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

import { useSearchParams } from 'next/navigation'
import { convertAmountFromMiliunits } from '@/lib/utils'

import Chart, { ChartLoading } from './chart'
import SpendingPie, { SpendingPieLoading } from './spending-pie'

const DataCharts = () => {
  const params = useSearchParams()

  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const accountId = params.get('accountId') || ''

  // fetching the summary data.
  const summaryQuery = useQuery({
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch summary!')
      }

      const { data } = await response.json()
      return {
        ...data,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),

        categories: data.categories.map((category) => ({
          name: category.name,
          amount: convertAmountFromMiliunits(category.amount),
        })),

        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliunits(day.income),
          expenses: convertAmountFromMiliunits(day.expenses),
        })),
      }
    },
  })

  if (summaryQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={summaryQuery.data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={summaryQuery.data?.categories} />
      </div>
    </div>
  )
}

export default DataCharts
