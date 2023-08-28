import { Dialog } from '@headlessui/react'
import React from 'react'
import { CodeBlock } from 'react-code-blocks'
import Modal from '~/components/ui/modal'

function JSONConfigModal({
  isJsonModalShown,
  setIsJsonModalShown,
  jsonConfig,
}: {
  isJsonModalShown: boolean
  setIsJsonModalShown: React.Dispatch<React.SetStateAction<boolean>>
  jsonConfig: string
}) {
  return (
    <Modal
      isOpen={isJsonModalShown}
      onClose={() => {
        setIsJsonModalShown(false)
      }}>
      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
        JSON Configuration File
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-500">Here is the config file based on the current flow.</p>
      </div>
      <div className="t-border mt-2 h-96 overflow-y-auto font-mono">
        <CodeBlock text={jsonConfig} language="json" showLineNumbers={true} wrapLines />
      </div>

      <div className="mt-4 flex">
        <button
          type="button"
          className="t-border inline-flex justify-center rounded-md border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={() => {
            setIsJsonModalShown(false)
          }}>
          Close
        </button>
        <div className="flex-1" />
      </div>
    </Modal>
  )
}

export default JSONConfigModal
