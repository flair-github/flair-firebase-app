import React from 'react'
import { useAtomValue } from 'jotai'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom'
import { atomUser } from '~/jotai/jotai'
import LoginScreen from '../screens/Login'
import PageLoader from '../screens/Loader'
import { useAuth } from '~/lib/firebase'

const Loading = () => <p className="h-full w-full p-4 text-center">Loading...</p>

const IndexScreen = lazy(() => import('~/components/screens/Index'))
const Page404Screen = lazy(() => import('~/components/screens/404'))

function Layout() {
  const user = useAtomValue(atomUser)
  const auth = useAuth()

  const handleSignOut = () => {
    auth.signOut()
  }

  return (
    <div>
      <div className="navbar border-b bg-base-100">
        <div className="flex-1">
          <div className="btn-ghost btn text-xl normal-case">
            <img src="/images/flair-ai.svg" width={120} height={2} className="" />
          </div>
        </div>
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-9 rounded-full">
                <img src={user?.photoURL || 'https://www.gravatar.com/avatar/' + user?.uid} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow">
              {/* <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li> */}
              <li onClick={handleSignOut}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  )
}

const InnerRouter = () => {
  const user = useAtomValue(atomUser)

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  if (user === undefined) {
    return <PageLoader />
  }

  if (user === null) {
    return <LoginScreen />
  }

  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  )
}
