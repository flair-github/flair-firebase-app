import React from 'react'
import { ImCheckmark2, ImWarning } from 'react-icons/im'

function DeploymentToast({
  deploymentStatus,
}: {
  deploymentStatus: ['success' | 'error', string] | undefined
}) {
  return (
    deploymentStatus && (
      <div className="toast">
        <div
          className={`alert ${
            deploymentStatus[0] === 'success' ? 'alert-success' : 'alert-error'
          }`}>
          {deploymentStatus[0] === 'success' ? (
            <ImCheckmark2 className="h-6 w-6" />
          ) : (
            <ImWarning className="h-6 w-6" />
          )}
          <span>{deploymentStatus[1]}</span>
        </div>
      </div>
    )
  )
}

export default DeploymentToast
