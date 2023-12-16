import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { BufferWindowMemory } from "langchain/memory";
import { ChatCloudflareWorkersAI } from "langchain/chat_models/cloudflare_workersai";

type Params = {
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  baseUrl: string;
};

export const buildCodeLlamaChain = async ({ cloudflareAccountId, cloudflareApiToken, baseUrl }: Params) => {
  const model = new ChatCloudflareWorkersAI({
    model: "@hf/thebloke/codellama-7b-instruct-awq",
    cloudflareAccountId,
    cloudflareApiToken,
    baseUrl
  });

  const prompt = buildPrompt();

  const memory = new BufferWindowMemory({
    k: 5,
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    memoryKey: "history",
  });
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([
    {
      input: (initialInput) => initialInput.input,
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      input: (previousOutput) => previousOutput.input,
      history: (previousOutput) => previousOutput.memory.history,
    },
    prompt,
    model,
    outputParser
  ]);
};

const systemPrompt = `Tu eres un bot experto en Angular`;

const buildPrompt = () => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("history"),
    ["human", "{input}"]
  ]);
  return prompt;
}
