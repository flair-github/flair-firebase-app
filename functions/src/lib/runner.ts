import { moduleRegistry } from '../modules/moduleRegistry'

const config = {
  nodes: [
    {
      id: 'data-source-s3-hop-8c48f425-4d85-419d-957f-222b5be92da7',
      type: 'DataSourceS3Hop',
      data: {
        nodeId: 'data-source-s3-hop-8c48f425-4d85-419d-957f-222b5be92da7',
        initialContents: {
          nodeType: 'data-source-s3-hop',
          fileType: 'mp3',
          bucket: 'sacallcetnerprod-flair',
          path: '/SACallCetnerProd00D1U0000012qwz/2024/02/18',
          importedKeys: {},
        },
      },
      position: {
        x: 156.30944690680462,
        y: -689.1501301137375,
      },
      width: 400,
      height: 78,
      selected: false,
      positionAbsolute: {
        x: 156.30944690680462,
        y: -689.1501301137375,
      },
      dragging: false,
    },
    {
      id: 'llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1d',
      type: 'LLMProcessorHop',
      data: {
        nodeId: 'llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1d',
        initialContents: {
          nodeType: 'llm-processor-hop',
          columns: [
            {
              columnId: '9dc46b81-0e8d-47e5-a54b-03e0ff4447fc',
              type: 'text',
              promptStrategy: 'Chain-of-Thought',
              model: 'gpt-4-turbo-preview',
              name: 'call_reason',
              prompt:
                'You are a call center manager reviewing customer calls for quality purposes. Evaluate the following aspect based on the transcript provided. What was the primary reason the customer called support. (Answer in less than 3 words)',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: 'e49170e5-2f96-4732-a594-bd15c1cca16b',
              type: 'category',
              promptStrategy: 'Chain-of-Thought',
              model: 'gpt-4-0125-preview',
              name: 'customer_sentiment',
              prompt:
                "You are a call center manager reviewing customer calls for quality purposes. Evaluate the following aspect based on the transcript provided. Examine the sentiment throughout the conversation - how did the sentiment change from the start of the conversation to the end of the conversation? For example, if the customer was frustrated with products or services to begin with but became less frustrated by the end - the sentiment would be 'Negative -> Positive'. ",
              context: '',
              importedKeys: {},
              examples: '',
              options:
                'negative -> negative, negative -> neutral, negative -> positive, neutral -> negative, neutral -> neutral, neutral -> positive, positive -> negative, positive -> neutral, positive -> positive',
            },
            {
              columnId: '47fe6c18-32cf-4f62-b08f-ba6b47bcb8e4',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'customer_questions',
              prompt:
                'You are a call center manager reviewing customer calls for quality purposes. Evaluate the following aspect based on the transcript provided. List any questions the customer asked during the conversation.',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: 'd10f78c6-2bbf-4fe5-bf39-25b49fe6bb46',
              type: 'text',
              promptStrategy: 'Chain-of-Thought',
              model: 'gpt-4-32k',
              name: 'frustration',
              prompt:
                'You are a call center manager reviewing customer calls for quality purposes. Evaluate the following aspect based on the transcript provided. Did the customer express any frustration throughout the call? (Answer YES/NO)',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: 'e31e593a-0456-4d0b-849a-b2db22ae1eef',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'summary',
              prompt:
                'You are a call center manager reviewing customer calls for quality purposes. Evaluate the following aspect based on the transcript provided. Summarize the call in 2-3 sentences.',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: 'be10ded2-7359-481b-be5e-24b3e0c9e630',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'outcome',
              prompt:
                "Was the call picked up by the prospect? If not, identify the call as either a voicemail, hung-up or a ghost call? For example, if it seems like the prospect initially answered but then left the agent unanswered after asking 'hello?' several times, this would be a hung-up call. If the agent thought the prospect picked up and starts asking questions like 'is anyone on the line?' with no response, this would be a ghost call. (Answer either 'Pick Up', 'Voicemail', 'Hung Up', 'Ghost Call')",
              context: '',
              importedKeys: {},
              examples:
                "transcript:\nspeaker 0: Nine three one seven.\n{'summary': '', 'outcome': 'Voicemail'}\n\ntranscript:\nspeaker 0: When you have finished recording, you may hang up.\n{'summary': '', 'outcome': 'Voicemail'}\n\ntranscript:\nspeaker 0: At the tone, please record your message. When you have finished record\n{'summary': '', 'outcome': 'Voicemail'}\n\ntranscript:\nspeaker 0: Message for nine two five four eight\n{'summary': '', 'outcome': 'Voicemail'}\n\ntranscript:\nspeaker 0: Six three two two one one.\n{'summary': '', 'outcome': 'Voicemail'}\n\ntranscript:\n0: Hello? Hello? Hello? Yes. Hi, Duane. This is Lily with the Telstra team on a recorded line. Exactly. And there has Hello? Mom and mom and Hello?\n{'summary': '', 'outcome': 'Hung Up'}\n\ntranscript:\n0: Hello, Sue? Yes. Hi. This is Maine with Core Group at Robert Slack on a recorded line. You created a home search profile on your website a few days ago. Did you ever find to tell them you're looking to buy, or are you still looking? We're in not interested at this time, but thank you for your call.\n{'summary': '', 'outcome': 'Hung Up'}\n\ntranscript:\n0: Hello? Hello, Gabrielle? Yes. Yes. Hi. This is Valerie with Curtis Realty Group on a recorded line. So he created a whole\n{'summary': '', 'outcome': 'Hung Up'}\n\ntranscript:\n0: Hello, Ontario? Yes. Hi. Good morning. This is Maine with Better Homes and Gardens Real paid on a recorded line. I'm following up with call and repeat.\n{'summary': '', 'outcome': 'Hung Up'}",
            },
            {
              columnId: 'f4af93a7-f84a-4fa7-9abf-0f9bdd2bb762',
              type: 'text',
              promptStrategy: 'Chain-of-Thought',
              model: 'gpt-4-0125-preview',
              name: 'used_proper_introduction',
              prompt:
                'Did the agent more or less follow the expectations below? If so, answer 10. Otherwise, answer 0.\n- Sounded enthusiastic and positive\n- Executed opening/introduction properly (lead’s name, realtor’s name)\n- Recognized the person on the line (gender, name)\n- Delivered the ""on a recorded line"" spiel during opening\n',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: '08692ad9-5615-46f7-9c2c-59ad5b644fb6',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'identified_call_reason',
              prompt:
                'Did the agent more or less follow the expectations below? If so, answer 10. Otherwise, answer 0.\n- agent identified the reason for the call (buying or renting)\n- Confirmed what brought the lead to the website\n- Confirmed why they were looking at real estate at the moment\n- Identify the motivation and timeline\n- Understand if the lead is not interested or unsure\n- Identify the callback schedule',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: '7ccae387-b597-4e21-baeb-9a671d996372',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'demonstrate_effective_listening',
              prompt:
                'Did the agent more or less follow the expectations below? If so, answer 15. Otherwise, answer 0.\n- Attempted to listen, acknowledge and validate\n- Provided appropriate acknowledgment\n- Expressed “I understand that you are not interested” if the lead was not interested\n- Generally, paid attention to the lead to provide the appropriate response\n',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: '0ca0831a-b904-468b-82db-9f9f8352aa05',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'expressed_proper_empathy',
              prompt:
                "Did the agent more or less follow the expectations below? If so, answer 5. Otherwise, answer 0.\n- Correctly respond to the customer's current emotional state\n- Acknowledge and join in on expressions of positive emotions\n- Acknowledge and empathize appropriately whenever necessary",
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: '4b88b7d6-6fdf-4de0-81a5-d3783c44f1ed',
              type: 'text',
              promptStrategy: 'default',
              model: 'gpt-3.5-turbo',
              name: 'used_professional_language',
              prompt:
                'Did the agent more or less follow the expectations below? If so, answer 10. Otherwise, answer 0.\n- Use ""please"" and ""thank you"" properly when requesting and receiving info from the lead\n- maintain positive and professional messaging throughout the call\n- Avoid engaging in negative or adversarial conversations with the lead\n- Avoid the use of street slang when responding to leads.\n- Made leads feel that they are being helped through the call\n',
              context: '',
              importedKeys: {},
              examples: '',
            },
            {
              columnId: 'bcd66797-2fca-43de-b72a-e1c5a40a46eb',
              type: 'text',
              promptStrategy: 'Chain-of-Thought',
              model: 'gpt-4-0125-preview',
              name: 'rudeness_dishonesty_fraud',
              prompt:
                'Did the agent do any of the following? If so, answer YES. Otherwise NO.\n- Using profanity or swearing on a call, or shouting at the customer.\n- Speaking sarcastically to a customer.\n- Making sexist, racist, or ageist comments.\n- Hanging up while a customer is still speaking to a rep.\n- Not informing the customer that they’ll be put on hold and making them wait excessively for more time than usual\n- Transfers a customer without advising them why or to whom they are transferring\n',
              context: '',
              importedKeys: {},
              examples: '',
            },
          ],
          exportedKeys: {},
        },
      },
      position: {
        x: 253.50727142669268,
        y: -477.7061837664441,
      },
      width: 400,
      height: 102,
      selected: false,
      positionAbsolute: {
        x: 253.50727142669268,
        y: -477.7061837664441,
      },
      dragging: false,
    },
    {
      id: 'data-destination-sheets-hop-2a7037d2-2cd2-4040-a31a-cb4090826e86',
      type: 'DataDestinationSheetsHop',
      data: {
        nodeId: 'data-destination-sheets-hop-2a7037d2-2cd2-4040-a31a-cb4090826e86',
        initialContents: {
          nodeType: 'data-destination-sheets-hop',
          path: '/',
          sheetName: 'Flair Result',
          columnMapping: 'Auto-map',
        },
      },
      position: {
        x: -48.95323261972905,
        y: -172.28770261059918,
      },
      width: 400,
      height: 78,
      selected: false,
      positionAbsolute: {
        x: -48.95323261972905,
        y: -172.28770261059918,
      },
      dragging: false,
    },
    {
      id: 'conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6',
      type: 'ConditionalHop',
      data: {
        nodeId: 'conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6',
        initialContents: {
          nodeType: 'conditional-hop',
          conditionalLabel: '',
          conditions: [
            {
              conditionId: 'c2b83a7a-88ca-4fad-b17d-ead1fa2e4937',
              column: 'rudeness_dishonesty_fraud',
              operator: 'is',
              value: 'YES',
            },
          ],
        },
      },
      position: {
        x: 510.55587057380626,
        y: -265.51369835876943,
      },
      width: 400,
      height: 102,
      selected: false,
      positionAbsolute: {
        x: 510.55587057380626,
        y: -265.51369835876943,
      },
      dragging: false,
    },
    {
      id: 'data-destination-gmail-hop-e0ccf858-a27d-48c8-98c8-a20c56bc62f2',
      type: 'DataDestinationGmailHop',
      data: {
        nodeId: 'data-destination-gmail-hop-e0ccf858-a27d-48c8-98c8-a20c56bc62f2',
        initialContents: {
          nodeType: 'data-destination-gmail-hop',
          to: 'agent@company.com',
          subject: 'Call Coaching Recommendations',
          prompt:
            'Hi {{agent_name}},\n\nHere are several insights from your past few customer support calls and recommended strategies for handling conversations.\n\n{{rudeness_dishonesty_fraud}}\n\nThanks,\nFlair Team\n\n',
        },
      },
      position: {
        x: 349.0812116548908,
        y: -15.66776381157441,
      },
      width: 800,
      height: 78,
      selected: true,
      positionAbsolute: {
        x: 349.0812116548908,
        y: -15.66776381157441,
      },
      dragging: false,
    },
  ],
  edges: [
    {
      source: 'data-source-s3-hop-8c48f425-4d85-419d-957f-222b5be92da7',
      sourceHandle: 'out',
      target: 'llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1d',
      targetHandle: 'in',
      id: 'reactflow__edge-data-source-s3-hop-8c48f425-4d85-419d-957f-222b5be92da7out-llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1din',
    },
    {
      source: 'llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1d',
      sourceHandle: 'out',
      target: 'data-destination-sheets-hop-2a7037d2-2cd2-4040-a31a-cb4090826e86',
      targetHandle: 'in',
      id: 'reactflow__edge-llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1dout-data-destination-sheets-hop-2a7037d2-2cd2-4040-a31a-cb4090826e86in',
    },
    {
      source: 'llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1d',
      sourceHandle: 'out',
      target: 'conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6',
      targetHandle: 'in',
      id: 'reactflow__edge-llm-processor-hop-c5a31223-fb53-48f6-987a-1772a7b4da1dout-conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6in',
    },
    {
      source: 'conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6',
      sourceHandle: 'out-true',
      target: 'data-destination-gmail-hop-e0ccf858-a27d-48c8-98c8-a20c56bc62f2',
      targetHandle: 'in',
      id: 'reactflow__edge-conditional-hop-53678f2c-c8e7-4f2b-85fa-437e33482ac6out-true-data-destination-gmail-hop-e0ccf858-a27d-48c8-98c8-a20c56bc62f2in',
    },
  ],
}

export const workflowRunner = () => {
  // Detect starting point
  // - check for nodes that is not part of target
  const edges = config.edges

  const edgeSources = new Set(edges.map(el => el.source))
  const edgeTargets = new Set(edges.map(el => el.target))

  const startingNodes = [...edgeSources].filter(el => !edgeTargets.has(el))

  // Global intermediates
  const csvIntermediates: Record<string, any> = {}

  // Recursive functions
  const executor = (currentNode: string) => {
    const currentNodeConfig = config.nodes.filter(el => el.id === currentNode)[0]
    const nodeType = currentNodeConfig.type

    // Load function from module registry
    const func = moduleRegistry[nodeType]

    // Execute the node based on type
    // Save CSV result in csvIntermediates

    // Get next nodes
    const nextNodes = edges.filter(el => el.source === currentNode).map(el => el.target)

    console.log('currentNode', currentNode, 'type', currentNodeConfig.type, 'nextNodes', nextNodes)

    for (const nextNode of nextNodes) {
      executor(nextNode)
    }
  }

  for (const startingNode of startingNodes) {
    executor(startingNode)
  }
}
