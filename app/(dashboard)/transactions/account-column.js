import { useOpenAccount } from '@/features/accounts/hooks/use-open-account'

const AccountColumn = ({ account, accountId }) => {

   const { onOpen: onOpenAccount } = useOpenAccount()
   const onClick = () => {
      onOpenAccount(accountId)
   }

   return (
      <div className='flex items-center cursor-pointer hover:underline' onClick={onClick}>
         {account}
      </div>
   )
}

export default AccountColumn
