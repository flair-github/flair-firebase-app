import React from 'react'
import { GridLoader } from 'react-spinners'

function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-300">
      <GridLoader color="rgba(0,0,0,0.1)" />
    </div>
  )
}

export default PageLoader
