export type ProposalModelId = "doubao-seed-evolving";

export interface ProposalModelAdapter {
  readonly provider: "volcengine-ark";
  readonly model: ProposalModelId;
}
