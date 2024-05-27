import { TriangleAlert } from 'lucide-react'

import { useOpenCategory } from '@/features/category/hooks/use-open-category'
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction'

import { cn } from '@/lib/utils'

const CategoryColumn = ({ id, category, categoryId }) => {

   const { onOpen: onOpenCategory } = useOpenCategory()
   const { onOpen: onOpenTransaction } = useOpenTransaction()

   const onClick = () => {
      if (categoryId)
         onOpenCategory(categoryId)
      else
         onOpenTransaction(id)
   }

   return (
      <div className={cn(
         'flex items-center cursor-pointer hover:underline',
         !category && 'text-rose-500'
      )}
         onClick={onClick}>
         {!category && <TriangleAlert className='mr-2 size-4 shrink-0' />}
         {category || "Uncategorized"}
      </div>
   )
}

export default CategoryColumn
