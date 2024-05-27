'use client'

import { FaPiggyBank } from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatDateRange } from '@/lib/utils'

import DataCard, { DataCardLoading } from './data-card'

const DataGrid = () => {
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
          ...category,
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

  const dateRangeLabel = formatDateRange({ to, from })

  if (summaryQuery.isLoading)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )

  return (
    // top 3 cards.
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={summaryQuery.data?.remainingAmount}
        percentageChange={summaryQuery.data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Income"
        value={summaryQuery.data?.incomeAmount}
        percentageChange={summaryQuery.data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Expenses"
        value={summaryQuery.data?.expensesAmount}
        percentageChange={summaryQuery.data?.expensesChange}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  )
}

export default DataGrid
