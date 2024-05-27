'use client'

import { Loader2, PlusIcon } from 'lucide-react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { getAccounts } from '@/features/accounts/api/get-accounts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'

import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { columns } from './columns'

const AccountsPage = () => {
   const newAccount = useNewAccount()

   // get all the accounts.
   const accountsQuery = useQuery({
      queryKey: ["accounts"],
      queryFn: getAccounts,
   })

   // making the api call to delete accounts in bulk.
   const queryClient = useQueryClient()
   const bulkDeleteMutation = useMutation({
      mutationFn: async (json) => {
         const response = await client.api.accounts["bulk-delete"]["$post"]({ json })
         return await response.json()
      },
      onSuccess: () => {
         toast.success('Accounts deleted!')
         queryClient.invalidateQueries({ queryKey: ['accounts'] })
         queryClient.invalidateQueries({ queryKey: ['summary'] })
      },
      onError: () => {
         toast.error('Failed to delete the accounts!')
      },
   })

   const isDisabled = accountsQuery.isLoading || bulkDeleteMutation.isPending

   // table loader.
   if (accountsQuery.isLoading) {
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
            {/* title and add new account. */}
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
               <CardTitle className="text-xl line-clamp-1">
                  Accounts Page
               </CardTitle>
               <Button size="sm" onClick={newAccount.onOpen}>
                  <PlusIcon className='size-4 mr-2' />
                  Add New
               </Button>
            </CardHeader>

            {/* data table. */}
            <CardContent>
               <DataTable
                  columns={columns}
                  data={accountsQuery.data}
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

export default AccountsPage
