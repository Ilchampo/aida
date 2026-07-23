import type { JobAccent } from '@lib/interfaces/job.interface';

import { JOB_ACCENTS } from '@lib/interfaces/job.interface';

export const accentForIndex = (index: number): JobAccent => JOB_ACCENTS[index % JOB_ACCENTS.length];
