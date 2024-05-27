"use client"

import { Edit, MoreHorizontal } from "lucide-react"

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const Actions = ({ id }) => {
   const { onOpen } = useOpenAccount()

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
