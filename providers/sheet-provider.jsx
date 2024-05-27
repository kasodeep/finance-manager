'use client'

import { useMountedState } from 'react-use'

import EditAccountSheet from '@/features/accounts/components/edit-account-sheet'
import NewAccountSheet from '@/features/accounts/components/new-account-sheet'

import EditCategorySheet from '@/features/category/components/edit-category-sheet'
import NewCategorySheet from '@/features/category/components/new-category-sheet'

import EditTransactionSheet from '@/features/transactions/components/edit-transaction-sheet'
import NewTransactionSheet from '@/features/transactions/components/new-transaction-sheet'

const SheetProvider = () => {
  const isMounted = useMountedState()
  if (!isMounted) return null

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />

      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  )
}

export default SheetProvider
