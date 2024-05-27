'use client'

import { Loader2 } from 'lucide-react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOpenAccount } from '../hooks/use-open-account'
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
import AccountForm from './account-form'

const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this account!',
  })

  // making api call to get an account with id.
  const accountQuery = useQuery({
    enabled: id !== undefined,
    queryKey: ['account', { id }],
    queryFn: async () => {
      const response = await client.api.accounts[':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch individual account!')
      }

      const { data } = await response.json()
      return data
    },
  })

  // making the api call to update an account.
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.accounts[':id'].$patch({
        json,
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the accounts.
      toast.success('Account updated!')
      queryClient.invalidateQueries({ queryKey: ['account', { id }] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to update account!')
    },
  })

  // making the api call to delete an account.
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.accounts[':id'].$delete({
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the accounts.
      toast.success('Account deleted!')
      queryClient.invalidateQueries({ queryKey: ['account', { id }] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to delete account!')
    },
  })

  const onSubmit = (values) => {
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

  // setting some states.
  const isLoading = accountQuery.isLoading
  const isPending = updateMutation.isPending || deleteMutation.isPending

  const defaultValues =
    !isLoading && accountQuery.data
      ? {
          name: accountQuery.data.name,
        }
      : {
          name: '',
        }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default EditAccountSheet
