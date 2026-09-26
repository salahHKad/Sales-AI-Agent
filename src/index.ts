/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { systemPrompt } from "./sales-agent/prompt";


export interface Env {
	AI: Ai;
}

const testTranscript = `Customer: Hey I am looking into buying a Lenovo laptop, my budget is 500$ and bellow, can you recommend one to me?`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: testTranscript }
		]
      });
      return Response.json(response);
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

