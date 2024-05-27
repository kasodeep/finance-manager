'use client'

import { Loader2 } from 'lucide-react'

import { getCategories } from '@/features/category/api/get-categories'
import { getAccounts } from '@/features/accounts/api/get-accounts'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNewTransaction } from '../hooks/use-new-transaction'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { toast } from 'sonner'
import { client } from '@/lib/hono'
import TransactionForm from './transaction-form'
import { format } from 'date-fns'

const NewTransactionSheet = () => {
  // state manager coming from zustand.
  const { isOpen, onClose } = useNewTransaction()

  // making the api call to create a new transaction.
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Transaction created')
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to create transaction!')
    },
  })

  // Category Functionality!
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
  const categoryMutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Category created')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to create category!')
    },
  })
  const onCreateCategory = (name) => categoryMutation.mutate({ name })
  const categoryOptions = (categoriesQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  // Account Functionality!
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })
  const accountMutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the accounts.
      toast.success('Account created')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to create account!')
    },
  })
  const onCreateAccount = (name) => accountMutation.mutate({ name })
  const accountOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const isPending =
    mutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const isLoading = categoryOptions.isLoading || accountsQuery.isLoading

  const onSubmit = (values) => {
    values.date = format(values.date, 'yyyy-MM-dd')
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New transaction</SheetTitle>
          <SheetDescription>Add a new transaction.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

export default NewTransactionSheet
