window.global ||= window

import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import Main from '~/components/root/Main'
import axios from 'axios'
import SupabaseMain from './SupabaseMain'
axios.defaults.withCredentials = true

export const App = () => {
  return (
    <HelmetProvider>
      {import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_KEY ? (
        <SupabaseMain />
      ) : (
        <Main />
      )}
    </HelmetProvider>
  )
}
