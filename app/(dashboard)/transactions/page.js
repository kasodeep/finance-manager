'use client'

import { useState } from 'react'
import { Loader2, PlusIcon } from 'lucide-react'

import { useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import useSelectAccount from '@/features/accounts/hooks/use-select-account'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTable } from '@/components/data-table'

import { columns } from './columns'
import { client } from '@/lib/hono'
import { toast } from 'sonner'

import UploadButton from './upload-button'
import ImportCard from './import-card'


const VARIANTS = {
   LIST: "LIST",
   IMPORT: "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
   data: [],
   errors: [],
   meta: {}
}

const TransactionsPage = () => {

   // CSV Import.
   const [AccountDialog, confirm] = useSelectAccount()
   const [variant, setVariant] = useState(VARIANTS.LIST)
   const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

   const onUpload = (results) => {
      setImportResults(results)
      setVariant(VARIANTS.IMPORT)
   }

   const onCancelImport = () => {
      setImportResults(INITIAL_IMPORT_RESULTS)
      setVariant(VARIANTS.LIST)
   }

   const queryClient = useQueryClient()
   const bulkCreateMutation = useMutation({
      mutationFn: async (json) => {
         const response = await client.api.transactions["bulk-create"]["$post"]({ json })
         return await response.json()
      },
      onSuccess: () => {
         toast.success('Transactions created!')
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
         queryClient.invalidateQueries({ queryKey: ['summary'] })
      },
      onError: () => {
         toast.error('Failed to create the transactions!')
      },
   })

   const onSubmitImport = async (values) => {
      const Id = await confirm()
      if (!Id) return toast.error("Please select an account to continue!")

      const data = values.map((value) => ({
         ...value,
         accountId: Id
      }))

      bulkCreateMutation.mutate(data, {
         onSuccess: () => {
            onCancelImport()
         }
      })
   }

   // Data of Transaction.
   const newTransaction = useNewTransaction()

   // getting the params.
   const params = useSearchParams()
   const from = params.get("from") || ""
   const to = params.get("to") || ""
   const accountId = params.get("accountId") || ""

   // get all the transactions.
   const transactionsQuery = useQuery({
      queryKey: ["transactions", { from, to, accountId }],
      queryFn: async () => {
         const response = await client.api.transactions.$get({
            query: {
               from, to, accountId
            }
         })

         if (!response.ok) {
            throw new Error("Failed to fetch transactions!")
         }

         const { data } = await response.json()
         return data
      }
   })

   // making the api call to delete transactions in bulk.   
   const bulkDeleteMutation = useMutation({
      mutationFn: async (json) => {
         const response = await client.api.transactions["bulk-delete"]["$post"]({ json })
         return await response.json()
      },
      onSuccess: () => {
         toast.success('Transactions deleted!')
         queryClient.invalidateQueries({ queryKey: ['transactions'] })
         queryClient.invalidateQueries({ queryKey: ['summary'] })
      },
      onError: () => {
         toast.error('Failed to delete the transactions!')
      },
   })

   const isDisabled = transactionsQuery.isLoading || bulkDeleteMutation.isPending

   // table loader.
   if (transactionsQuery.isLoading) {
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

   if (variant === VARIANTS.IMPORT) {
      return (
         <>
            <AccountDialog />
            <ImportCard
               data={importResults.data}
               onCancel={onCancelImport}
               onSubmit={onSubmitImport}
            />
         </>
      )
   }

   return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
         {/* card and data table. */}
         <Card className="border-none drop-shadow-sm">
            {/* title and add new transaction. */}
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
               <CardTitle className="text-xl line-clamp-1">
                  Transactions History
               </CardTitle>
               {/* add new transaction and import csv. */}
               <div className='flex flex-col gap-y-2 items-center lg:flex-row lg:gap-x-2'>
                  <Button size="sm" onClick={newTransaction.onOpen} className="w-full lg:w-auto">
                     <PlusIcon className='size-4 mr-2' />
                     Add New
                  </Button>
                  <UploadButton
                     onUpload={onUpload}
                     className="w-full lg:w-auto"
                  />
               </div>
            </CardHeader>

            {/* data table. */}
            <CardContent>
               <DataTable
                  columns={columns}
                  data={transactionsQuery?.data}
                  filterKey="payee"
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

export default TransactionsPage
