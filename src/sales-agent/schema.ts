
export const outputSchema = {
  summary: "string (بالعربية) — ملخص من جملة واحدة لطلب العميل",
  extracted_facts: {
    "<fact_name>": {
      value: "string (بالعربية) — القيمة المستخرجة",
      evidence: "string — اقتباس حرفي من المحادثة (بنفس لغة العميل، بدون ترجمة)"
    }
  },
  missing_info: ["array of strings (بالعربية) — الحقول غير المذكورة"],
  contradictions: "string (بالعربية) | null",
  suggested_next_step: {
    question: "string (بالعربية) — السؤال المقترح للعميل",
    reasoning: "string (بالعربية) — سبب اقتراح هذا السؤال"
  }
};

export const schemaAsPromptText = JSON.stringify(outputSchema, null, 2);