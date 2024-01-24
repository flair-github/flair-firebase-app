import React, { lazy } from 'react'
import { useAtomValue } from 'jotai'
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom'
import { atomUser } from '~/jotai/jotai'
import LoginScreen from '../screens/Login'
import PageLoader from '../screens/Loader'
import Sidenav from '../shared/Sidenav'

const Loading = () => <p className="h-full w-full p-4 text-center">Loading...</p>

const IndexScreen = lazy(() => import('~/components/screens/Index'))
const Page404Screen = lazy(() => import('~/components/screens/404'))
const CredentialsScreen = lazy(() => import('~/components/screens/Credentials'))
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
const DeploymentDetailsScreen = lazy(() => import('~/components/screens/DeploymentDetails'))
const DeploymentItemsScreen = lazy(() => import('~/components/screens/DeploymentItems'))

const InnerRouter = () => {
  const user = useAtomValue(atomUser)

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Sidenav />,
      children: [
        {
          index: true,
          element: <IndexScreen />,
        },
        {
          path: 'result',
          element: <ResultsScreen />,
        },
        {
          path: 'result/:resultId',
          element: <ResultDetailsScreen />,
        },
        {
          path: 'credentials',
          element: <CredentialsScreen />,
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
          path: 'editor/:workflowId',
          element: <FlowEditorScreen />,
        },
        {
          path: 'editor/:workflowId/:workflowRequestId',
          element: <FlowEditorScreen viewOnly={true} />,
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
        {
          path: 'deployment/:deploymentId',
          element: <DeploymentDetailsScreen />,
        },
        {
          path: 'deployment/:deploymentId/:detailId',
          element: <DeploymentItemsScreen />,
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

  return element
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  )
}
