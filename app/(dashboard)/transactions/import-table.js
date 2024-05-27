import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableHeadSelect from "./table-head-select"

const ImportTable = ({ headers, body, selectedColumns, onTableHeadSelectChange }) => {

   return (
      <div className="rounded-md border overflow-hidden">
         <Table>
            {/* all the headers. */}
            <TableHeader className="bg-muted">
               <TableRow>
                  {headers.map((_item, index) => (
                     <TableHead key={index}>
                        <TableHeadSelect
                           columnIndex={index}
                           selectedColumns={selectedColumns}
                           onChange={onTableHeadSelectChange}
                        />
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>

            {/* the cells of the data. */}
            <TableBody>
               {body.map((row, index) => (
                  <TableRow key={index}>
                     {row.map((cell, index) => (
                        <TableCell key={index}>
                           {cell}
                        </TableCell>
                     ))}
                  </TableRow>
               ))}
            </TableBody>
         </Table>

      </div>
   )
}

export default ImportTable
