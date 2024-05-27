import { useState } from "react"

import { format, parse } from "date-fns"
import { convertAmountToMiliunits } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import ImportTable from "./import-table"

// few constants.
const dateFormat = "dd-MM-yyyy"
const outputFormat = "yyyy-MM-dd"

const requiredOptions = [
   "amount",
   "date",
   "payee"
]

const ImportCard = ({ data, onCancel, onSubmit }) => {

   // selected columns of csv.
   const [selectedColumns, setSelectedColumns] = useState({})

   const headers = data[0]
   const body = data.slice(1)

   // setting the selectedColumns using their index.
   const onTableHeadSelectChange = (columnIndex, value) => {
      setSelectedColumns((prev) => {
         const newSelectedColumns = { ...prev }

         for (const key in newSelectedColumns) {
            if (newSelectedColumns[key] === value) {
               newSelectedColumns[key] = null
            }
         }

         if (value === "skip") value = null
         newSelectedColumns[`column_${columnIndex}`] = value
         return newSelectedColumns
      })
   }

   const progress = Object.values(selectedColumns).filter(Boolean).length

   // craziest function ever.
   const handleContinue = () => {
      // selecting the data from selected column.
      const mappedData = {
         headers: headers.map((_header, index) => {
            return selectedColumns[`column_${index}`] || null
         }),
         body: body.map((row) => {
            const transformedRow = row.map((cell, index) => {
               return selectedColumns[`column_${index}`] ? cell : null
            })

            return transformedRow.every((item) => item === null) ? [] : transformedRow
         }).filter((row) => row.length > 0)
      }

      const arrayOfData = mappedData.body.map((row) => {
         return row.reduce((acc, cell, index) => {
            const header = mappedData.headers[index]
            if (header !== null) {
               acc[header] = cell
            }
            return acc
         }, {})
      })

      const formattedData = arrayOfData.map((item) => ({
         ...item,
         amount: convertAmountToMiliunits(parseFloat(item.amount)),
         date: format(parse(item.date, dateFormat, new Date()), outputFormat)
      }))

      onSubmit(formattedData)
   }

   return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
         <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
               <CardTitle className="text-xl line-clamp-1">
                  Import Transactions
               </CardTitle>

               {/* cancel and continue buttons. */}
               <div className='flex flex-col lg:flex-row gap-y-2 items-center gap-x-2'>
                  <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
                     Cancel
                  </Button>
                  <Button
                     disabled={progress < requiredOptions.length}
                     size="sm"
                     onClick={handleContinue}
                     className="w-full lg:w-auto"
                  >
                     Continue ({progress} / {requiredOptions.length})
                  </Button>
               </div>
            </CardHeader>

            {/* import table. */}
            <CardContent>
               <ImportTable
                  headers={headers}
                  body={body}
                  selectedColumns={selectedColumns}
                  onTableHeadSelectChange={onTableHeadSelectChange}
               />
            </CardContent>
         </Card>
      </div>
   )
}

export default ImportCard