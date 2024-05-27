'use client'

import { Loader2 } from 'lucide-react'

import { getCategories } from '@/features/category/api/get-categories'
import { getAccounts } from '@/features/accounts/api/get-accounts'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOpenTransaction } from '../hooks/use-open-transaction'
import useConfirm from '@/hooks/use-confirm'

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
import { convertAmountFromMiliunits } from '@/lib/utils'
import { format } from 'date-fns'

const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this transaction!',
  })

  // making api call to get an transaction with id.
  const transactionQuery = useQuery({
    enabled: id !== undefined,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      const response = await client.api.transactions[':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transaction!')
      }

      const { data } = await response.json()
      return data
    },
  })

  // making the api call to update an transaction.
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.transactions[':id'].$patch({
        json,
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the transactions.
      toast.success('Transaction updated!')
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to update transaction!')
    },
  })

  // making the api call to delete an transaction.
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.transactions[':id'].$delete({
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the transactions.
      toast.success('Transaction deleted!')
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to delete transaction!')
    },
  })

  const onSubmit = (values) => {
    values.date = format(values.date, 'yyyy-MM-dd')
    updateMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

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

  // setting some states.
  const isLoading =
    transactionQuery.isLoading ||
    categoriesQuery.isLoading ||
    accountsQuery.isLoading

  const isPending =
    updateMutation.isPending ||
    deleteMutation.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending ||
    transactionQuery.isPending

  const defaultValues =
    !isLoading && transactionQuery.data
      ? {
          accountId: transactionQuery.data.accountId,
          categoryId: transactionQuery.data.categoryId,
          amount: convertAmountFromMiliunits(
            transactionQuery.data.amount
          ).toString(),
          date: transactionQuery.data.date
            ? new Date(transactionQuery.data.date)
            : new Date(),
          payee: transactionQuery.data.payee,
          notes: transactionQuery.data.notes,
        }
      : {
          accountId: '',
          categoryId: '',
          amount: '',
          date: new Date(),
          payee: '',
          notes: '',
        }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default EditTransactionSheet
