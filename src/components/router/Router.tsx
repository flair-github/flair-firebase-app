import { useAtomValue } from 'jotai'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useNavigate, useRoutes } from 'react-router-dom'
import { atomUser, atomUserData } from '~/jotai/jotai'
import LoginScreen from '../screens/Login'
import PageLoader from '../screens/Loader'
import { useAuth } from '~/lib/firebase'

const Loading = () => <p className="w-full h-full p-4 text-center">Loading...</p>

const IndexScreen = lazy(() => import('~/components/screens/Index'))
const Page404Screen = lazy(() => import('~/components/screens/404'))
const FlowEditorScreen = lazy(() => import('~/components/screens/FlowEditor'))
const ResultsScreen = lazy(() => import('~/components/screens/Results'))
const ResultDetailsScreen = lazy(() => import('~/components/screens/ResultDetails'))
const LLMOutputsScreen = lazy(() => import('~/components/screens/LLMOutputs'))
const SettingsScreen = lazy(() => import('~/components/screens/Settings'))
const TemplatesScreen = lazy(() => import('~/components/screens/Templates'))
const TemplateWizardScreen = lazy(() => import('~/components/screens/TemplateWizard'))

function Layout() {
  const userData = useAtomValue(atomUserData)
  const auth = useAuth()

  const handleSignOut = () => {
    auth.signOut()
  }

  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <div className="h-1 border-b navbar max-h-16 bg-base-100">
        <div className="flex-1">
          <div
            className="text-xl normal-case btn-ghost btn"
            onClick={() => {
              navigate('/')
            }}>
            <img src="/images/flair-ai.svg" width={120} height={2} className="" />
          </div>
          <ul className="px-1 menu menu-horizontal">
            <li
              onClick={() => {
                navigate('/')
              }}>
              <a>Studio</a>
            </li>
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
          </ul>
        </div>
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="flex px-2 font-normal normal-case btn-ghost btn">
              <div>Debug</div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow">
              <li
                onClick={() => {
                  navigate('/llm-outputs')
                }}>
                <a>LLM Outputs</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="flex px-2 normal-case btn-ghost btn">
              <div>{userData?.userName || 'Flair User'}</div>
              <div className="overflow-hidden rounded-full w-9">
                <img src={userData?.userPhotoUrl} />
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
              </li> */}
              <li
                onClick={() => {
                  navigate('/settings')
                }}>
                <a>Settings</a>
              </li>
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
          path: 'results',
          element: <ResultsScreen />,
        },
        {
          path: 'result-details/:resultId',
          element: <ResultDetailsScreen />,
        },
        {
          path: 'llm-outputs',
          element: <LLMOutputsScreen />,
        },
        {
          path: 'settings',
          element: <SettingsScreen />,
        },
        {
          path: 'editor',
          element: <FlowEditorScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
        {
          path: 'templates',
          element: <TemplatesScreen />,
        },
        {
          path: 'template-wizard',
          element: <TemplateWizardScreen />,
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
