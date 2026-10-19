import { describe, expect, it } from "vitest";

import {
  extractJsonObject,
  extractOutputText,
  extractWebSearchHits,
  type ArkResponsePayload,
} from "@/server/ai/ark-client";

describe("方舟响应解析", () => {
  it("从 message.output_text 提取正文", () => {
    const payload: ArkResponsePayload = {
      output: [
        { type: "reasoning", status: "completed" },
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: '{"summary":"ok"}' }],
        },
      ],
    };
    expect(extractOutputText(payload)).toBe('{"summary":"ok"}');
  });

  it("解析围栏或裸 JSON", () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
    expect(extractJsonObject('```json\n{"a":2}\n```')).toEqual({ a: 2 });
    expect(extractJsonObject('前缀{"a":3}后缀')).toEqual({ a: 3 });
  });

  it("只收录 web_search 工具结果里的 http(s) URL", () => {
    const payload: ArkResponsePayload = {
      output: [
        {
          type: "web_search_call",
          action: { query: "AIGC 案例" },
          results: [
            {
              title: "真实案例",
              url: "https://example.com/real",
              snippet: "摘要",
            },
            { title: "坏链", url: "javascript:alert(1)" },
            { title: "相对", url: "/path" },
          ],
        },
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: '{"blocks":[{"type":"cases","title":"案例","body":"x","searchRefs":[{"title":"编造","url":"https://fake.example/x"}]}]}',
            },
          ],
        },
      ],
    };
    const { queries, hits } = extractWebSearchHits(payload);
    expect(queries).toEqual(["AIGC 案例"]);
    expect(hits).toEqual([
      {
        query: "AIGC 案例",
        title: "真实案例",
        url: "https://example.com/real",
        snippet: "摘要",
        mediaType: "link",
      },
    ]);
  });
});
