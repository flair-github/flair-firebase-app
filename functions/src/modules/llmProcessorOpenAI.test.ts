import { dataSourceS3 } from './dataSourceS3'
import { llmProcessorOpenAI } from './llmProcessorOpenAI'

jest.setTimeout(30000)

describe('test', () => {
  it('test', async () => {
    const x = dataSourceS3()
    const res = await llmProcessorOpenAI(x as any, llmConfig)
    console.log(JSON.stringify(res, null, 2))
  })
})

const llmConfig = {
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
}
