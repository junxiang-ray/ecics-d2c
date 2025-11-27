export type TermAndConditionResponseData = {
  data: Array<{
    id: number;
    attributes: Record<string, unknown>;
  }>;
  meta: Record<string, unknown>;
};

export type TermAndConditionResponse = Pick<
  TermAndConditionResponseData,
  'meta'
> & {
  data: TermAndCondition;
};

export type TermAndCondition = {
  id: number;
  attributes: TermAndConditionAttr;
};

export type TermAndConditionAttr = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  content: string;
};
