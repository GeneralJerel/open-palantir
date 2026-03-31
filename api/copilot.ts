import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';

export const config = { runtime: 'edge' };

/**
 * CopilotKit runtime endpoint.
 *
 * Uses the OpenAI-compatible adapter which works with OpenRouter, Groq,
 * or any OpenAI-compatible API. Set the following env vars:
 *
 *   OPENAI_API_KEY     – API key for the LLM provider
 *   OPENAI_BASE_URL    – Base URL (e.g. https://openrouter.ai/api/v1)
 *   COPILOT_MODEL      – Model ID (e.g. google/gemini-2.5-flash, gpt-4o)
 *
 * Falls back to OpenAI's default endpoint if OPENAI_BASE_URL is not set.
 */
export default async function handler(req: Request): Promise<Response> {
  const model = process.env.COPILOT_MODEL || undefined;
  const baseURL = process.env.OPENAI_BASE_URL || undefined;

  const serviceAdapter = new OpenAIAdapter({ model });

  const runtime = new CopilotRuntime({
    remoteActions: [],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilot',
  });

  return handleRequest(req);
}
