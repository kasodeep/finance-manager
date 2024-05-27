import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'

import { Loader2 } from 'lucide-react'

import Filters from './filters'
import HeaderLogo from './header-logo'
import Navigation from './navigation'
import WelcomeMsg from './welcome-msg'

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-600 to-blue-400 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          {/* logo and navbar. */}
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>

          {/* logout button. */}
          <div className="flex items-center">
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
            <ClerkLoading>
              <Loader2 className="size-8 animate-spin text-slate-400" />
            </ClerkLoading>
          </div>
        </div>

        {/* welcome msg. */}
        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  )
}

export default Header
