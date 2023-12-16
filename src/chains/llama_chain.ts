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

export const buildLlamaChain = async ({ cloudflareAccountId, cloudflareApiToken, baseUrl }: Params) => {
  const model = new ChatCloudflareWorkersAI({
    model: "@cf/meta/llama-2-7b-chat-int8",
    cloudflareAccountId,
    cloudflareApiToken,
    // baseUrl
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Tu eres un bot expeto en Angular y tu idioma es en español"],
    new MessagesPlaceholder("history"),
    ["human", "{input}"]
  ]);

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
