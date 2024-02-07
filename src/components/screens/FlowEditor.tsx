import axios from 'axios'
import React, { LegacyRef, useCallback, useEffect, useRef, useState } from 'react'
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
  BackgroundVariant,
} from 'reactflow'

import 'reactflow/dist/style.css'
import { DocWorkflow, DocWorkflowRequest } from 'Types/firebaseStructure'
import { Timestamp, serverTimestamp } from 'firebase/firestore'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Link, useParams } from 'react-router-dom'
import { FLOW_SAMPLE_2 } from '~/constants/flowSamples'
import { atomUserData } from '~/jotai/jotai'
import { db, functions } from '~/lib/firebase'
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
import { DataExporterTwilioNode } from './nodes/DataExporterTwilio'
import { DataExporterGmailNode } from './nodes/DataExporterGmail'
import { DataRetrieverApiNode } from './nodes/DataRetrieverAPI'
import { ConditionalLogicNode } from './nodes/ConditionalLogicNode'
import { DataExtractorAggregatorNode } from './nodes/DataExtractorAggregatorNode'
import { DeployModal, RunModal } from './overlays/ExecuteModal'
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
  DataExporterTwilioNode,
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

  // Hops
  DataSourceS3Hop,
  DataSourceAPIHop,
  DataSourceFilesHop,
  DataSourcePostgresHop,
  DataSourceGCSHop,
  DataSourceAzureHop,
  DataSourceGmailHop,
  DataSourceMongoHop,
  LLMProcessorHop,
  DataDestinationGmailHop,
  DataDestinationPostgresHop,
  DataDestinationTwilioHop,
  DataDestinationSheetsHop,
  DataDestinationS3Hop,
  DataDestinationGCSHop,
  DataDestinationAzureHop,
  DataDestinationAPIHop,
  DataDestinationZendeskHop,
  DataDestinationSalesforceHop,
  ConditionalHop,
  AggregatorHop,
  DataIndexerHop,
  DataSourceURLScraperHop,
}

import { LuLayoutTemplate, LuSaveAll } from 'react-icons/lu'
import { RiListSettingsLine, RiRobotLine, RiArrowRightLine, RiFileUploadLine } from 'react-icons/ri'
import {
  AiFillApi,
  AiOutlineClear,
  AiOutlineDeploymentUnit,
  AiOutlineEdit,
  AiOutlineRocket,
  AiFillMinusSquare,
  AiOutlineNodeIndex,
} from 'react-icons/ai'
import Menu, { IAsideProps } from './editor/Menu'
import { PiCaretDoubleLeft, PiCaretDoubleRight, PiMicrosoftOutlookLogoFill } from 'react-icons/pi'
import EditTitleModal from './overlays/EditTitleModal'
import {
  BiCalendar,
  BiGitBranch,
  BiLogoAws,
  BiLogoGmail,
  BiLogoGoogle,
  BiLogoMicrosoft,
  BiLogoMongodb,
  BiLogoPostgresql,
  BiLogoSlack,
} from 'react-icons/bi'
import { FaCloudUploadAlt, FaSalesforce, FaSearch } from 'react-icons/fa'
import { SiPowerbi, SiZendesk, SiAirtable, SiGooglesheets, SiTwilio } from 'react-icons/si'
import { GiConvergenceTarget } from 'react-icons/gi'
import { GrAggregate, GrFormClose, GrCube } from 'react-icons/gr'
import {
  BsArrowsAngleContract,
  BsFillCloudHaze2Fill,
  BsLightning,
  BsPeople,
  BsThunderbolt,
} from 'react-icons/bs'
import { MdEmail, MdThunderstorm } from 'react-icons/md'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import { DataSourceS3Hop, DataSourceS3HopContent } from './nodes/vertical/DataSourceS3Hop'
import { LLMProcessorHop } from './nodes/vertical/LLMProcessorHop'
import { DataDestinationGmailHop } from './nodes/vertical/DataDestinationGmailHop'
import { USER_ID_MODE } from '~/config'
import { DataDestinationPostgresHop } from './nodes/vertical/DataDestinationPostgresHop'
import { DataDestinationTwilioHop } from './nodes/vertical/DataDestinationTwilioHop'
import { ConditionalHop } from './nodes/vertical/ConditionalHop'
import { DataSourceAPIHop } from './nodes/vertical/DataSourceAPIHop'
import { DataSourceFilesHop } from './nodes/vertical/DataSourceFilesHop'
import { DataSourcePostgresHop } from './nodes/vertical/DataSourcePostgresHop'
import { DataDestinationSheetsHop } from './nodes/vertical/DataDestinationSheetsHop'
import { DataSourceGCSHop } from './nodes/vertical/DataSourceGCSHop'
import { DataSourceAzureHop } from './nodes/vertical/DataSourceAzureHop'
import { DataSourceGmailHop } from './nodes/vertical/DataSourceGmailHop'
import { DataSourceMongoHop } from './nodes/vertical/DataSourceMongoDBHop'
import { AggregatorHop } from './nodes/vertical/AggregatorHop'
import { DataIndexerHop } from './nodes/vertical/DataIndexerHop'
import { DataDestinationS3Hop } from './nodes/vertical/DataDestinationS3Hop'
import { DataDestinationGCSHop } from './nodes/vertical/DataDestinationGCSHop'
import { DataDestinationAzureHop } from './nodes/vertical/DataDestinationAzureHop'
import { DataDestinationAPIHop } from './nodes/vertical/DataDestinationAPIHop'
import { DataDestinationZendeskHop } from './nodes/vertical/DataDestinationZendeskHop'
import { DataDestinationSalesforceHop } from './nodes/vertical/DataDestinationSalesforceHop'
import { dummyRunners } from './nodes/utils/useRightIconMode'
import { DataSourceURLScraperHop } from './nodes/vertical/DataSourceURLScraperHop'
import { FaBoltLightning } from 'react-icons/fa6'
import { httpsCallable } from 'firebase/functions'

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

function findPositionExtremes(elements: Nodes) {
  let minY = Infinity,
    maxY = -Infinity // For top-most and bottom-most Y
  let minX = Infinity,
    maxX = -Infinity // For left-most and right-most X

  elements.forEach(element => {
    const { x, y } = element.position // Destructure to get x and y values

    // Update minY and maxY for Y positions
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)

    // Update minX and maxX for X positions
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
  })

  // Return the extremes
  return { topMostY: minY, bottomMostY: maxY, leftMostX: minX, rightMostX: maxX }
}

export const borderPosAtom = atom<ReturnType<typeof findPositionExtremes> | undefined>(undefined)

export const nodesAtom = atom<Nodes>([])
export const edgesAtom = atom<Edges>([])

export const apiResultAtom = atom<string>('')

export const dummyRunSymbol = atom<number | undefined>(undefined)

export const FlowEditor: React.FC<{ viewOnly?: boolean }> = ({ viewOnly }) => {
  const userData = useAtomValue(atomUserData)
  const [nodes, setNodes] = useAtom(nodesAtom)
  const [edges, setEdges] = useAtom(edgesAtom)
  const [title, setTitle] = useState<string>('')

  const setApiResult = useSetAtom(apiResultAtom)

  const { workflowId, workflowRequestId } = useParams()

  const setBorderPosAtom = useSetAtom(borderPosAtom)
  useEffect(() => {
    setBorderPosAtom(findPositionExtremes(nodes))
  }, [nodes, setBorderPosAtom])

  // Load initial
  useEffect(() => {
    setNodes([])
    setEdges([])
    ;(async () => {
      if (typeof workflowId !== 'string') {
        return
      }

      if (workflowRequestId) {
        const snap = await db.collection('workflow_requests').doc(workflowRequestId).get()
        const data = snap.data() as DocWorkflowRequest

        const { nodes: newNodes, edges: newEdges } = JSON.parse(data.frontendConfig)
        setTitle('View Snapshot')
        setNodes(newNodes)
        setEdges(newEdges)
      } else {
        const snap = await db.collection('workflows').doc(workflowId).get()
        const data = snap.data() as DocWorkflow
        setTitle(data.workflowTitle)

        const { nodes: newNodes, edges: newEdges } = JSON.parse(data.frontendConfig)
        setNodes(newNodes)
        setEdges(newEdges)
      }
    })()

    return () => {
      setNodes([])
      setEdges([])
    }
  }, [workflowId, workflowRequestId, setEdges, setNodes])

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

  // useref of { x, y }
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
  const runningModalRef: LegacyRef<HTMLDialogElement> = useRef(null)

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

  const executeFlow = async () => {
    if (!userData?.userId) {
      return
    }

    if (typeof workflowId !== 'string') {
      return
    }
    try {
      setIsDeploying(true)

      // Save Flow
      const flowData = await saveFlow()

      // Write workflow request
      const ref = db.collection('workflow_requests').doc()
      const newWorkflowRequest: DocWorkflowRequest = {
        createdTimestamp: serverTimestamp() as Timestamp,
        requestTimestamp: serverTimestamp() as Timestamp,
        updatedTimestamp: serverTimestamp() as Timestamp,
        executorUserId: USER_ID_MODE === 'samir' ? 'IVqAyQJR4ugRGR8qL9UuB809OX82' : userData.userId,
        docExists: true,
        workflowId,
        frontendConfig: JSON.stringify(flowData),
        workflowRequestId: ref.id,
        generatedConfig: '',
        status: 'requested',
      }
      await ref.set(newWorkflowRequest)
      console.log('workflow_request_id = ' + ref.id)

      // Call API
      {
        const headers = {
          // 'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          // Additional headers if necessary (e.g., Authentication tokens)
        }

        const params = new URLSearchParams()
        params.append('workflow_request_id', ref.id)

        // Make API call
        axios
          .post('https://flair-api.flairlabs.ai/api/v1/start-llm-executor', params, { headers })
          .then(response => {
            console.log('start-llm-executor response.data', response.data)
          })
          .catch(error => {
            console.error('Error during API call', error)
          })
      }

      // await axios.post(
      //   URL,
      //   { workflow_request_id: ref.id },
      //   { headers: { Authorization: AUTH_TOKEN } },
      // )

      {
        async function uploadConfig() {
          const formData = new FormData()

          const yamlContent = `name: 'My LLM Pipeline'
description: 'Pipeline that extracts information from customer support calls.'
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

      setDeploymentStatus(['success', 'Your pipeline has been deployed!'])
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

  const nodeClassifications: IAsideProps['nodeClassifications'] = [
    {
      title: 'Input',
      subtitle: 'Load unstructured data from a data source.',
      color: 'slate',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            // addNode('data-source-s3', 'DataSourceS3Node')
            addNode('data-source-s3-hop', 'DataSourceS3Hop')
          },
          icon: BiLogoAws,
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-source-gcs-hop', 'DataSourceGCSHop')
          },
          icon: BiLogoGoogle,
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-source-azure-hop', 'DataSourceAzureHop')
          },
          icon: BiLogoMicrosoft,
        },
        {
          title: 'Gmail',
          handleOnClick: () => {
            addNode('data-source-gmail-hop', 'DataSourceGmailHop')
          },
          icon: BiLogoGmail,
        },
        {
          title: 'URL Scraper',
          handleOnClick: () => {
            addNode('data-source-url-scraper-hop', 'DataSourceURLScraperHop')
          },
          icon: FaSearch,
        },
        {
          title: 'API',
          handleOnClick: () => {
            // addNode('data-source-api', 'DataSourceAPINode')
            addNode('data-source-api-hop', 'DataSourceAPIHop')
          },
          icon: AiFillApi,
        },
        {
          title: 'Slack',
          handleOnClick: () => {},
          icon: BiLogoSlack,
        },
        {
          title: 'File Upload',
          handleOnClick: () => {
            // addNode('data-source-local-files', 'DataSourceLocalFilesNode')
            addNode('data-source-files-hop', 'DataSourceFilesHop')
          },
          icon: FaCloudUploadAlt,
        },
        {
          title: 'PostgresDB',
          handleOnClick: () => {
            // addNode('data-exporter-postgres', 'DataExporterPostgresNode')
            addNode('data-source-postgres-hop', 'DataSourcePostgresHop')
          },
          icon: BiLogoPostgresql,
        },
        // {
        //   title: 'MongoDB',
        //   handleOnClick: () => {
        //     addNode('data-source-mongo-hop', 'DataSourceMongoHop')
        //   },
        //   icon: BiLogoMongodb,
        // },
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
      ],
    },
    {
      title: 'Knowledge Base',
      subtitle: 'Embed your data into your choice of vector data store for quick retrieval.',
      color: 'slate',
      members: [
        {
          title: 'Pinecone',
          handleOnClick: () => {
            addNode('data-indexer-hop', 'DataIndexerHop')
          },
          icon: '/images/data-sources/pinecone.svg',
        },
        {
          title: 'Chroma',
          handleOnClick: () => {
            // addNode('data-indexer-hop', 'DataIndexerHop')
          },
          icon: '/images/data-sources/chroma.svg',
        },
        // {
        //   title: 'Pinecone Indexer',
        //   handleOnClick: () => {
        //     addNode('data-indexer', 'DataIndexerNode')
        //   },
        //   icon: GrCube,
        // },
        // {
        //   title: 'Chroma Indexer',
        //   handleOnClick: () => {
        //     addNode('data-indexer', 'DataIndexerNode')
        //   },
        //   icon: GrAggregate,
        // },
      ],
    },
    {
      title: 'Integrations',
      subtitle: 'Integrate external systems',
      color: 'slate',
      members: [
        {
          title: 'Calendar',
          handleOnClick: () => {
            // addNode('data-indexer-hop', 'DataIndexerHop')
          },
          icon: BiCalendar,
        },
        {
          title: 'CRM',
          handleOnClick: () => {
            // addNode('data-indexer-hop', 'DataIndexerHop')
          },
          icon: BsPeople,
        },
        {
          title: 'API',
          handleOnClick: () => {
            // addNode('data-source-api-hop', 'DataSourceAPIHop')
          },
          icon: AiFillApi,
        },
        // {
        //   title: 'Conditional',
        //   handleOnClick: () => {
        //     // addNode('conditional-logic', 'ConditionalLogicNode')
        //     addNode('conditional-hop', 'ConditionalHop')
        //   },
        //   icon: BiGitBranch,
        // },
        // {
        //   title: 'Aggregator',
        //   handleOnClick: () => {
        //     addNode('aggregator-hop', 'AggregatorHop')
        //   },
        //   icon: GrAggregate,
        // },
        // {
        //   title: 'Knowledge Base',
        //   handleOnClick: () => {
        //     addNode('data-indexer-hop', 'DataIndexerHop')
        //   },
        //   icon: GrCube,
        // },
        // {
        //   title: 'Chroma Indexer',
        //   handleOnClick: () => {
        //     addNode('data-indexer', 'DataIndexerNode')
        //   },
        //   icon: GrAggregate,
        // },
      ],
    },
    {
      title: 'LLMs',
      subtitle: 'Transforms your data using your choice of LLM and prompts.',
      color: 'slate',
      members: [
        {
          title: 'Open AI',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
            addNode('llm-processor-hop', 'LLMProcessorHop')
          },
          icon: '/images/data-sources/open-ai.svg',
        },
        {
          title: 'Anthropic',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/anthropic.svg',
        },
        {
          title: 'Google',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/google.svg',
        },
        {
          title: 'Meta',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/meta.svg',
        },
        {
          title: 'Mistral',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/mistral-ai.svg',
        },
        {
          title: 'Mosaic',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/mosaic.svg',
        },
        {
          title: 'Replicate',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/replicate.svg',
        },
        {
          title: 'Hugging Face',
          handleOnClick: () => {
            // addNode('llm-processor', 'LLMProcessorNode')
          },
          icon: '/images/data-sources/hugging-face.svg',
        },
        // {
        //   title: 'Conditional',
        //   handleOnClick: () => {
        //     // addNode('conditional-logic', 'ConditionalLogicNode')
        //     addNode('conditional-hop', 'ConditionalHop')
        //   },
        //   icon: BiGitBranch,
        // },
        // {
        //   title: 'Aggregator',
        //   handleOnClick: () => {
        //     addNode('aggregator-hop', 'AggregatorHop')
        //   },
        //   icon: GrAggregate,
        // },
        // {
        //   title: 'Knowledge Base',
        //   handleOnClick: () => {
        //     addNode('data-indexer-hop', 'DataIndexerHop')
        //   },
        //   icon: GrCube,
        // },
        // {
        //   title: 'Chroma Indexer',
        //   handleOnClick: () => {
        //     addNode('data-indexer', 'DataIndexerNode')
        //   },
        //   icon: GrAggregate,
        // },
      ],
    },
    // {
    //   title: 'Data Retriever',
    //   subtitle: 'Fetches specific data subsets from the source or index.',
    //   color: 'orange',
    //   members: [
    //     {
    //       title: 'Data Retriever',
    //       handleOnClick: () => {
    //         addNode('data-retriever', 'DataRetrieverNode')
    //       },
    //       icon: GiConvergenceTarget,
    //     },
    //     {
    //       title: 'Data Retriever API',
    //       handleOnClick: () => {
    //         addNode('data-retriever-api', 'DataRetrieverApiNode')
    //       },
    //       icon: AiFillApi,
    //     },
    //   ],
    // },
    {
      title: 'Control Flow',
      subtitle: 'Control flow and logical branching.',
      color: 'slate',
      members: [
        {
          title: 'Conditional',
          handleOnClick: () => {
            // addNode('conditional-logic', 'ConditionalLogicNode')
            addNode('conditional-hop', 'ConditionalHop')
          },
          icon: BiGitBranch,
        },
      ],
    },
    {
      title: 'Output',
      subtitle: 'Send processed data to a specified destination.',
      color: 'slate',
      members: [
        {
          title: 'AWS S3',
          handleOnClick: () => {
            addNode('data-destination-s3-hop', 'DataDestinationS3Hop')
          },
          icon: BiLogoAws,
        },
        {
          title: 'Google Cloud Storage',
          handleOnClick: () => {
            addNode('data-destination-gcs-hop', 'DataDestinationGCSHop')
          },
          icon: BiLogoGoogle,
        },
        {
          title: 'Azure Blob Storage',
          handleOnClick: () => {
            addNode('data-destination-azure-hop', 'DataDestinationAzureHop')
          },
          icon: BiLogoMicrosoft,
        },
        {
          title: 'Gmail',
          handleOnClick: () => {
            // addNode('data-exporter-gmail', 'DataExporterGmailNode')
            addNode('data-destination-gmail-hop', 'DataDestinationGmailHop')
          },
          icon: BiLogoGmail,
        },
        {
          title: 'Google Sheets',
          handleOnClick: () => {
            addNode('data-destination-sheets-hop', 'DataDestinationSheetsHop')
          },
          icon: SiGooglesheets,
        },
        {
          title: 'Twilio',
          handleOnClick: () => {
            // addNode('data-exporter-twilio', 'DataExporterTwilioNode')
            addNode('data-destination-twilio-hop', 'DataDestinationTwilioHop')
          },
          icon: SiTwilio,
        },
        {
          title: 'API',
          handleOnClick: () => {
            addNode('data-destination-api-hop', 'DataDestinationAPIHop')
          },
          icon: AiFillApi,
        },
        {
          title: 'Postgres',
          handleOnClick: () => {
            // addNode('data-exporter-postgres', 'DataExporterPostgresNode')
            addNode('data-destination-postgres-hop', 'DataDestinationPostgresHop')
          },
          icon: BiLogoPostgresql,
        },
        {
          title: 'Zendesk',
          handleOnClick: () => {
            addNode('data-destination-zendesk-hop', 'DataDestinationZendeskHop')
          },
          icon: SiZendesk,
        },
        {
          title: 'Salesforce',
          handleOnClick: () => {
            addNode('data-destination-salesforce-hop', 'DataDestinationSalesforceHop')
          },
          icon: FaSalesforce,
        },
        {
          title: 'Airtable',
          handleOnClick: () => {
            // addNode('data-exporter-gmail', 'DataExporterGmailNode')
          },
          icon: SiAirtable,
          disabled: true,
        },
        {
          title: 'Slack',
          handleOnClick: () => {},
          icon: BiLogoSlack,
        },
        // {
        //   title: 'Power BI',
        //   handleOnClick: () => {
        //     addNode('data-exporter-power-bi', 'DataExporterPowerBINode')
        //   },
        //   icon: SiPowerbi,
        // },
      ],
    },
    // {
    //   title: 'Events and Actions',
    //   subtitle: 'Event and action based nodes.',
    //   color: 'slate',
    //   members: [
    //     {
    //       title: 'Source: S3',
    //       handleOnClick: () => {
    //         addNode('data-source-s3-hop', 'DataSourceS3Hop')
    //       },
    //       icon: BiLogoAws,
    //     },
    //     {
    //       title: 'LLM Processor',
    //       handleOnClick: () => {
    //         addNode('llm-processor-hop', 'LLMProcessorHop')
    //       },
    //       icon: BsLightning,
    //     },
    //     {
    //       title: 'Conditional',
    //       handleOnClick: () => {
    //         addNode('conditional-hop', 'ConditionalHop')
    //       },
    //       icon: BiGitBranch,
    //     },
    //     {
    //       title: 'Destination: Gmail',
    //       handleOnClick: () => {
    //         addNode('data-destination-gmail-hop', 'DataDestinationGmailHop')
    //       },
    //       icon: BiLogoGmail,
    //     },
    //     {
    //       title: 'Destination: Postgres',
    //       handleOnClick: () => {
    //         addNode('data-destination-postgres-hop', 'DataDestinationPostgresHop')
    //       },
    //       icon: BiLogoPostgresql,
    //     },
    //     {
    //       title: 'Destination: Twilio',
    //       handleOnClick: () => {
    //         addNode('data-destination-twilio-hop', 'DataDestinationTwilioHop')
    //       },
    //       icon: SiTwilio,
    //     },
    //   ],
    // },
  ]

  const controls = [
    // {
    //   title: 'Sample',
    //   Icon: LuLayoutTemplate,
    //   handleOnClick: async (event: React.SyntheticEvent) => {
    //     event.preventDefault()
    //     const { nodes: newNodes, edges: newEdges } = JSON.parse(FLOW_SAMPLE_2)
    //     setNodes(newNodes)
    //     setEdges(newEdges)
    //   },
    // },
    // {
    //   title: 'Config',
    //   Icon: RiListSettingsLine,
    //   handleOnClick: async (event: React.SyntheticEvent) => {
    //     event.preventDefault()
    //     setJsonConfig(JSON.stringify(getFrontendConfig(), null, 2))
    //     setIsJsonModalShown(true)
    //   },
    // },
    // {
    //   title: 'Clear',
    //   Icon: AiOutlineClear,
    //   handleOnClick: async (event: React.SyntheticEvent) => {
    //     event.preventDefault()
    //     setNodes([])
    //     setEdges([])
    //   },
    // },
    {
      title: 'Save',
      Icon: LuSaveAll,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        saveFlow(true)
      },
    },
    {
      title: 'Share',
      Icon: RiFileUploadLine,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        setJsonConfig(JSON.stringify(getFrontendConfig(), null, 2))
        setIsJsonModalShown(true)
      },
    },
    {
      title: 'Run',
      Icon: RiArrowRightLine,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        // runningModalRef.current?.showModal()
        // await new Promise(resolve => setTimeout(resolve, 2000))
        // runningModalRef.current?.close()

        db.collection('workflow_results').add({
          docExists: true,
          averageEvaluationData: 0.86,
          workflowName: title,
          workflowRequestId: db.collection('workflow_results').doc().id,
          status: 'initiated',
          createdTimestamp: new Date(),
          model: 'gpt-4',
          executorUserId: 'IVqAyQJR4ugRGR8qL9UuB809OX82',
        })

        setApiResult('')

        function replacePlaceholders(template: string, values: Record<string, string>) {
          return template.replace(/{{(.*?)}}/g, (match, key) => values[key] || match)
        }

        let testPayload: Record<string, string> | undefined
        let prompt: string | undefined
        for (const [key, node] of Object.entries(nodeContents.current)) {
          if (node.nodeType === 'data-source-api-hop') {
            console.log('node.testPayload', node.testPayload)
            testPayload = JSON.parse(node.testPayload)
          }

          if (node.nodeType === 'llm-processor-hop') {
            for (const x of node.columns) {
              if (x.name === 'response') {
                prompt = x.prompt
              }
            }
          }
        }

        if (typeof testPayload !== 'object' || typeof prompt !== 'string') {
          throw new Error("can't get testPayload or prompt")
        }

        const content = replacePlaceholders(prompt, testPayload)

        const callHelloWorld = httpsCallable(functions, 'helloWorld')

        console.log({ content })
        callHelloWorld({ content })
          .then(result => {
            // Read result of the Cloud Function.
            setApiResult((result.data as any).choices[0].message.content)
            console.log('result.data', result.data)
          })
          .catch(e => {
            console.log('error', e)
          })

        setDeploymentStatus(['success', 'Your pipeline has been initiated!'])
        setTimeout(() => {
          setDeploymentStatus(undefined)
        }, 3000)

        console.log('dummyRunners.current size', dummyRunners.current.size)

        dummyRunners.current.forEach(dummyRunnerFunc => dummyRunnerFunc())
      },
    },
    {
      title: 'Deploy',
      Icon: AiOutlineRocket,
      handleOnClick: async (event: React.SyntheticEvent) => {
        event.preventDefault()
        executeModalRef.current?.showModal()

        db.collection('workflow_results').add({
          docExists: true,
          averageEvaluationData: 0.86,
          workflowName: title,
          workflowRequestId: db.collection('workflow_results').doc().id,
          status: 'scheduled',
          createdTimestamp: new Date(),
          model: 'gpt-4',
          executorUserId: 'IVqAyQJR4ugRGR8qL9UuB809OX82',
        })
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

  return viewOnly ? (
    <>
      <ReactFlow
        elementsSelectable={false}
        nodesConnectable={false}
        nodesDraggable={false}
        zoomOnScroll={true}
        panOnScroll={true}
        zoomOnDoubleClick={true}
        panOnDrag={true}
        selectionOnDrag={false}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        selectionMode={SelectionMode.Partial}
        onMove={(_, newViewport) => {
          viewport.current = newViewport
        }}
        style={{
          background: '#F0F0F0',
        }}>
        <Background />
        <Controls position="bottom-right" />
      </ReactFlow>
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end space-y-3">
        <div className="join w-fit bg-white shadow">
          <Link className="btn btn-outline join-item" to={'/editor/' + workflowId}>
            <AiOutlineEdit className="h-6 w-6" />
            Edit
          </Link>
        </div>
      </div>
    </>
  ) : (
    <>
      <main className="h-full">
        <section className="relative h-full w-full">
          <aside
            className={`absolute -left-1 top-0 z-10 flex h-full w-96 ${
              expanded ? 'translate-x-0' : '-translate-x-full'
            } transform-gpu flex-col space-y-3 py-3 pl-4 transition-transform`}>
            <div className="join relative w-full bg-white shadow outline outline-1">
              <span className="join-item flex grow items-center">
                <h5 className="pl-3 text-xl font-bold">{title}</h5>
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
            defaultViewport={{ x: 650, y: 500, zoom: 0.5 }} // set the default zoom and sizing of the graph
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            selectionMode={SelectionMode.Partial}
            onMove={(_, newViewport) => {
              viewport.current = newViewport
            }}
            style={{
              background: '#F0F0F0',
            }}>
            <Background />
            <Controls position="bottom-right" />
          </ReactFlow>
        </section>
      </main>

      <DeployModal
        isDeploying={isDeploying}
        dialogRef={executeModalRef}
        deployFlow={async () => {
          setIsDeploying(true)
          await new Promise(resolve => setTimeout(resolve, 2000))
          setIsDeploying(false)
          setDeploymentStatus(['success', 'Your pipeline has been deployed!'])
          setTimeout(() => {
            setDeploymentStatus(undefined)
          }, 3000)
        }}
      />

      <RunModal dialogRef={runningModalRef} />

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

export default FlowEditor
