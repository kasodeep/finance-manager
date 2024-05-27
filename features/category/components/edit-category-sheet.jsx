'use client'

import { Loader2 } from 'lucide-react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOpenCategory } from '../hooks/use-open-category'
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
import CategoryForm from './category-form'

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory()

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    message: 'You are about to delete this category!',
  })

  // making api call to get an category with id.
  const categoryQuery = useQuery({
    enabled: id !== undefined,
    queryKey: ['category', { id }],
    queryFn: async () => {
      const response = await client.api.categories[':id'].$get({
        param: { id },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch individual category!')
      }

      const { data } = await response.json()
      return data
    },
  })

  // making the api call to update an category.
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: async (json) => {
      const response = await client.api.categories[':id'].$patch({
        json,
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Category updated!')
      queryClient.invalidateQueries({ queryKey: ['category', { id }] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to update category!')
    },
  })

  // making the api call to delete an category.
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await client.api.categories[':id'].$delete({
        param: { id },
      })
      return await response.json()
    },
    onSuccess: () => {
      toast.success('Category deleted!')
      queryClient.invalidateQueries({ queryKey: ['category', { id }] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error('Failed to delete category!')
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
  const isLoading = categoryQuery.isLoading
  const isPending = updateMutation.isPending || deleteMutation.isPending

  const defaultValues =
    !isLoading && categoryQuery.data
      ? {
          name: categoryQuery.data.name,
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
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>Edit an existing category.</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <CategoryForm
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

export default EditCategorySheet
