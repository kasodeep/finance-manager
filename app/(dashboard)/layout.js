import Header from '@/components/header'

const DashboardLayout = ({ children }) => {
   return (
      <>
         <Header />
         <main className='px-3 lg:px-4'>
            {children}
         </main>
      </>
   )
}

export default DashboardLayout
