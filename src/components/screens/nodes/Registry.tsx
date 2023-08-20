import { MutableRefObject } from 'react'
import { Edge, type Node } from 'reactflow'
import { DataExporterFlairNodeContent } from './DataExporterFlair'
import { DataExtractorNodeContent } from './DataExtractorNode'
import { DataIndexerNodeContent } from './DataIndexer'
import { DataRetrieverNodeContent } from './DataRetriever'
import { DataSourceLocalFilesNodeContent } from './DataSourceLocalFiles'
import { DataSourceNodeContent } from './DataSourceNode'
import { EvaluatorNodeContent } from './EvaluatorNode'
import { LLMProcessorNodeContent } from './LLMProcessorNode'
import { atom } from 'jotai'
import { DataSourceS3NodeContent } from './DataSourceS3'
import { DataSourceGCPNodeContent } from './DataSourceGCP'
import { DataSourceAzureNodeContent } from './DataSourceAzure'
import { DataSourceAPINodeContent } from './DataSourceAPI'
import { DataExporterS3NodeContent } from './DataExporterS3'
import { DataExporterGCPNodeContent } from './DataExporterGCP'
import { DataExporterAzureNodeContent } from './DataExporterAzure'
import { DataExporterAPINodeContent } from './DataExporterAPI'
import { AwsUploaderNodeContent } from './AwsUploaderNode'
import { DataExporterSalesforceNodeContent } from './DataExporterSalesforce'
import { DataExporterZendeskNodeContent } from './DataExporterZendesk'
import { DataExporterGmailNodeContent } from './DataExporterGmail'
import { DataRetrieverApiNodeContent } from './DataRetrieverAPI'
import { ConditionalLogicNodeContent } from './ConditionalLogicNode'

export type NodeContent =
  | { nodeType: 'init' }
  | AwsUploaderNodeContent
  | DataSourceNodeContent
  | DataSourceS3NodeContent
  | DataSourceGCPNodeContent
  | DataSourceAPINodeContent
  | DataSourceAzureNodeContent
  | DataExtractorNodeContent
  | DataExporterS3NodeContent
  | DataExporterGCPNodeContent
  | DataExporterAzureNodeContent
  | DataExporterAPINodeContent
  | EvaluatorNodeContent
  | ConditionalLogicNodeContent
  | LLMProcessorNodeContent
  | DataIndexerNodeContent
  | DataRetrieverNodeContent
  | DataSourceLocalFilesNodeContent
  | DataExporterFlairNodeContent
  | DataExporterSalesforceNodeContent
  | DataExporterZendeskNodeContent
  | DataExporterGmailNodeContent
  | DataRetrieverApiNodeContent

export interface NodeData {
  nodeId: string
  initialContents: NodeContent
}

export type Nodes = Array<Node<NodeData>>
export type Edges = Edge[]

export const nodeContents: MutableRefObject<{ [nodeId: string]: NodeContent }> = {
  current: {},
}

export const jotaiAllowInteraction = atom(true)
