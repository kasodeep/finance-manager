"use client"

import { Edit, MoreHorizontal } from "lucide-react"

import { useOpenCategory } from "@/features/category/hooks/use-open-category"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Actions = ({ id }) => {
   const { onOpen } = useOpenCategory()

   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="size-8 p-0">
                  <MoreHorizontal className="size-4" />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
                  <Edit className="size-4 mr-2" /> Edit
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   )
}

export default Actions
