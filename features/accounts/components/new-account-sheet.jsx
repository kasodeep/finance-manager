'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNewAccount } from '../hooks/use-new-account'

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

const NewAccountSheet = () => {
  // state manager coming from zustand.
  const { isOpen, onClose } = useNewAccount()

  // making the api call to create a new account.
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.accounts.$post({ json })
      return await response.json()
    },
    onSuccess: () => {
      // refetch all the accounts.
      toast.success('Account created')
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: () => {
      toast.error('Failed to create account!')
    },
  })

  const onSubmit = (values) => {
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
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{
            name: '',
          }}
        />
      </SheetContent>
    </Sheet>
  )
}

export default NewAccountSheet
