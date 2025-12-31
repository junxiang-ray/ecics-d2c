import { z } from 'zod';

export const saveQuoteProposalSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  selected_plan: z.string().min(1, 'Plan must be selected'),
  selected_addons: z.any(),
  add_named_driver_info: z.array(z.any()),
});

export type saveQuoteProposalDTO = z.infer<typeof saveQuoteProposalSchema>;

export const saveQuoteProposalForMaidSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  selected_plan: z.string().min(1, 'Plan must be selected'),
  selected_addons: z.any(),
  personal_info: z.any(),
  maid_info: z.any(),
});

export type saveQuoteProposalForMaidDTO = z.infer<
  typeof saveQuoteProposalForMaidSchema
>;

export const saveQuoteProposalForHomeContentSchema = z.object({
  key: z.string().min(5, 'Key must be at least 5 characters long'),
  homeContentPayload: z.object({
    proposerDetails: z.object({
      addressLine1: z.string(),
      addressLine2: z.string().optional(),
      addressLine3: z.string().optional(),
      postCode: z.string(),
      name: z.string(),
      nric: z.string(),
      dob: z.string(),
      gender: z.string(),
      maritalStatus: z.string(),
      mobile: z.string(),
      email: z.string(),
      differentMailingAddress: z.string(),
      mailingAddress1: z.string(),
      mailingAddress2: z.string().optional(),
      mailingAddress3: z.string().optional(),
      mailingPostCode: z.string(),
    }),
    planDetails: z.object({
      homeOwnership: z.string(),
      homeType: z.string(),
      unitType: z.string(),
      homeContentCoverage: z.string(),
      renovationsCoverage: z.string(),
      buildingCoverage: z.string(),
      wpaCoverage: z.string(),
      policyPeriod: z.string(),
      promoCode: z.string(),
      selectedPlan: z.string(),
      startDate: z.string(),
    }),
  }),
});

export type saveQuoteProposalForHomeContentDTO = z.infer<
  typeof saveQuoteProposalForHomeContentSchema
>;
