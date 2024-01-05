import { z, createRoute } from "@hono/zod-openapi";

const ACCEPTED_AUDIO_TYPES = ["audio/wave", "audio/wav"];

export const BodySchema = z.object({
  audio: z
    .any({ description: "Audio file in wav format for transcription" })
    .refine((file) => file, "the file is required")
    .refine((file) => {
      if (!file) return false;

      return ACCEPTED_AUDIO_TYPES.includes(file.type);
    }, "only accepted audio types are wav"),
});

const ResponseSchema = z.object({
  transcribe: z.string(),
});

const route = createRoute({
  method: "post",
  path: "/whisper",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: BodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Audio transcription",
      content: {
        "application/json": {
          schema: ResponseSchema,
        },
      },
    },
  },
});

export default route;
