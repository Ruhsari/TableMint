import type { ApiProblem } from '@/api/problem';

export type AvailabilityResult = {
  slots: string[]; // startsAt в RFC 3339 со смещением, как отдаёт API
  problem: ApiProblem | null;
};
