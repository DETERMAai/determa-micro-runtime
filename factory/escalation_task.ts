export type EscalationTask = {
  target: string;
  prompt: string;
  failureCount: number;
  previousFailures: string[];
};

