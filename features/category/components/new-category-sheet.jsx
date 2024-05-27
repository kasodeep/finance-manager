'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNewCategory } from '../hooks/use-new-category'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { toast } from 'sonner'
import { client } from '@/lib/hono'
import CategoryForm from './category-form'

const NewCategorySheet = () => {
  // state manager coming from zustand.
  const { isOpen, onClose } = useNewCategory()

  // making the api call to create a new category.
  const queryClient = useQueryClient()
  const mutation = useMutation({
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your accounts.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
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

export default NewCategorySheet
