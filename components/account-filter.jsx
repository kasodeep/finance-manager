'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { client } from '@/lib/hono'
import { getAccounts } from '@/features/accounts/api/get-accounts'
import { convertAmountFromMiliunits } from '@/lib/utils'

const AccountFilter = () => {
  const routes = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const accountId = params.get('accountId') || 'all'
  const from = params.get('from') || ''
  const to = params.get('to') || ''

  const onChange = (newValue) => {
    const query = { accountId: newValue, from, to }
    if (newValue === 'all') query.accountId = ''

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    )
    routes.push(url)
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

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
      disabled={accountsQuery.isLoading || summaryQuery.isLoading}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white-10 hover:bg-white-20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white-30 transition">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>

      <SelectContent>
        {/* all accounts. */}
        <SelectItem value="all">All Accounts</SelectItem>

        {/* individual accounts. */}
        {accountsQuery.data?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default AccountFilter
