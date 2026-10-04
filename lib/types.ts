export interface DecisionInput {
  decision: string;
  options: string;
  details: string;
  reasoning: string;
}

export interface ClarifyingQuestions {
  questions: string[];
}

export interface ClarifyingRequest {
  decision: string;
  options: string;
  details: string;
  reasoning: string;
}

export interface AnalysisRequest {
  decision: string;
  options: string;
  details: string;
  reasoning: string;
  clarifyingAnswers: string[];
}

export interface HiddenAssumption {
  assumption: string;
  whyRisky: string;
  testItBy: string;
}

export interface OverlookedFactor {
  factor: string;
  whyItMatters: string;
  category: string;
}

export interface InternalConflict {
  conflict: string;
  statementOne: string;
  statementTwo: string;
}

export interface BiasCheck {
  bias: string;
  explanation: string;
}

export interface ReasoningBalance {
  shortTermFocus: number;
  longTermFocus: number;
  financialFocus: number;
  growthLearningFocus: number;
  riskAwareness: number;
}

export interface Analysis {
  reasoningSummary: string;
  hiddenAssumptions: HiddenAssumption[];
  overlookedFactors: OverlookedFactor[];
  internalConflicts: InternalConflict[];
  questionsToAskYourself: string[];
  biasCheck: BiasCheck[];
  reasoningBalance: ReasoningBalance;
}

export const INTERNSHIP_EXAMPLE: DecisionInput = {
  decision: "Should I accept a 6-month internship?",
  options: "Accept / Decline / Negotiate",
  details:
    "The internship offers a good stipend, is close to home, provides industry experience, and has working hours that may overlap with my college schedule. I am still not sure how much mentorship and actual learning the role provides.",
  reasoning:
    "I am mainly considering it because the stipend is good, the company is close to home, and it will provide industry experience.",
};
