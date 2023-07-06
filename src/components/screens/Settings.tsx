import React from 'react'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { atomUserData } from '~/jotai/jotai'

function Settings() {
  const userData = useAtomValue(atomUserData)

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    return () => {}
  }, [userData?.userId])

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-xs form-control w-full">
        <h1 className="mt-5 text-2xl font-bold">AWS</h1>

        <label className="label">
          <span className="label-text">AWS Access Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter AWS Access Key"
          className="max-w-xs  input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">AWS Bucket Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter AWS Bucket Name"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">AWS Region Name</span>
        </label>
        <input
          type="text"
          placeholder="Enter AWS Region Name"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">AWS Secret Key</span>
        </label>
        <input
          type="password"
          placeholder="Enter AWS Secret Key"
          className="max-w-xs input w-full border-gray-800"
        />

        <h1 className="mt-5 text-2xl font-bold">DeepGram</h1>

        <label className="label">
          <span className="label-text">DeepGram API Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter DeepGram API Key"
          className="max-w-xs input w-full border-gray-800"
        />

        <h1 className="mt-5 text-2xl font-bold">Google Cloud</h1>

        <label className="label">
          <span className="label-text">Google Cloud Credentials</span>
        </label>
        <input
          type="text"
          placeholder="Enter Google Cloud Credentials"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">Google Storage Bucket</span>
        </label>
        <input
          type="text"
          placeholder="Enter Google Storage Bucket"
          className="max-w-xs input w-full border-gray-800"
        />

        <h1 className="mt-5 text-2xl font-bold">OpenAI</h1>

        <label className="label">
          <span className="label-text">OpenAI API Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter OpenAI API Key"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">OpenAI Organization ID</span>
        </label>
        <input
          type="text"
          placeholder="Enter OpenAI Organization ID"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">Owner User ID</span>
        </label>
        <input
          type="text"
          placeholder="Enter Owner User ID"
          className="max-w-xs input w-full border-gray-800"
        />

        <h1 className="mt-5 text-2xl font-bold">Pine Cone</h1>

        <label className="label">
          <span className="label-text">Pine Cone API Key</span>
        </label>
        <input
          type="text"
          placeholder="Enter Pine Cone API Key"
          className="max-w-xs input w-full border-gray-800"
        />

        <label className="label">
          <span className="label-text">Pine Cone Environment</span>
        </label>
        <input
          type="text"
          placeholder="Enter Pine Cone Environment"
          className="max-w-xs input w-full border-gray-800"
        />

        <div>
          <button className="btn my-5">Save</button>
        </div>
      </div>
    </div>
  )
}

export default Settings
