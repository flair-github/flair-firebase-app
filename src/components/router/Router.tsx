import { useAtomValue } from 'jotai'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Outlet, RouteObject, useNavigate, useRoutes } from 'react-router-dom'
import { atomUser, atomUserData } from '~/jotai/jotai'
import LoginScreen from '../screens/Login'
import PageLoader from '../screens/Loader'
import { useAuth } from '~/lib/firebase'

const Loading = () => <p className="h-full w-full p-4 text-center">Loading...</p>

const IndexScreen = lazy(() => import('~/components/screens/Index'))
const Page404Screen = lazy(() => import('~/components/screens/404'))
const FlowEditorScreen = lazy(() => import('~/components/screens/FlowEditor'))
const ResultsScreen = lazy(() => import('~/components/screens/Results'))
const ResultDetailsScreen = lazy(() => import('~/components/screens/ResultDetails'))
const LLMOutputsScreen = lazy(() => import('~/components/screens/LLMOutputs'))
const SettingsScreen = lazy(() => import('~/components/screens/Settings'))
const TemplatesScreen = lazy(() => import('~/components/screens/Templates'))
const TemplateWizardScreen = lazy(() => import('~/components/screens/TemplateWizard'))
const TranscriptionScreen = lazy(() => import('~/components/screens/Transcription'))
const UserConfigScreen = lazy(() => import('~/components/screens/UserConfig'))
const DeploymentScreen = lazy(() => import('~/components/screens/Deployment'))

const Layout = () => {
  const userData = useAtomValue(atomUserData)
  const auth = useAuth()

  const handleSignOut = () => {
    auth.signOut()
  }

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
            <img src="/images/flair-ai.svg" width={120} height={2} className="" />
          </div>
          <ul className="menu menu-horizontal px-1">
            <li
              onClick={() => {
                navigate('/results')
              }}>
              <a>Experiments</a>
            </li>
            <li
              onClick={() => {
                navigate('/deployment')
              }}>
              <a>Deployments</a>
            </li>
            <li
              onClick={() => {
                navigate('/transcription')
              }}>
              <a>Scripts</a>
            </li>
          </ul>
        </div>
        <div className="flex-none">
          <div className={'dropdown-end' + ' dropdown'}>
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
                <p>LLM Outputs</p>
              </li>
              <li
                onClick={() => {
                  navigate('/user-config')
                }}>
                <p>User Config</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost flex px-2 normal-case">
              <div>{userData?.userName || 'Flair User'}</div>
              <div className="w-9 overflow-hidden rounded-full">
                <img src={userData?.userPhotoUrl} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-20 mt-3 w-52 bg-base-100 p-2 shadow">
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
        {
          path: 'transcription',
          element: <TranscriptionScreen />,
        },
        {
          path: 'user-config',
          element: <UserConfigScreen />,
        },
        {
          path: 'deployment',
          element: <DeploymentScreen />,
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

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  )
}
