import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { insertAccountSchema } from '@/db/schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = insertAccountSchema.pick({
  name: true,
})

const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })

  const handleSubmit = (values) => {
    onSubmit(values)
  }

  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        {/* name field. */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Cash, Bank"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* submit button. */}
        <Button className="w-full" disabled={disabled}>
          {id ? 'Save Changes' : 'Create Account'}
        </Button>

        {/* delete button. */}
        {!!id && (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full flex gap-x-2"
          >
            <Trash className="size-4" />
            <span>Delete Account</span>
          </Button>
        )}
      </form>
    </Form>
  )
}

export default AccountForm
