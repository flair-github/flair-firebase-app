import { MutableRefObject } from 'react'
import { atom } from 'jotai'
import { Edge, type Node } from 'reactflow'
import { DataExporterFlairNodeContent } from './DataExporterFlair'
import { DataExtractorNodeContent } from './DataExtractorNode'
import { DataIndexerNodeContent } from './DataIndexer'
import { DataRetrieverNodeContent } from './DataRetriever'
import { DataSourceLocalFilesNodeContent } from './DataSourceLocalFiles'
import { DataSourceNodeContent } from './DataSourceNode'
import { EvaluatorNodeContent } from './EvaluatorNode'
import { LLMProcessorNodeContent } from './LLMProcessorNode'
import { DataSourceS3NodeContent } from './DataSourceS3'
import { DataSourceGCPNodeContent } from './DataSourceGCP'
import { DataSourceAzureNodeContent } from './DataSourceAzure'
import { DataSourceAPINodeContent } from './DataSourceAPI'
import { DataSourceEmailNodeContent } from './DataSourceEmail'
import { DataExporterS3NodeContent } from './DataExporterS3'
import { DataExporterGCPNodeContent } from './DataExporterGCP'
import { DataExporterAzureNodeContent } from './DataExporterAzure'
import { DataExporterAPINodeContent } from './DataExporterAPI'
import { DataExporterPowerBINodeContent } from './DataExporterPowerBI'
import { AwsUploaderNodeContent } from './AwsUploaderNode'
import { DataExporterSalesforceNodeContent } from './DataExporterSalesforce'
import { DataExporterZendeskNodeContent } from './DataExporterZendesk'
import { DataExporterPostgresNodeContent } from './DataExporterPostgres'
import { DataExporterTwilioNodeContent } from './DataExporterTwilio'
import { DataExporterGmailNodeContent } from './DataExporterGmail'
import { DataRetrieverApiNodeContent } from './DataRetrieverAPI'
import { ConditionalLogicNodeContent } from './ConditionalLogicNode'
import { DataExtractorAggregatorNodeContent } from './DataExtractorAggregatorNode'
import { DataSourceS3HopContent } from './vertical/DataSourceS3Hop'
import { LLMProcessorHopContent } from './vertical/LLMProcessorHop'

export type NodeContent =
  | { nodeType: 'init' }
  | AwsUploaderNodeContent
  | DataSourceNodeContent
  | DataSourceS3NodeContent
  | DataSourceGCPNodeContent
  | DataSourceAPINodeContent
  | DataSourceAzureNodeContent
  | DataSourceEmailNodeContent
  | DataExtractorNodeContent
  | DataExporterS3NodeContent
  | DataExporterGCPNodeContent
  | DataExporterAzureNodeContent
  | DataExporterAPINodeContent
  | DataExporterPowerBINodeContent
  | DataExporterPostgresNodeContent
  | DataExporterTwilioNodeContent
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
  | DataExtractorAggregatorNodeContent

  // New Vertical Hops
  | DataSourceS3HopContent
  | LLMProcessorHopContent

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
