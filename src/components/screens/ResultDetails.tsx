import React from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import FlowEditor from './FlowEditor'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { FaShare, FaCloudDownloadAlt } from 'react-icons/fa'
import { PiFileCsvFill } from 'react-icons/pi'

const nodes = JSON.parse(FLOW_SAMPLE_2).nodes
const edges = JSON.parse(FLOW_SAMPLE_2).edges

function ResultDetails() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'evaluation' | 'result'>('evaluation')

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex items-center ">
        <h1 className="text-3xl font-bold">Customer Call Workflow #1831</h1>
        <div className="flex-1" />
        <a className="btn mr-2" href="#" onClick={() => {}}>
          <FaShare /> Share
        </a>
        <a className="btn" href="#" onClick={() => {}}>
          <FaCloudDownloadAlt /> Download
        </a>
      </div>
      <div className="stats mb-4 w-full grid-cols-4 shadow">
        <div className="stat">
          <div className="stat-title">Model</div>
          <div className="stat-value">gpt-4</div>
        </div>
        <div className="stat">
          <div className="stat-title">Accuracy</div>
          <div className="stat-value">98%</div>
          <div className="stat-desc">5% more than last run</div>
        </div>
        <div className="stat">
          <div className="stat-title">Hallucination</div>
          <div className="stat-value">1.2%</div>
          <div className="stat-desc">21% more than last run</div>
        </div>
        <div className="stat">
          <div className="stat-title">Invalid Format</div>
          <div className="stat-value">3%</div>
          <div className="stat-desc">4% more than last run</div>
        </div>
      </div>
      <div className="stats mb-4 w-full grid-cols-4 shadow">
        <div className="stat">
          <div className="stat-title">Request Time</div>
          <div className="stat-value">
            <div className="text-3xl">2023/06/25</div>
            <div className="stat-desc text-lg font-bold">10:45:30</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Time</div>
          <div className="stat-value">25 minutes</div>
          <div className="stat-desc text-lg font-bold">Avg: 2.3 minutes</div>
        </div>
        <div className="stat">
          <div className="stat-title">Average Tokens</div>
          <div className="stat-value">192.3 tokens</div>
          {/* <div className="stat-desc text-lg font-bold">Avg: 56 tokens</div> */}
        </div>
        <div className="stat">
          <div className="stat-title">Average Latency</div>
          <div className="stat-value">211.2ms</div>
          {/* <div className="stat-desc text-lg font-bold">Avg: 200ms</div> */}
        </div>
      </div>
      <div className="tabs tabs-boxed mb-2 w-full justify-center">
        <a
          className={`tab tab-lg font-bold ${activeTab === 'evaluation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('evaluation')}>
          Evaluation
        </a>
        <a
          className={`tab tab-lg font-bold ${activeTab === 'result' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('result')}>
          Result
        </a>
        <a
          className={`tab tab-lg font-bold ${activeTab === 'workflow' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('workflow')}>
          Workflow
        </a>
      </div>
      {activeTab === 'evaluation' && (
        <div>
          <div className="mb-3 flex space-x-2">
            <div className="form-control w-80">
              <label className="label">
                <span className="label-text">LLM Output Column</span>
              </label>
              <select className="select-bordered select">
                <option>Call Question</option>
                <option>Answer</option>
                <option>Score</option>
              </select>
            </div>
            <div className="flex-1" />
            <div className="form-control w-80">
              <label className="label">
                <span className="label-text">Similarity Score</span>
              </label>
              <select className="select-bordered select">
                <option>All</option>
                <option>{'< 0.9'}</option>
                <option>{'< 0.8'}</option>
                <option>{'< 0.7'}</option>
                <option>{'< 0.6'}</option>
                <option>{'< 0.5'}</option>
              </select>
            </div>
            <div className="form-control w-80">
              <label className="label">
                <span className="label-text">OpenAI Eval</span>
              </label>
              <select className="select-bordered select">
                <option>All</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
          </div>
          <table className="table w-full shadow">
            <thead>
              <tr>
                <th>LLM Input</th>
                <th>LLM Output</th>
                <th>Ground Truth</th>
                <th>Similarity Score</th>
                <th>OpenAI Eval</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"Can you help me with my account balance?"</td>
                <td>
                  "I can assist you with your account balance. Please provide me with your account
                  details."
                </td>
                <td>
                  "I can assist you with your account balance. Please provide me with your account
                  details."
                </td>
                <td>
                  <span className="font-bold">0.98</span>
                </td>
                <td>
                  <span className="font-bold">1</span>
                </td>
              </tr>
              <tr>
                <td>"I'm experiencing issues with my internet connection."</td>
                <td>
                  "Let's troubleshoot your internet connection. Have you tried restarting your
                  modem?"
                </td>
                <td>
                  "Let's troubleshoot your internet connection. Have you tried restarting your
                  modem?"
                </td>
                <td>
                  <span className="font-bold">0.93</span>
                </td>
                <td>
                  <span className="font-bold">2</span>
                </td>
              </tr>
              <tr>
                <td>"How can I cancel my subscription?"</td>
                <td>
                  "To cancel your subscription, please visit our website and go to the account
                  settings."
                </td>
                <td>
                  "To cancel your subscription, please visit our website and go to the account
                  settings."
                </td>
                <td>
                  <span className="font-bold text-red-500">0.65</span>
                </td>
                <td>
                  <span className="font-bold">3</span>
                </td>
              </tr>
              <tr>
                <td>"What are your business hours?"</td>
                <td>"Our business hours are Monday to Friday, 9:00 AM to 6:00 PM."</td>
                <td>"Our business hours are Monday to Friday, 9:00 AM to 6:00 PM."</td>
                <td>
                  <div className="font-bold">0.97</div>
                </td>
                <td>
                  <span className="font-bold">2</span>
                </td>
              </tr>
              <tr>
                <td>"Do you offer a money-back guarantee?"</td>
                <td>"Yes, we offer a 30-day money-back guarantee for all our products."</td>
                <td>"Yes, we offer a 30-day money-back guarantee for all our products."</td>
                <td>
                  <div className="font-bold">0.91</div>
                </td>
                <td>
                  <span className="font-bold">1</span>
                </td>
              </tr>
              <tr>
                <td>"Can I change my shipping address?"</td>
                <td>
                  "Certainly! Please provide your new shipping address and we'll update it for you."
                </td>
                <td>
                  "Certainly! Please provide your new shipping address and we'll update it for you."
                </td>
                <td>
                  <span className="font-bold text-orange-500">0.75</span>
                </td>
                <td>
                  <span className="font-bold">2</span>
                </td>
              </tr>
              <tr>
                <td>"What's the status of my order?"</td>
                <td>
                  "Let me check the status of your order. Can you please provide your order number?"
                </td>
                <td>
                  "Let me check the status of your order. Can you please provide your order number?"
                </td>
                <td>
                  <span className="font-bold text-orange-500">0.78</span>
                </td>
                <td>
                  <span className="font-bold">1</span>
                </td>
              </tr>
              <tr>
                <td>"How do I reset my password?"</td>
                <td>
                  "To reset your password, click on the 'Forgot Password' link and follow the
                  instructions."
                </td>
                <td>
                  "To reset your password, click on the 'Forgot Password' link and follow the
                  instructions."
                </td>
                <td>
                  <div className="font-bold">0.95</div>
                </td>
                <td>
                  <span className="font-bold">4</span>
                </td>
              </tr>
              <tr>
                <td>"Can I return an item for a refund?"</td>
                <td>
                  "Yes, we accept returns for a refund within 30 days of purchase. Please provide
                  your order details."
                </td>
                <td>"Can I return an item for a refund?"</td>
                <td>
                  <div className="font-bold">0.88</div>
                </td>
                <td>
                  <span className="font-bold">3</span>
                </td>
              </tr>
              <tr>
                <td>"What's the best way to contact customer support?"</td>
                <td>"You can contact our customer support team via phone, email, or live chat."</td>
                <td>"You can contact our customer support team via phone, email, or live chat."</td>
                <td>
                  <div className="font-bold">0.92</div>
                </td>
                <td>
                  <span className="font-bold">4</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'result' && (
        <div className="justify-left flex w-full border [height:720px]">
          <div className="container max-w-200 p-5">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Workflow Result</h3>
              {/* <p className="max-w-2xl mt-1 text-sm leading-6 text-gray-500">
                Personal details and application.
              </p> */}
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Storage Location</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">S3</dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Region</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    us-west-2
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Bucket</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    bn-complete-dev-test
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Path</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    llm/result/workflow1/*
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Result Type</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    CSV
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Files</dt>
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200">
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <PiFileCsvFill className="h-5 w-5 shrink-0 text-gray-400" />
                          <div className="min-w-0 ml-4 flex flex-1 gap-2">
                            <span className="truncate font-medium">llm_result.csv</span>
                            <span className="shrink-0 text-gray-400">2.5 MB</span>
                          </div>
                        </div>
                        <div className="ml-4 shrink-0">
                          <a href="#" className="font-medium text-primary hover:text-primary/80">
                            Download
                          </a>
                        </div>
                      </li>
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <PiFileCsvFill className="h-5 w-5 shrink-0 text-gray-400" />
                          <div className="min-w-0 ml-4 flex flex-1 gap-2">
                            <span className="truncate font-medium">evaluation_result.csv</span>
                            <span className="shrink-0 text-gray-400">2.6 MB</span>
                          </div>
                        </div>
                        <div className="ml-4 shrink-0">
                          <a href="#" className="font-medium text-primary hover:text-primary/80">
                            Download
                          </a>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'workflow' && (
        <div className="w-full border [height:720px]">
          <FlowEditor viewerOnly={true} initialNodes={nodes} initialEdges={edges} />
        </div>
      )}
    </div>
  )
}

export default ResultDetails
