import axios from 'axios'
import React, { LegacyRef, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  SelectionMode,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from 'reactflow'

import 'reactflow/dist/style.css'
// import '@manifoldco/react-select-zero/assets/react-select-zero.css'
// import './style/override.css'
import { DocWorkflow, DocWorkflowRequest } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useLocation, useNavigate } from 'react-router-dom'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { atomUserData } from '~/jotai/jotai'
import { db } from '~/lib/firebase'
import { AUTH_TOKEN, CORE_API_URL } from '../../constants'
import { Edges, NodeContent, Nodes, jotaiAllowInteraction, nodeContents } from './nodes/Registry'
import { v4 } from 'uuid'

import { DataExtractorNode } from './nodes/DataExtractorNode'
import { DataSourceNode } from './nodes/DataSourceNode'
import { EvaluatorNode } from './nodes/EvaluatorNode'
import { LLMProcessorNode } from './nodes/LLMProcessorNode'
import { DataIndexerNode } from './nodes/DataIndexer'
import { DataRetrieverNode } from './nodes/DataRetriever'
import { DataSourceLocalFilesNode } from './nodes/DataSourceLocalFiles'
import { DataExporterFlairNode } from './nodes/DataExporterFlair'
import { DataSourceS3Node } from './nodes/DataSourceS3'
import { DataSourceGCPNode } from './nodes/DataSourceGCP'
import { DataSourceAPINode } from './nodes/DataSourceAPI'
import { DataSourceEmailNode } from './nodes/DataSourceEmail'
import { DataSourceAzureNode } from './nodes/DataSourceAzure'
import { DataExporterS3Node } from './nodes/DataExporterS3'
import { DataExporterGCPNode } from './nodes/DataExporterGCP'
import { DataExporterAzureNode } from './nodes/DataExporterAzure'
import { DataExporterAPINode } from './nodes/DataExporterAPI'
import { DataExporterPowerBINode } from './nodes/DataExporterPowerBI'
import { DataExporterSalesforceNode } from './nodes/DataExporterSalesforce'
import { DataExporterZendeskNode } from './nodes/DataExporterZendesk'
import { DataExporterPostgresNode } from './nodes/DataExporterPostgres'
import { DataExporterGmailNode } from './nodes/DataExporterGmail'
import { DataRetrieverApiNode } from './nodes/DataRetrieverAPI'
import { ConditionalLogicNode } from './nodes/ConditionalLogicNode'
import { DataExtractorAggregatorNode } from './nodes/DataExtractorAggregatorNode'
import ExecuteModal from './overlays/ExecuteModal'
import JSONImporterModal from './overlays/JSONImporterModal'
import JSONConfigModal from './overlays/JSONConfigModal'
import DeploymentToast from './overlays/DeploymentToast'
import Controller from './editor/Controller'

export const nodeTypes = {
  DataSourceNode,
  DataSourceS3Node,
  DataSourceGCPNode,
  DataSourceAPINode,
  DataSourceAzureNode,
  DataSourceEmailNode,
  DataExtractorNode,
  DataExporterS3Node,
  DataExporterGCPNode,
  DataExporterAzureNode,
  DataExporterAPINode,
  DataExporterPowerBINode,
  DataExporterPostgresNode,
  EvaluatorNode,
  LLMProcessorNode,
  DataIndexerNode,
  DataRetrieverNode,
  DataSourceLocalFilesNode,
  DataExporterFlairNode,
  DataExporterSalesforceNode,
  DataExporterZendeskNode,
  DataExporterGmailNode,
  DataRetrieverApiNode,
  ConditionalLogicNode,
  DataExtractorAggregatorNode,
}
import { LuLayoutTemplate, LuSaveAll } from 'react-icons/lu'
import { RiListSettingsLine, RiRobotLine } from 'react-icons/ri'
import {
  AiFillApi,
  AiOutlineClear,
  AiOutlineDeploymentUnit,
  AiOutlineEdit,
  AiOutlineNodeIndex,
} from 'react-icons/ai'
import Menu from './editor/Menu'
import { PiCaretDoubleLeft, PiCaretDoubleRight } from 'react-icons/pi'
import EditTitleModal from './overlays/EditTitleModal'
import {
  BiGitBranch,
  BiLogoAws,
  BiLogoGmail,
  BiLogoGoogle,
  BiLogoMicrosoft,
  BiLogoPostgresql,
  BiLogoSlack,
} from 'react-icons/bi'
import { FaCloudUploadAlt, FaSalesforce } from 'react-icons/fa'
import { SiPowerbi, SiZendesk } from 'react-icons/si'
import { GiConvergenceTarget } from 'react-icons/gi'
import { GrAggregate, GrFormClose } from 'react-icons/gr'
import { BsArrowsAngleContract, BsFillCloudHaze2Fill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

const randPos = (viewport: { x: number; y: number; zoom: number }) => {
  console.log(viewport)
  const minValue = 20
  const maxValue = 40

  const randomX = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
  const randomY = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue

  return {
    x: -viewport.x * (1 / viewport.zoom) + randomX + 460 * (1 / viewport.zoom),
    y: -viewport.y * (1 / viewport.zoom) + randomY,
  }
}

export const nodesAtom = atom<Nodes>([])
export const edgesAtom = atom<Edges>([])

export const FlowEditor: React.FC<{
  viewerOnly?: boolean
  initialNodes?: Nodes
  initialEdges?: Edges
  initialTitle?: string
}> = ({ viewerOnly }) => {
  const userData = useAtomValue(atomUserData)

  const [nodes, setNodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesAtom)
  const [title, setTitle] = useState<string>('')

  const navigate = useNavigate()
  const { state } = useLocation()
  const { workflowId } = state || {} // Read values passed on state

  // Load initial
  useEffect(() => {
    ;(async () => {
      if (typeof workflowId !== 'string') {
        return
      }

      const snap = await db.collection('workflows').doc(workflowId).get()
      const data = snap.data() as DocWorkflow
      setTitle(data.workflowTitle)

      const { nodes: newNodes, edges: newEdges } = JSON.parse(data.frontendConfig)
      setNodes(newNodes)
      setEdges(newEdges)
    })()
  }, [workflowId, setEdges, setNodes])

  // const [rflow, setRflow] = useState<ReactFlowInstance>()

  // const onInit = useCallback((reactflowInstance: ReactFlowInstance) => {
  //   console.log('rflow', rflow, reactflowInstance)
  //   setRflow(reactflowInstance);
  //   console.log('rflow', rflow)
  // }, [rflow])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(nds => applyNodeChanges(changes, nds))
    },
    [setNodes],
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      console.log(changes)
      setEdges(eds => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  )

  // const connectablesMap: Record<string, string[]> = {
  //   // TODO: Add "NodeType:handle"
  //   'SourceNode:out': [
  //     'DataExtractionNode:in',
  //   ],
  //   'DataExtractionNode:out': [
  //     'MergerNode:in-data',
  //     'MergerNode:in-context',
  //     'MergerNode:in-input',

  //     'PublishAPINode:in',
  //     'AWSUploaderNode:in',
  //   ],
  //   'MergerNode:out': [
  //     'PublishAPINode:in',
  //     'WebhookNode:in',
  //     'AWSUploaderNode:in',
  //   ],
  // }

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('connection', connection)
      const sourceNode = nodes.find(n => n.id === connection.source)
      const targetNode = nodes.find(n => n.id === connection.target)
      const lookupSourceKey = `${sourceNode?.type ?? ''}:${connection.sourceHandle ?? ''}`
      const lookupTargetKey = `${targetNode?.type ?? ''}:${connection.targetHandle ?? ''}`
      console.log(lookupSourceKey, lookupTargetKey)

      // TODO: restrict connections based on node type
      // if (lookupSourceKey in connectablesMap && connectablesMap[lookupSourceKey].includes(lookupTargetKey)) {
      //   setEdges((eds) => addEdge(connection, eds))
      // }

      // But for now, allow all connections
      setEdges(eds => addEdge(connection, eds))
    },
    [nodes, setEdges],
  )

  // useref of { x, y}
  const viewport = useRef({ x: 0, y: 0, zoom: 1 })

  const [isJsonModalShown, setIsJsonModalShown] = useState(false)
  const [jsonConfig, setJsonConfig] = useState('')

  const [isJsonImportModalShown, setIsJsonImportModalShown] = useState(false)
  const [jsonConfigImport, setJsonConfigImport] = useState('')

  const getFrontendConfig = () => {
    const obj = { nodes, edges }

    nodes.forEach(el => {
      el.data.initialContents = nodeContents.current[el.id]
    })

    return obj
  }

  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<['success' | 'error', string]>()

  const saveFlow = async (withToast = false) => {
    try {
      if (typeof workflowId !== 'string') {
        return
      }

      const obj = getFrontendConfig()

      const docUpdate: Partial<DocWorkflow> = {
        lastSaveTimestamp: serverTimestamp() as Timestamp,
        frontendConfig: JSON.stringify(obj),
      }
      await db.collection('workflows').doc(workflowId).update(docUpdate)

      if (withToast) {
        setDeploymentStatus(['success', 'Saved successfully'])
      }
      return obj
    } catch (error) {
      console.log(error)
      if (withToast) {
        setDeploymentStatus(['error', 'Failed to save'])
      }
    } finally {
      setTimeout(() => {
        setDeploymentStatus(undefined)
      }, 3000)
    }
  }

  async function executeFlow() {
    if (!userData?.userId) {
      return
    }

    if (typeof workflowId !== 'string') {
      return
    }
    try {
      setIsDeploying(true)
      const flowData = await saveFlow()
      const ref = db.collection('workflow_requests').doc()
      const newWorkflowRequest: DocWorkflowRequest = {
        createdTimestamp: serverTimestamp() as Timestamp,
        requestTimestamp: serverTimestamp() as Timestamp,
        updatedTimestamp: serverTimestamp() as Timestamp,
        executorUserId: userData.userId,
        docExists: true,
        workflowId,
        frontendConfig: JSON.stringify(flowData),
        workflowRequestId: ref.id,
        generatedConfig: '',
        status: 'requested',
      }
      await ref.set(newWorkflowRequest)
      console.log('workflow_request_id = ' + ref.id)

      // const URL = `${CORE_API_URL}/api/flair-studio/flair-chain-runner`
      // await axios.post(
      //   URL,
      //   { workflow_request_id: ref.id },
      //   { headers: { Authorization: AUTH_TOKEN } },
      // )

      {
        async function uploadConfig() {
          const formData = new FormData()

          const yamlContent = `name: 'My LLM workflow'
description: 'Workflow that extracts information from customer support calls.'
tags: ['audio-pipelines']
frequency: '1d'
customer_id: 'IVqAyQJR4ugRGR8qL9UuB809OX82'

workflow:
  data_source_1: [llm_processor_1]
  llm_processor_1: [llm_processor_2, data_exporter_1, data_exporter_2]
  llm_processor_2: [data_exporter_1, data_exporter_2]


data_sources:
  # - name: data_source_1
  #   type: missive # s3, azure, google, missive
  #   data_type: json # mp3, wav, csv, txt, pdf
  #   keys: [text]
  #   missive_api_key: 7bc9e948-3e69-4c91-a830-660a4e1c39b7
  - name: data_source_1
    type: s3 # s3, azure, google, missive
    uri: tusol/b2b_emails
    data_type: txt # mp3, wav, csv, txt, pdf
    keys: [text]

llm_processors:
  - name: llm_processor_1
    type: column
    keys: [text]
    columns:
      - name: generated_email
        type: text # text, category, number, list, regex
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to b2b outreach emails. Use the following email response templates to generate a response.
          -
          Sample request template:
          Hi,

          Please find attached additional product and integration information and let me know what might be a fit at your property.
          Generally, our Organic Protein Bars do well at spas, grab-and-go outlets, minibars and cafes, and the Smoothies are a great option for cafes and banquets.
          I'm looking forward to hearing your thoughts and sharing our collection with you!

          Thanks,
          Ilana
          -
          Inbound inquiry template:
          Hi,

          Thanks so much for your note, we'd love to discuss wholesale partnerships with you!
          We currently work with similar resorts - Four Seasons, Meadowood, Montage, Auberge - in a similar capacity and would love to work with you at Cliff House as well.
          Please find additional details attached and let me know what you have in mind for an initial order.
          Looking forward to our partnership!

          Warmly,
          Ilana
        prompt: Given an input email chain, generate a personalized response from Ilana using the templates in the instruction. Make sure to include the customer's name in the response.
      - name: intent
        type: category
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to customer support emails. Answer the following questions about the email.
        prompt: Given the email, what is the intent of the original email from the options? If the intent is not listed, return OTHER.
        options: ['Sample request', 'Request more information', 'Follow up after product sample', 'OTHER']

  - name: llm_processor_2
    type: column
    keys: [generated_email]
    columns:
      - name: generated_subject
        type: text # text, category, number, list, regex
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to customer service outreach emails.
        prompt: Return only the subject of the given email. If there is no subject, return 'Subject'.


data_exporters:
  - name: data_exporter_1
    type: email
    data_type: csv
    from_email: no-reply@flairlabs.ai
    to_emails: [trtets@gmail.com]
    email_password: flairlabs1234!
    content_key: generated_email
    subject_key: generated_subject
  - name: data_exporter_2
    type: google # azure, s3, google, email
    data_type: csv
    uri: llm_outputs

evaluators:
  - name: evaluator_1
    type: default
    `

          const blob = new Blob([yamlContent], { type: 'application/x-yaml' })
          formData.append('user_config_yaml', blob, 'b2b.yaml')

          try {
            const response = await axios.post(
              'https://flair-api.flairlabs.ai/api/v1/upload-user-config-yaml',
              formData,
              {
                headers: {
                  accept: 'application/json',
                  // Content-Type will be set automatically by the browser when using FormData
                },
              },
            )

            console.log('response', response)
            console.log('response.data', response.data)
          } catch (error) {
            console.error('Error uploading the config:', error)
          }
        }

        uploadConfig()
      }
      setDeploymentStatus(['success', 'Your workflow has been deployed!'])
    } catch (error) {
      console.log(error)
      setDeploymentStatus(['error', 'Sorry, something went wrong.'])
    } finally {
      setIsDeploying(false)
      setTimeout(() => {
        setDeploymentStatus(undefined)
      }, 3000)
    }
  }

  const addNode = (
    nodeTypeDash: NodeContent['nodeType'],
    nodeTypePascal: keyof typeof nodeTypes,
  ) => {
    setNodes(prev => {
      const nodeId = nodeTypeDash + '-' + v4()

      return [
        ...prev,
        {
          id: nodeId,
          type: nodeTypePascal,
          data: { nodeId, initialContents: { nodeType: 'init' } },
          position: randPos(viewport.current),
        },
      ]
    })
  }

  const executeModalRef: LegacyRef<HTMLDialogElement> = useRef(null)

  const allowInteraction = useAtomValue(jotaiAllowInteraction)

  const nodeClassifications = [
    {
      title: 'Data Source',
      subtitle: 'Origin of raw datasets.',
      color: 'purple',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            addNode('data-source-s3', 'DataSourceS3Node')
          },
          icon: BiLogoAws,
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-source-gcp', 'DataSourceGCPNode')
          },
          icon: BiLogoGoogle,
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-source-azure', 'DataSourceAzureNode')
          },
          icon: BiLogoMicrosoft,
        },
        {
          title: 'Local Files',
          handleOnClick: () => {
            addNode('data-source-local-files', 'DataSourceLocalFilesNode')
          },
          icon: FaCloudUploadAlt,
        },
        {
          title: 'API',
          handleOnClick: () => {
            addNode('data-source-api', 'DataSourceAPINode')
          },
          icon: AiFillApi,
        },
        {
          title: 'Email',
          handleOnClick: () => {
            addNode('data-source-email', 'DataSourceEmailNode')
          },
          icon: MdEmail,
        },
        {
          title: 'Salesforce',
          handleOnClick: () => {},
          disabled: true,
          icon: FaSalesforce,
        },
        {
          title: 'Zendesk',
          handleOnClick: () => {},
          disabled: true,
          icon: SiZendesk,
        },
        {
          title: 'Slack',
          handleOnClick: () => {},
          disabled: true,
          icon: BiLogoSlack,
        },
      ],
    },
    {
      title: 'Data Indexer',
      subtitle: 'Organizes and categorizes data for quick retrieval.',
      color: 'green',
      members: [
        {
          title: 'Data Indexer',
          handleOnClick: () => {
            addNode('data-indexer', 'DataIndexerNode')
          },
          icon: AiOutlineNodeIndex,
        },
      ],
    },
    {
      title: 'Data Retriever',
      subtitle: 'Fetches specific data subsets from the source or index.',
      color: 'orange',
      members: [
        {
          title: 'Data Retriever',
          handleOnClick: () => {
            addNode('data-retriever', 'DataRetrieverNode')
          },
          icon: GiConvergenceTarget,
        },
        {
          title: 'Data Retriever API',
          handleOnClick: () => {
            addNode('data-retriever-api', 'DataRetrieverApiNode')
          },
          icon: AiFillApi,
        },
      ],
    },
    {
      title: 'Data Extractor',
      subtitle: 'Extracts or transforms specific data elements.',
      color: 'blue',
      members: [
        {
          title: 'LLM Processor',
          handleOnClick: () => {
            addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: RiRobotLine,
        },
        {
          title: 'Aggregator',
          handleOnClick: () => {
            addNode('data-extractor-aggregator', 'DataExtractorAggregatorNode')
          },
          icon: GrAggregate,
        },
      ],
    },
    {
      title: 'Data Exporter',
      subtitle: 'Sends processed data to specified destinations.',
      color: 'teal',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            addNode('data-exporter-s3', 'DataExporterS3Node')
          },
          icon: BiLogoAws,
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-exporter-gcp', 'DataExporterGCPNode')
          },
          icon: BiLogoGoogle,
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-exporter-azure', 'DataExporterAzureNode')
          },
          icon: BiLogoMicrosoft,
        },
        {
          title: 'Zendesk',
          handleOnClick: () => {
            addNode('data-exporter-zendesk', 'DataExporterZendeskNode')
          },
          icon: SiZendesk,
        },
        {
          title: 'Gmail',
          handleOnClick: () => {
            addNode('data-exporter-gmail', 'DataExporterGmailNode')
          },
          icon: BiLogoGmail,
        },
        {
          title: 'Salesforce',
          handleOnClick: () => {
            addNode('data-exporter-salesforce', 'DataExporterSalesforceNode')
          },
          icon: FaSalesforce,
        },
        {
          title: 'Power BI',
          handleOnClick: () => {
            addNode('data-exporter-power-bi', 'DataExporterPowerBINode')
          },
          icon: SiPowerbi,
        },
        {
          title: 'Postgres',
          handleOnClick: () => {
            addNode('data-exporter-postgres', 'DataExporterPostgresNode')
          },
          icon: BiLogoPostgresql,
        },
        {
          title: 'Flair',
          handleOnClick: () => {
            addNode('data-exporter-flair', 'DataExporterFlairNode')
          },
          icon: BsFillCloudHaze2Fill,
        },
        {
          title: 'API',
          handleOnClick: () => {
            addNode('data-exporter-api', 'DataExporterAPINode')
          },
          icon: AiFillApi,
        },
      ],
    },
    {
      title: 'Router',
      subtitle: 'Control flow and logical branching.',
      color: 'rose',
      members: [
        {
          title: 'Conditional Logic',
          handleOnClick: () => {
            addNode('conditional-logic', 'ConditionalLogicNode')
          },
          icon: BiGitBranch,
        },
      ],
    },
    {
      title: 'Evaluation',
      subtitle: 'Assesses data quality and accuracy.',
      color: 'pink',
      members: [
        {
          title: 'Evaluator',
          handleOnClick: () => {
            addNode('evaluator', 'EvaluatorNode')
          },
          icon: BsArrowsAngleContract,
        },
      ],
    },
  ]

  const controls = [
    {
      title: 'Sample',
      Icon: LuLayoutTemplate,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        const { nodes: newNodes, edges: newEdges } = JSON.parse(FLOW_SAMPLE_2)
        setNodes(newNodes)
        setEdges(newEdges)
      },
    },
    {
      title: 'Config',
      Icon: RiListSettingsLine,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        setJsonConfig(JSON.stringify(getFrontendConfig(), null, 2))
        setIsJsonModalShown(true)
      },
    },
    {
      title: 'Clear',
      Icon: AiOutlineClear,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        setNodes([])
        setEdges([])
      },
    },
    {
      title: 'Save',
      Icon: LuSaveAll,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        saveFlow(true)
      },
    },
    {
      title: 'Deploy',
      Icon: AiOutlineDeploymentUnit,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        executeModalRef.current?.showModal()
      },
    },
  ]

  const editTitleModal = useRef<HTMLDialogElement>()
  const saveTitle = async (newTitle: string) => {
    try {
      if (typeof workflowId !== 'string') {
        return
      }
      setIsDeploying(true)

      const docUpdate: Partial<DocWorkflow> = {
        lastSaveTimestamp: serverTimestamp() as Timestamp,
        workflowTitle: newTitle,
      }
      await db.collection('workflows').doc(workflowId).update(docUpdate)
      setDeploymentStatus(['success', 'New name saved successfully'])
      setTitle(newTitle)
    } catch (error) {
      console.log(error)
      setDeploymentStatus(['error', 'Failed to save new name'])
    } finally {
      setIsDeploying(false)
      setTimeout(() => {
        setDeploymentStatus(undefined)
      }, 3000)
    }
  }

  const [expanded, setExpanded] = useState(true)

  return viewerOnly ? (
    <ReactFlow
      elementsSelectable={allowInteraction}
      nodesConnectable={allowInteraction}
      nodesDraggable={allowInteraction}
      zoomOnScroll={allowInteraction}
      panOnScroll={allowInteraction}
      zoomOnDoubleClick={allowInteraction}
      panOnDrag={allowInteraction}
      selectionOnDrag={allowInteraction}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      selectionMode={SelectionMode.Partial}
      onMove={(_, newViewport) => {
        viewport.current = newViewport
      }}>
      <Background />
      <Controls position="bottom-right" />
    </ReactFlow>
  ) : (
    <>
      <main className="h-[calc(100vh-4rem)]">
        <section className="relative h-[calc(100vh-4rem)] w-full">
          <aside
            className={`absolute -left-1 top-0 z-10 flex h-full w-96 ${
              expanded ? 'translate-x-0' : '-translate-x-full'
            } transform-gpu flex-col space-y-3 py-3 pl-4 transition-transform`}>
            <div className="join relative w-full bg-white shadow outline outline-1">
              <span className="join-item flex grow items-center">
                <h5 className="pl-3 text-xl font-semibold">{title}</h5>
              </span>
              <button
                className="btn btn-outline join-item border-y-0 border-r-0"
                onClick={() => {
                  editTitleModal.current?.showModal()
                }}>
                <AiOutlineEdit className="h-6 w-6" />
              </button>
              <button
                className="btn btn-circle btn-outline btn-sm absolute -right-12 top-2 bg-white"
                onClick={() => {
                  setExpanded(!expanded)
                }}>
                {expanded ? (
                  <PiCaretDoubleLeft className="h-4 w-4" />
                ) : (
                  <PiCaretDoubleRight className="h-4 w-4" />
                )}
              </button>
            </div>
            <Menu nodeClassifications={nodeClassifications} />
          </aside>
          <Controller controls={controls} />
          <ReactFlow
            elementsSelectable={allowInteraction}
            nodesConnectable={allowInteraction}
            nodesDraggable={allowInteraction}
            zoomOnScroll={allowInteraction}
            panOnScroll={allowInteraction}
            zoomOnDoubleClick={allowInteraction}
            panOnDrag={allowInteraction}
            selectionOnDrag={allowInteraction}
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            selectionMode={SelectionMode.Partial}
            onMove={(_, newViewport) => {
              viewport.current = newViewport
            }}>
            <Background />
            <Controls position="bottom-right" />
          </ReactFlow>
        </section>
      </main>

      <ExecuteModal executeFlow={executeFlow} isDeploying={isDeploying} ref={executeModalRef} />
      <EditTitleModal
        key={title}
        isDeploying={isDeploying}
        title={title}
        saveTitle={saveTitle}
        ref={editTitleModal}
      />
      <JSONImporterModal
        isJsonImportModalShown={isJsonImportModalShown}
        setIsJsonImportModalShown={setIsJsonImportModalShown}
        jsonConfigImport={jsonConfigImport}
        setJsonConfigImport={setJsonConfigImport}
      />
      <JSONConfigModal
        isJsonModalShown={isJsonModalShown}
        setIsJsonModalShown={setIsJsonModalShown}
        jsonConfig={jsonConfig}
      />
      <DeploymentToast deploymentStatus={deploymentStatus} />
    </>
  )
}

const sample1 = `
{
  "nodes": [
    {
      "id": "input-001",
      "type": "InputNode",
      "data": {
        "nodeId": "input-001",
        "initialContents": {
          "keyValPairs": {
            "x": "hello",
            "y": "world"
          }
        }
      },
      "position": {
        "x": 0,
        "y": 200
      },
      "width": 400,
      "height": 196
    },
    {
      "id": "prompt-template-002",
      "type": "PromptTemplateNode",
      "data": {
        "nodeId": "prompt-template-002",
        "initialContents": {
          "promptTemplate": "Check {x} in {y}"
        }
      },
      "position": {
        "x": 500,
        "y": 200
      },
      "width": 400,
      "height": 280
    },
    {
      "id": "model-003",
      "type": "ModelNode",
      "data": {
        "nodeId": "model-003",
        "initialContents": {
          "model": "gpt-4",
          "temperature": "1"
        }
      },
      "position": {
        "x": 1000,
        "y": 200
      },
      "width": 400,
      "height": 222
    },
    {
      "id": "output-004",
      "type": "OutputNode",
      "data": {
        "nodeId": "output-004",
        "initialContents": {}
      },
      "position": {
        "x": 1500,
        "y": 200
      },
      "width": 400,
      "height": 74
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "input-001",
      "target": "prompt-template-002",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    },
    {
      "id": "edge-2",
      "source": "prompt-template-002",
      "target": "model-003",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    },
    {
      "id": "edge-3",
      "source": "model-003",
      "target": "output-004",
      "sourceHandle": "outbound",
      "targetHandle": "inbound"
    }
  ]
}
`

export default FlowEditor
