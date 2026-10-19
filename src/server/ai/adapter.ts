import { readModelConfig } from "@/server/config";

export type ProposalModelId = "doubao-seed-evolving";

export type AnalysisPayload = {
  summary: string;
  objectives: string[];
  audience: string | null;
  deliverableNotes: string | null;
  styleNotes: string | null;
  constraints: string[];
  openQuestions: string[];
  searchQueries: string[];
};

export type DraftBlock = {
  type: string;
  title: string;
  body: string;
  assetIds: string[];
  searchRefs: Array<{ title: string; url: string; snippet?: string }>;
};

export type GenerateDraftResult = {
  blocks: DraftBlock[];
  searchQueries: string[];
  searchHits: Array<{
    query: string;
    title: string;
    url: string;
    snippet?: string;
    mediaType: "image" | "video" | "link";
  }>;
};

export interface ProposalModelAdapter {
  readonly provider: "volcengine-ark";
  readonly model: ProposalModelId;
  analyze(input: {
    brief: string;
    assetFilenames: string[];
  }): Promise<AnalysisPayload>;
  generateDraft(input: {
    analysis: AnalysisPayload;
    brief: string;
  }): Promise<GenerateDraftResult>;
  regenerateBlock(input: {
    analysis: AnalysisPayload;
    blockType: string;
    currentBody: string;
  }): Promise<DraftBlock>;
}

export class ModelNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelNotConfiguredError";
  }
}

/** 无密钥时失败；有密钥时调用方舟。测试可注入 FixtureAdapter。 */
export class VolcengineArkAdapter implements ProposalModelAdapter {
  readonly provider = "volcengine-ark" as const;
  readonly model = "doubao-seed-evolving" as const;

  constructor(
    private readonly env: Record<string, string | undefined> = process.env,
  ) {}

  private requireConfigured() {
    const config = readModelConfig(this.env);
    if (!config.configured) {
      throw new ModelNotConfiguredError(config.reason);
    }
    return config;
  }

  async analyze(input: {
    brief: string;
    assetFilenames: string[];
  }): Promise<AnalysisPayload> {
    this.requireConfigured();
    // 真实 HTTP 调用留待有账号时接入；当前保证未配置即失败，已配置时返回可校验结构占位。
    // 不编造对外金额。
    const apiKey = this.env.AI_API_KEY?.trim() ?? "";
    const baseUrl = this.env.AI_BASE_URL?.trim() ?? "";
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/responses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        input: [
          {
            role: "user",
            content: `请分析以下提案需求并输出 JSON 字段 summary,objectives,audience,deliverable_notes,style_notes,constraints,open_questions,search_queries。需求：${input.brief}。素材：${input.assetFilenames.join(",")}`,
          },
        ],
      }),
    });
    if (!response.ok) {
      throw new Error(`方舟分析失败：HTTP ${response.status}`);
    }
    // 响应形状随方舟版本变化；先失败提示，避免半截入库。
    throw new Error("方舟响应解析尚未按生产账号夹具固化，请用测试夹具或稍后再接");
  }

  async generateDraft(): Promise<GenerateDraftResult> {
    this.requireConfigured();
    throw new Error("方舟生成尚未按生产账号夹具固化，请用测试夹具或稍后再接");
  }

  async regenerateBlock(): Promise<DraftBlock> {
    this.requireConfigured();
    throw new Error("方舟重生成尚未按生产账号夹具固化，请用测试夹具或稍后再接");
  }
}

export class FixtureAdapter implements ProposalModelAdapter {
  readonly provider = "volcengine-ark" as const;
  readonly model = "doubao-seed-evolving" as const;

  async analyze(input: {
    brief: string;
    assetFilenames: string[];
  }): Promise<AnalysisPayload> {
    return {
      summary: `基于需求的分析摘要：${input.brief.slice(0, 80)}`,
      objectives: ["完成提案初稿"],
      audience: "客户决策人",
      deliverableNotes: "HTML 提案",
      styleNotes: "专业中性",
      constraints: input.assetFilenames.length
        ? [`已提供 ${input.assetFilenames.length} 个素材`]
        : [],
      openQuestions: [],
      searchQueries: ["AIGC 传媒案例"],
    };
  }

  async generateDraft(input: {
    analysis: AnalysisPayload;
  }): Promise<GenerateDraftResult> {
    const url = "https://example.com/case-study";
    return {
      blocks: [
        {
          type: "cover",
          title: "封面",
          body: input.analysis.summary,
          assetIds: [],
          searchRefs: [],
        },
        {
          type: "creative",
          title: "创意",
          body: "创意方向说明",
          assetIds: [],
          searchRefs: [],
        },
        {
          type: "cases",
          title: "案例",
          body: "参考案例",
          assetIds: [],
          searchRefs: [{ title: "示例案例", url, snippet: "公开网页" }],
        },
        {
          type: "quote",
          title: "报价",
          body: "",
          assetIds: [],
          searchRefs: [],
        },
      ],
      searchQueries: input.analysis.searchQueries,
      searchHits: [
        {
          query: "AIGC 传媒案例",
          title: "示例案例",
          url,
          snippet: "工具返回的真实地址示例",
          mediaType: "link",
        },
      ],
    };
  }

  async regenerateBlock(input: {
    blockType: string;
    currentBody: string;
  }): Promise<DraftBlock> {
    return {
      type: input.blockType,
      title: input.blockType,
      body: `${input.currentBody}\n（已重生成）`,
      assetIds: [],
      searchRefs: [],
    };
  }
}

let injected: ProposalModelAdapter | null = null;

export function setModelAdapterForTests(adapter: ProposalModelAdapter | null) {
  injected = adapter;
}

export function getModelAdapter(): ProposalModelAdapter {
  if (injected) {
    return injected;
  }
  if (process.env.AI_USE_FIXTURE === "1") {
    return new FixtureAdapter();
  }
  return new VolcengineArkAdapter();
}
