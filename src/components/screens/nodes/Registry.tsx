import { MutableRefObject } from 'react'
import { AwsUploaderNode, AwsUploaderNodeContent } from './AwsUploaderNode'
import { DataExtractorNode, DataExtractorNodeContent } from './DataExtractorNode'
import { DataSourceNode, DataSourceNodeContent } from './DataSourceNode'
import { EvaluatorNode, EvaluatorNodeContent } from './EvaluatorNode'
import { LLMProcessorNode, LLMProcessorNodeContent } from './LLMProcessorNode'
import { Edge, type Node } from 'reactflow'

export const nodeTypes = {
  DataSourceNode,
  DataExtractorNode,
  AwsUploaderNode,
  EvaluatorNode,
  LLMProcessorNode,
}

export type NodeContent =
  | { nodeType: 'init' }
  | DataSourceNodeContent
  | DataExtractorNodeContent
  | AwsUploaderNodeContent
  | EvaluatorNodeContent
  | LLMProcessorNodeContent

export interface NodeData {
  nodeId: string
  initialContents: NodeContent
}

export type Nodes = Array<Node<NodeData>>
export type Edges = Edge[]

export const nodeContents: MutableRefObject<{ [nodeId: string]: NodeContent }> = {
  current: {},
}
