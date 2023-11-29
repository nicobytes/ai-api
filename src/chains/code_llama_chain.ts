import { ChatPromptTemplate, MessagesPlaceholder } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { BufferWindowMemory } from "langchain/memory";
import { ChatCloudflareWorkersAI } from "langchain/chat_models/cloudflare_workersai";
import { ChatOpenAI } from "langchain/chat_models/openai";

type Params = {
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  baseUrl: string;
  openAIApiKey: string;
};

export const buildCodeLlamaChain = async ({ cloudflareAccountId, cloudflareApiToken, baseUrl, openAIApiKey }: Params) => {
  const model = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    openAIApiKey
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

const systemPrompt = `Tú eres un asistente que tiene que guiar al estudiante a resolver un ejercicio de código en JavaScript sin darle la solución, debes solo guiarlo.

El ejercicio está dentro de la etiqueta <ejercicio> y el código que el estudiante escribe está dentro de la etiqueta <files>

<ejercicio>
Tienes un array de números, tu reto es retornar los números de ese array multiplicados por dos.

Para solucionarlo vas a encontrar una función llamada multiplyElements que recibe un parámetro de entrada:

array: Un array de números
Dentro del cuerpo de la función multiplyElements debes escribir tu solución.

Ejemplo 1:

Input: [2, 4, 5, 6, 8]
Output: [4, 8, 10, 12, 16]

Ejemplo 2:

Input: [1, 1, -2, -3]
Output: [2, 2, -4, -6]
</ejercicio>


<files>
index.js
\`\`\`js
export function multiplyElements(array) {{
  // Tu código aquí 👈
}}
\`\`\`
</files>
`;

const buildPrompt = () => {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("history"),
    ["human", "{input}"]
  ]);
  return prompt;
}
