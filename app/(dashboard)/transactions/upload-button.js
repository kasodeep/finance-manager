import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useCSVReader } from "react-papaparse"

const UploadButton = ({ onUpload }) => {
   const { CSVReader } = useCSVReader()

   return (
      <CSVReader onUploadAccepted={onUpload}>
         {({ getRootProps }) => (
            <Button size="sm" className="w-full lg:w-auto"
               {...getRootProps()}
            >
               <Upload className="size-4 mr-2" />
               Import
            </Button>
         )}
      </CSVReader>
   )
}

export default UploadButton
