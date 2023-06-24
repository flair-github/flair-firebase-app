import React from 'react'
import { Dialog } from '@headlessui/react'
import { lazy, Suspense, useState } from 'react'
import { Outlet, RouteObject, useRoutes, BrowserRouter } from 'react-router-dom'

const Loading = () => <p className="h-full w-full p-4 text-center">Loading...</p>

const IndexScreen = lazy(() => import('~/components/screens/Index'))
const Page404Screen = lazy(() => import('~/components/screens/404'))

function Layout() {
  return (
    <div>
      <nav className="flex items-center justify-between p-4">
        <span>Header</span>
      </nav>
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
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  )
}
