window.global ||= window

import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Main from '~/components/root/Main'
import axios from 'axios'
axios.defaults.withCredentials = true


export const App = () => {
  return (
    <HelmetProvider>
      <Main />
    </HelmetProvider>
  )
}
