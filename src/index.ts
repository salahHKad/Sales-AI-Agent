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

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response("Hello , World!");
// 	},
// } satisfies ExportedHandler<Env>;

export interface Env {
	AI: Ai;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        prompt: "Tell me a joke"
      });
      return Response.json(response);
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

