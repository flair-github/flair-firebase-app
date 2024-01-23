import React, { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { atomUserData } from '~/jotai/jotai'
import { FiArrowRight } from 'react-icons/fi'
import { db } from '~/lib/firebase'
import { DocWorkflow } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Templates() {
  const userData = useAtomValue(atomUserData)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userData?.userId) {
      return
    }

    return () => {}
  }, [userData?.userId])

  return (
    <>
      <div className="hero h-96 bg-base-200">
        <div className="hero-content text-center">
          <div className="">
            <h1 className="text-5xl font-bold">
              🚀 Rapidly develop pipelines with ready-made templates
            </h1>
            <p className="py-6">
              From real estate to financial service and call center data, these ready-made Flair
              pipeline templates provide inspiration with just one click. Connect them to your own
              data sources and start customizing.
            </p>
            {/* <button className="btn-primary btn">Get Started</button> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="my-5 flex">
          {/* Menu */}
          <ul className="menu rounded-box w-56 bg-base-100">
            <li>
              <h2 className="menu-title">Categories</h2>
              <ul>
                <li>
                  <a>Customer Success</a>
                </li>
                <li>
                  <a>Customer Support</a>
                </li>
                <li>
                  <a>Data and Analytics</a>
                </li>
                <li>
                  <a>DevOps</a>
                </li>
                <li>
                  <a>Engineering</a>
                </li>
                <li>
                  <a>Marketing</a>
                </li>
                <li>
                  <a>Mobile</a>
                </li>
                <li>
                  <a>Operations</a>
                </li>
                <li>
                  <a>Product</a>
                </li>
                <li>
                  <a>Sales</a>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="menu-title">Use Cases</h2>
              <ul>
                <li>
                  <a>Admin Panel</a>
                </li>
                <li>
                  <a>Agriculture</a>
                </li>
                <li>
                  <a>Analytics / ML</a>
                </li>
                <li>
                  <a>CRM</a>
                </li>
                <li>
                  <a>Comms and Email</a>
                </li>
                <li>
                  <a>Compliance</a>
                </li>
                <li>
                  <a>Construction</a>
                </li>
                <li>
                  <a>Content / CMS</a>
                </li>
                <li>
                  <a>Dashboard</a>
                </li>
                <li>
                  <a>Ecommerce</a>
                </li>
                <li>
                  <a>Food & Beverage</a>
                </li>
                <li>
                  <a>HR</a>
                </li>
                <li>
                  <a>Hospitality</a>
                </li>
                <li>
                  <a>Logistics</a>
                </li>
                <li>
                  <a>Manufacturing</a>
                </li>
                <li>
                  <a>Marketplaces</a>
                </li>
                <li>
                  <a>Real Estate</a>
                </li>
                <li>
                  <a>Recruiting</a>
                </li>
                <li>
                  <a>Sales</a>
                </li>
                <li>
                  <a>Support Tool</a>
                </li>
                <li>
                  <a>Telecommunications</a>
                </li>
                <li>
                  <a>Utilities</a>
                </li>
                <li>
                  <a>e-Commerce</a>
                </li>
              </ul>
            </li>
            <li>
              <h2 className="menu-title">Data Sources</h2>
              <ul>
                <li>
                  <a>CircleCI</a>
                </li>
                <li>
                  <a>Close.io</a>
                </li>
                <li>
                  <a>Datadog</a>
                </li>
                <li>
                  <a>Elasticsearch</a>
                </li>
                <li>
                  <a>Firebase</a>
                </li>
                <li>
                  <a>Github</a>
                </li>
                <li>
                  <a>Google Sheets</a>
                </li>
                <li>
                  <a>GraphQL</a>
                </li>
                <li>
                  <a>Lambda</a>
                </li>
                <li>
                  <a>MySQL</a>
                </li>
                <li>
                  <a>PostgreSQL</a>
                </li>
                <li>
                  <a>REST API</a>
                </li>
                <li>
                  <a>S3</a>
                </li>
                <li>
                  <a>Salesforce</a>
                </li>
                <li>
                  <a>Segment</a>
                </li>
                <li>
                  <a>SendGrid</a>
                </li>
                <li>
                  <a>Slack</a>
                </li>
                <li>
                  <a>Stripe</a>
                </li>
                <li>
                  <a>Twilio</a>
                </li>
              </ul>
            </li>
          </ul>

          {/* Content */}
          <div className="my-4 flex-1">
            <div className="flex border-b py-4">
              <div className="mr-4">
                <img
                  src="/images/templates/basic-local-files-loader.svg"
                  width={330}
                  height={180}
                  className="border"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 text-3xl font-bold">Basic Prompting</div>
                <div className="mb-2">
                  Load files from external source, write prompts, and produce LLM results in under 5
                  minutes
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate('/template-wizard')
                  }}>
                  Get Started <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Templates
