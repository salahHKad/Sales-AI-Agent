// formatOutput.ts
import { outputSchema } from "./schema";

type ParsedOutput = {
  summary: string;
  extracted_facts: Record<string, { value: string; evidence: string }>;
  missing_info: string[];
  contradictions: string | null;
  suggested_next_step: { question: string; reasoning: string };
};

export function formatOutput(data: ParsedOutput): string {
  const lines: string[] = [];

  lines.push(`الملخص: ${data.summary}`);
  lines.push("");
  lines.push("الحقائق المستخرجة:");
  for (const [key, fact] of Object.entries(data.extracted_facts)) {
    lines.push(`  - ${key}: ${fact.value}  (الدليل: "${fact.evidence}")`);
  }

  lines.push("");
  lines.push(`معلومات غير مذكورة: ${data.missing_info.length ? data.missing_info.join(", ") : "لا يوجد"}`);
  lines.push(`تناقضات: ${data.contradictions ?? "لا يوجد"}`);
  lines.push("");
  lines.push(`السؤال المقترح: ${data.suggested_next_step.question}`);
  lines.push(`السبب: ${data.suggested_next_step.reasoning}`);

  return lines.join("\n");
}