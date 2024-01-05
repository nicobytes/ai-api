import { Ai } from "@cloudflare/ai";

interface Params {
  audio: File;
  AI: any;
}

interface Response {
  text: string;
}

export const generateTranscribe = async (params: Params) => {
  const { AI } = params;
  const res: any = await fetch("https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/samples/cpp/windows/console/samples/enrollment_audio_katie.wav");
  const blob = await res.arrayBuffer();
  const ai = new Ai(AI);
  const input = {
    audio: [...new Uint8Array(blob)],
  };
  const model = "@cf/openai/whisper";
  const response = await ai.run(model, input);
  return response as Response;
};
