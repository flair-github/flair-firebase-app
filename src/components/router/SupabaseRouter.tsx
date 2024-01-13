import { useAtomValue } from 'jotai'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useNavigate, useRoutes } from 'react-router-dom'
import { atomUserData } from '~/jotai/jotai'

const Loading = () => <p className="h-full w-full p-4 text-center">Loading...</p>

const ResultsScreen = lazy(() => import('~/components/screens/SupabaseResults'))
const ResultDetailsScreen = lazy(() => import('~/components/screens/SupabaseResultDetails'))

function Layout() {
  const userData = useAtomValue(atomUserData)

  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="navbar h-1 max-h-16 border-b bg-base-100">
        <div className="flex-1">
          <div
            className="btn btn-ghost text-xl normal-case"
            onClick={() => {
              navigate('/')
            }}>
            <img src="/images/flair-logo.svg" width={120} height={2} className="" />
          </div>
          {/* <ul className="menu menu-horizontal px-1">
            <li
              onClick={() => {
                navigate('/results')
              }}>
              <a>Experiments</a>
            </li>
            <li
              onClick={() => {
                // navigate('/results')
              }}>
              <a>Deployments</a>
            </li>
          </ul> */}
        </div>
        {/* <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn btn-ghost flex px-2 font-normal normal-case">
              <div>Debug</div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-20 mt-3 w-52 bg-base-100 p-2 shadow">
              <li
                onClick={() => {
                  navigate('/llm-outputs')
                }}>
                <a>LLM Outputs</a>
              </li>
            </ul>
          </div>
        </div> */}
        {/* <div className="flex-none">
          <div className={'dropdown-end ' + 'dropdown'}>
            <label tabIndex={0} className="btn btn-ghost flex px-2 normal-case">
              <div>{userData?.userName || 'Flair User'}</div>
              <div className="w-9 overflow-hidden rounded-full">
                <img src={userData?.userPhotoUrl} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-20 mt-3 w-52 bg-base-100 p-2 shadow">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li
                onClick={() => {
                  navigate('/settings')
                }}>
                <a>Settings</a>
              </li>
              <li onClick={() => {}}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
      <Outlet />
    </div>
  )
}

const InnerRouter = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <ResultsScreen />,
        },
        {
          path: 'result-details/:resultId',
          element: <ResultDetailsScreen />,
        },
      ],
    },
  ]
  const element = useRoutes(routes)

  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  )
}

const SupabaseRouter = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  )
}

export default SupabaseRouter
