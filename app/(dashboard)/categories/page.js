'use client'

import { Loader2, PlusIcon } from 'lucide-react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNewCategory } from '@/features/category/hooks/use-new-category'
import { getCategories } from '@/features/category/api/get-categories'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { columns } from './columns'

const CategoriesPage = () => {
   const newCategory = useNewCategory()

   // get all the categories.
   const categoriesQuery = useQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
   })

   // making the api call to delete categories in bulk.
   const queryClient = useQueryClient()
   const bulkDeleteMutation = useMutation({
      mutationFn: async (json) => {
         const response = await client.api.categories["bulk-delete"]["$post"]({ json })
         return await response.json()
      },
      onSuccess: () => {
         toast.success('Categories deleted!')
         queryClient.invalidateQueries({ queryKey: ['categories'] })
         queryClient.invalidateQueries({ queryKey: ['summary'] })
      },
      onError: () => {
         toast.error('Failed to delete the categories!')
      },
   })

   const isDisabled = categoriesQuery.isLoading || bulkDeleteMutation.isPending

   // table loader.
   if (categoriesQuery.isLoading) {
      return (
         <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className="border-none drop-shadow-sm">
               <CardHeader>
                  <Skeleton className="h-8 w-48" />
               </CardHeader>
               <CardContent>
                  <div className='h-[1000px] w-full flex items-center justify-center'>
                     <Loader2 className='size-6 text-slate-300 animate-spin' />
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
         {/* card and data table. */}
         <Card className="border-none drop-shadow-sm">
            {/* title and add new category. */}
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
               <CardTitle className="text-xl line-clamp-1">
                  Categories Page
               </CardTitle>
               <Button size="sm" onClick={newCategory.onOpen}>
                  <PlusIcon className='size-4 mr-2' />
                  Add New
               </Button>
            </CardHeader>

            {/* data table. */}
            <CardContent>
               <DataTable
                  columns={columns}
                  data={categoriesQuery.data}
                  filterKey="name"
                  onDelete={(row) => {
                     const ids = row.map((r) => r.original.id)
                     bulkDeleteMutation.mutate({ ids })
                  }}
                  disabled={isDisabled} />
            </CardContent>
         </Card>
      </div>
   )
}

export default CategoriesPage
