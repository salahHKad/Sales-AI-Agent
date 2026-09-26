import { systemPrompt } from "./sales-agent/prompt";
import { systemPrompt as classifierPrompt } from "./sales-agent/classifierPrompt";
import { formatOutput } from "./sales-agent/formatOutPut";

export interface Env {
	AI: Ai;
}

//const testTranscript = 'can you give me python code to print hello world?';
const testTranscript = `Customer: Hey I am looking into buying a Lenovo laptop, my budget is 500$ and bellow, can you recommend one to me?`;
// const testTranscript = `Customer: Hey I am looking into buying a Lenovo laptop, my budget is 500$ and bellow, can you recommend one to me?`;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Step 1: scope check — llama call #1, using classifierPrompt
      const classifierResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        messages: [
          { role: "system", content: classifierPrompt },
          { role: "user", content: testTranscript }
        ],
        temperature: 0,
      });

      if (!("response" in classifierResponse) || typeof classifierResponse.response !== "string") {
        return Response.json(
          { error: "Classifier did not return a text response", raw: classifierResponse },
          { status: 500 }
        );
      }

      let scopeResult;
      try {
        scopeResult = JSON.parse(classifierResponse.response);
      } catch (e) {
        // Retry with single quotes normalized to double quotes, in case the model slips
        try {
          const normalized = classifierResponse.response.replace(/'/g, '"');
          scopeResult = JSON.parse(normalized);
        } catch (e2) {
          return Response.json(
            { error: "Classifier did not return valid JSON", raw: classifierResponse.response },
            { status: 500 }
          );
        }
      }

      if (!scopeResult.in_scope) {
        return Response.json({
          error: "out_of_scope",
          message: "I am not allowed to provide service beyond sales support."
        });
      }
      // Step 2: extraction — llama call #2, using the sales-agent prompt
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: testTranscript }
        ],
        temperature: 0,
      });

      if (!("response" in response) || typeof response.response !== "string") {
        return Response.json(
          { error: "Model did not return a text response", raw: response },
          { status: 500 }
        );
      }

      let parsed;
      try {
        parsed = JSON.parse(response.response);
      } catch (e) {
        return Response.json(
          { error: "Model did not return valid JSON", raw: response.response },
          { status: 500 }
        );
      }

      return Response.json({
        raw_json: parsed,
        human_readable: formatOutput(parsed)
      });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;