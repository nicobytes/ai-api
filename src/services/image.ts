import { Ai } from "@cloudflare/ai";

interface Params {
  prompt: string;
  num_steps: number;
  AI: any;
}

export const generateImage = async (params: Params) => {
  const ai = new Ai(params.AI);
  const inputs = {
    prompt: params.prompt,
    num_steps: params.num_steps,
  };
  const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  const response = await ai.run(model, inputs);
  return response;

};
