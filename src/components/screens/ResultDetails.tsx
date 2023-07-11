import React from 'react'
import { Dialog } from '@headlessui/react'
import { useRef, useState } from 'react'
import { SignInButton } from '~/components/domain/auth/SignInButton'
import { SignOutButton } from '~/components/domain/auth/SignOutButton'
import { Head } from '~/components/shared/Head'
import FlowEditor from './FlowEditor'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { FaShare, FaCloudDownloadAlt } from 'react-icons/fa'

const nodes = JSON.parse(FLOW_SAMPLE_2).nodes
const edges = JSON.parse(FLOW_SAMPLE_2).edges

function ResultDetails() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'evaluation'>('evaluation')

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
      <div className="stats mb-4 w-full shadow">
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
      <div className="stats mb-4 w-full shadow">
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
          <div className="stat-title">Total Token</div>
          <div className="stat-value">5,200 tokens</div>
          <div className="stat-desc text-lg font-bold">Avg: 56 tokens</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Latency</div>
          <div className="stat-value">90s</div>
          <div className="stat-desc text-lg font-bold">Avg: 200ms</div>
        </div>
      </div>
      <div className="tabs mb-2 w-full">
        <a
          className={`tab-lifted tab tab-lg ${activeTab === 'evaluation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('evaluation')}>
          Evaluation
        </a>
        <a
          className={`tab-lifted tab tab-lg ${activeTab === 'workflow' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('workflow')}>
          Workflow
        </a>
      </div>
      {activeTab === 'evaluation' && (
        <table className="table w-full shadow">
          <thead>
            <tr>
              <th>LLM Input</th>
              <th>LLM Output</th>
              <th>Ground Truth</th>
              <th>Similarity Score</th>
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
              <td>0.98</td>
            </tr>
            <tr>
              <td>"I'm experiencing issues with my internet connection."</td>
              <td>
                "Let's troubleshoot your internet connection. Have you tried restarting your modem?"
              </td>
              <td>
                "Let's troubleshoot your internet connection. Have you tried restarting your modem?"
              </td>
              <td>0.93</td>
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
              <td>0.85</td>
            </tr>
            <tr>
              <td>"What are your business hours?"</td>
              <td>"Our business hours are Monday to Friday, 9:00 AM to 6:00 PM."</td>
              <td>"Our business hours are Monday to Friday, 9:00 AM to 6:00 PM."</td>
              <td>0.97</td>
            </tr>
            <tr>
              <td>"Do you offer a money-back guarantee?"</td>
              <td>"Yes, we offer a 30-day money-back guarantee for all our products."</td>
              <td>"Yes, we offer a 30-day money-back guarantee for all our products."</td>
              <td>0.91</td>
            </tr>
            <tr>
              <td>"Can I change my shipping address?"</td>
              <td>
                "Certainly! Please provide your new shipping address and we'll update it for you."
              </td>
              <td>
                "Certainly! Please provide your new shipping address and we'll update it for you."
              </td>
              <td>0.96</td>
            </tr>
            <tr>
              <td>"What's the status of my order?"</td>
              <td>
                "Let me check the status of your order. Can you please provide your order number?"
              </td>
              <td>
                "Let me check the status of your order. Can you please provide your order number?"
              </td>
              <td>0.89</td>
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
              <td>0.95</td>
            </tr>
            <tr>
              <td>"Can I return an item for a refund?"</td>
              <td>
                "Yes, we accept returns for a refund within 30 days of purchase. Please provide your
                order details."
              </td>
              <td>"Can I return an item for a refund?"</td>
              <td>0.88</td>
            </tr>
            <tr>
              <td>"What's the best way to contact customer support?"</td>
              <td>"You can contact our customer support team via phone, email, or live chat."</td>
              <td>"You can contact our customer support team via phone, email, or live chat."</td>
              <td>0.92</td>
            </tr>
          </tbody>
        </table>
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
