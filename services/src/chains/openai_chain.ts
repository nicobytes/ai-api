import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { BufferWindowMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";

type Params = {
  openAIApiKey: string;
};

export const buildOpenAIChain = async ({ openAIApiKey }: Params) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: openAIApiKey,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Tu eres un bot expeto en Angular"],
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
