'use client'

import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { format, subDays } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import { client } from '@/lib/hono'
import { convertAmountFromMiliunits, formatDateRange } from '@/lib/utils'

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

const DateFilter = () => {
  const routes = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const accountId = params.get('accountId')
  const from = params.get('from') || ''
  const to = params.get('to') || ''

  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  const paramsState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  }

  const [date, setDate] = useState(paramsState)

  const pushToUrl = (dateRange) => {
    const query = {
      accountId,
      from: format(dateRange?.from || defaultFrom, 'yyyy-MM-dd'),
      to: format(dateRange?.to || defaultTo, 'yyyy-MM-dd'),
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )
    routes.push(url)
  }

  const onReset = () => {
    setDate(undefined)
    pushToUrl(undefined)
  }

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={summaryQuery.isLoading}
          variant="outline"
          size="sm"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white-10 hover:bg-white-20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white-30 transition"
        >
          <span>{formatDateRange(paramsState)}</span>
          <ChevronDownIcon className="size-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* content of range. */}
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          disabled={summaryQuery.isLoading}
          mode="range"
          initialFocus
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />

        {/* in calendar, reset & apply. */}
        <div className="flex w-full p-4 items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateFilter
