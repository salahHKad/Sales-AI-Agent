export const outputSchema = {
  summary: "string — one sentence summary of the customer's request",
  extracted_facts: {
    "<fact_name>": {
      value: "string — the extracted value",
      evidence: "string — verbatim quote from transcript"
    }
  },
  missing_info: ["array of strings — fields not mentioned"],
  contradictions: "string | null",
  suggested_next_step: {
    question: "string",
    reasoning: "string"
  }
};

export const schemaAsPromptText = JSON.stringify(outputSchema, null, 2);