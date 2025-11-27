export type PrivacyPolicyResponseData = {
  data: Array<{
    id: number;
    attributes: Record<string, unknown>;
  }>;
  meta: Record<string, unknown>;
};

export interface PrivacyPolicyResponse
  extends Pick<PrivacyPolicyResponseData, 'meta'> {
  data: PrivacyPolicy[];
}

export type PrivacyPolicy = {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    content: string;
  };
};
