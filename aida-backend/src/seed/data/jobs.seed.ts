import type { JobRole, QuestionCategory } from '@constants/schemas.constants';

export interface SeedFollowUp {
    text: string;
    trigger_hint: string;
}

export interface SeedQuestion {
    text: string;
    category: QuestionCategory;
    skill: string;
    follow_ups: SeedFollowUp[];
}

export interface SeedRubricItem {
    skill: string;
    weight: number;
    signals: string[];
}

export interface SeedJob {
    slug: string;
    title: string;
    role: JobRole;
    description: string;
    tags: string[];
    rubric: SeedRubricItem[];
    question_bank: SeedQuestion[];
}

export const SEED_JOBS: SeedJob[] = [
    {
        slug: 'ledgerbridge-node-backend-intern',
        title: 'Intern Node.js Backend Developer',
        role: 'Intern Node Backend',
        description:
            'LedgerBridge is a B2B invoicing platform helping small businesses reconcile payments with tax authorities. Our backend is a fleet of Node.js and TypeScript services on AWS, handling invoice validation, webhook ingestion, and audit trails for regulated financial data. As an intern on the Platform API squad, you will pair with a senior engineer to ship REST endpoints, write integration tests, and debug staging issues in real customer workflows. You will not own production deploys alone, but you will read logs, propose fixes, and learn why correctness beats speed in money-adjacent systems. Hard requirements: Node.js 18+ and TypeScript; at least one completed backend project (coursework, bootcamp, or personal) exposing REST APIs; working knowledge of PostgreSQL or another relational database; Git for version control; ability to commit 20+ hours per week for a 3–6 month internship. Ideal for a student or recent graduate who wants structured mentorship in backend engineering.',
        tags: [
            'node.js',
            'typescript',
            'express',
            'rest-api',
            'postgresql',
            'integration-testing',
            'backend',
            'internship',
        ],
        rubric: [
            {
                skill: 'Node.js runtime & async patterns',
                weight: 3,
                signals: [
                    'explains event loop phases with a concrete example',
                    'distinguishes microtasks from macrotasks correctly',
                    'identifies blocking vs non-blocking I/O impact on throughput',
                    'chooses Promise.all vs sequential await with justification',
                    'describes error propagation in async middleware chains',
                    'names built-in modules used for HTTP, filesystem, or crypto work',
                    'explains when streams help with large payloads or files',
                    'articulates risks of unhandled promise rejections in production',
                ],
            },
            {
                skill: 'REST API design & HTTP semantics',
                weight: 3,
                signals: [
                    'selects correct HTTP verbs for CRUD operations with reasoning',
                    'maps status codes to client and server error scenarios',
                    'designs idempotent endpoints for retried payment or invoice calls',
                    'describes request validation boundaries between client and server',
                    'explains pagination or filtering for list endpoints',
                    'identifies breaking vs non-breaking API contract changes',
                    'mentions versioning or deprecation strategy for public APIs',
                    'discusses authentication placement in middleware vs route handlers',
                ],
            },
            {
                skill: 'Data integrity & persistence',
                weight: 3,
                signals: [
                    'explains transactions for multi-step financial writes',
                    'describes schema constraints that prevent duplicate invoices',
                    'compares SQL joins vs application-level aggregation trade-offs',
                    'mentions indexing strategy tied to a specific slow query',
                    'discusses migration safety for live production tables',
                    'identifies race conditions in concurrent update scenarios',
                    'explains soft delete vs hard delete implications for audits',
                    'describes backup or restore awareness for critical tables',
                ],
            },
            {
                skill: 'Testing, debugging & observability',
                weight: 2,
                signals: [
                    'distinguishes unit, integration, and end-to-end test scope',
                    'writes a test case for an unhappy-path API response',
                    'uses logs or structured errors to trace a failed request',
                    'describes how to reproduce a staging bug locally',
                    'mentions test doubles or fixtures for external payment providers',
                    'explains when to mock the database vs use a test database',
                    'identifies metrics or alerts worth watching after a deploy',
                    'proposes a minimal rollback plan when a release misbehaves',
                ],
            },
            {
                skill: 'Collaboration & professional communication',
                weight: 2,
                signals: [
                    'structures answers with context, action, and result',
                    'asks clarifying questions before designing a solution',
                    'admits knowledge gaps and describes how they would learn',
                    'references code review or pair programming experience',
                    'explains a technical decision to a non-technical stakeholder',
                    'describes how they handle conflicting feedback on a PR',
                    'mentions documentation habits for endpoints or runbooks',
                    'shows accountability when a change they shipped caused issues',
                ],
            },
        ],
        question_bank: [
            {
                text: 'Walk me through what happens in Node.js when an HTTP request hits your Express server, from socket accept to response sent.',
                category: 'technical',
                skill: 'Node.js runtime & async patterns',
                follow_ups: [
                    {
                        text: 'Which part of that flow is single-threaded, and where can work run in parallel?',
                        trigger_hint:
                            'candidate describes the request lifecycle without mentioning concurrency limits',
                    },
                    {
                        text: 'What happens if a route handler performs a long synchronous JSON parse on a 20 MB payload?',
                        trigger_hint: 'candidate mentions the event loop but not blocking work',
                    },
                    {
                        text: 'How would you attach a request ID so every log line for that request shares the same identifier?',
                        trigger_hint: 'candidate covers middleware ordering correctly',
                    },
                    {
                        text: 'If the process crashes mid-request, what does the client experience and what should your load balancer do?',
                        trigger_hint: 'candidate only describes the happy path',
                    },
                ],
            },
            {
                text: 'Explain the difference between callbacks, Promises, and async/await in Node.js. When would you still reach for a callback?',
                category: 'technical',
                skill: 'Node.js runtime & async patterns',
                follow_ups: [
                    {
                        text: 'Show me how you would refactor nested callbacks into async/await without losing error handling.',
                        trigger_hint: 'candidate defines all three but gives no migration example',
                    },
                    {
                        text: 'What is the output order if you mix setImmediate, process.nextTick, and a resolved Promise in one function?',
                        trigger_hint:
                            'candidate understands async/await but not microtask ordering',
                    },
                    {
                        text: 'How do you ensure errors in an async route handler reach Express error middleware?',
                        trigger_hint:
                            'candidate does not mention try/catch or wrapping async handlers',
                    },
                    {
                        text: 'When is Promise.all the wrong tool for concurrent I/O?',
                        trigger_hint:
                            'candidate recommends Promise.all without discussing partial failure',
                    },
                ],
            },
            {
                text: 'Design a POST endpoint that creates an invoice for a business customer. Include path, payload shape, success response, and the main error cases.',
                category: 'technical',
                skill: 'REST API design & HTTP semantics',
                follow_ups: [
                    {
                        text: 'A mobile client retries the same POST after a timeout. How do you prevent duplicate invoices?',
                        trigger_hint: 'candidate covers happy path but not idempotency',
                    },
                    {
                        text: 'Which status code do you return for validation errors vs authentication failures vs server bugs?',
                        trigger_hint: 'candidate uses 400 for every error type',
                    },
                    {
                        text: 'How would you document this endpoint for frontend engineers consuming it?',
                        trigger_hint:
                            'candidate designs the endpoint but omits contract documentation',
                    },
                    {
                        text: 'What changes if the invoice must be approved by a human before it becomes payable?',
                        trigger_hint:
                            'candidate treats create and approve as a single synchronous step',
                    },
                ],
            },
            {
                text: 'A GET /invoices?page=2&status=paid endpoint returns inconsistent results while new invoices are being inserted. Why, and how would you fix it?',
                category: 'technical',
                skill: 'REST API design & HTTP semantics',
                follow_ups: [
                    {
                        text: 'Compare offset pagination vs cursor pagination for this use case.',
                        trigger_hint:
                            'candidate suggests raising page size without addressing consistency',
                    },
                    {
                        text: 'How do you communicate total page count when rows are mutating during pagination?',
                        trigger_hint: 'candidate ignores API consumer expectations',
                    },
                    {
                        text: 'What database index would you add to keep this query fast at 5 million rows?',
                        trigger_hint: 'candidate fixes logic but not performance',
                    },
                    {
                        text: 'Should clients be allowed to sort by arbitrary fields? What are the risks?',
                        trigger_hint: 'candidate adds sorting without injection or index awareness',
                    },
                ],
            },
            {
                text: 'You need to transfer funds between two ledger accounts and write an audit log entry. Both writes must succeed or neither should. How do you model that in PostgreSQL from Node.js?',
                category: 'technical',
                skill: 'Data integrity & persistence',
                follow_ups: [
                    {
                        text: 'What isolation level would you choose and what anomaly are you preventing?',
                        trigger_hint: 'candidate mentions transactions but not isolation',
                    },
                    {
                        text: 'How do you handle a deadlock between two concurrent transfers?',
                        trigger_hint: 'candidate assumes transactions always succeed',
                    },
                    {
                        text: 'Where should retry logic live — the repository, service layer, or client?',
                        trigger_hint:
                            'candidate puts retries in multiple layers without justification',
                    },
                    {
                        text: 'How would you test this behavior without hitting production data?',
                        trigger_hint: 'candidate describes production logic only',
                    },
                ],
            },
            {
                text: 'An invoice table is queried heavily by business_id and issue_date. Walk me through how you would index it and verify the index is used.',
                category: 'technical',
                skill: 'Data integrity & persistence',
                follow_ups: [
                    {
                        text: 'What is the trade-off of adding three single-column indexes vs one composite index?',
                        trigger_hint:
                            'candidate adds indexes without discussing write amplification',
                    },
                    {
                        text: 'How would EXPLAIN ANALYZE change your decision after seeing a sequential scan?',
                        trigger_hint: 'candidate knows indexes theoretically but not measurement',
                    },
                    {
                        text: 'When might a partial index be appropriate for invoices?',
                        trigger_hint: 'candidate only discusses btree indexes',
                    },
                    {
                        text: 'How do migrations run safely if the table has millions of rows and traffic 24/7?',
                        trigger_hint:
                            'candidate suggests blocking CREATE INDEX without CONCURRENTLY or strategy',
                    },
                ],
            },
            {
                text: 'A webhook from a payment provider sometimes arrives twice with the same event ID. Describe how your service should handle it.',
                category: 'technical',
                skill: 'Data integrity & persistence',
                follow_ups: [
                    {
                        text: 'Where do you store seen event IDs and how long do you retain them?',
                        trigger_hint: 'candidate deduplicates in memory only',
                    },
                    {
                        text: 'What happens if your deduplication insert races with a duplicate delivery?',
                        trigger_hint: 'candidate ignores concurrency',
                    },
                    {
                        text: 'How do you respond to the provider so they stop retrying vs retry later?',
                        trigger_hint:
                            'candidate does not mention HTTP response semantics to the webhook caller',
                    },
                    {
                        text: 'How would you alert if duplicate events suddenly spike?',
                        trigger_hint: 'candidate handles logic but not observability',
                    },
                ],
            },
            {
                text: 'How would you structure an integration test for an endpoint that creates an invoice and publishes a domain event?',
                category: 'technical',
                skill: 'Testing, debugging & observability',
                follow_ups: [
                    {
                        text: 'What do you stub vs run for real — database, message queue, external tax API?',
                        trigger_hint: 'candidate says mock everything without trade-off reasoning',
                    },
                    {
                        text: 'How do you keep tests fast when ten suites hit the same database?',
                        trigger_hint: 'candidate uses a shared production-like DB for every test',
                    },
                    {
                        text: 'What assertion proves the audit log row was written, not just the HTTP 201?',
                        trigger_hint: 'candidate asserts status code only',
                    },
                    {
                        text: 'How do you test the case where event publishing fails after the DB commit?',
                        trigger_hint: 'candidate covers only the happy path',
                    },
                ],
            },
            {
                text: 'Production logs show intermittent 500 errors on PATCH /invoices/:id with "connection terminated unexpectedly". How do you debug?',
                category: 'technical',
                skill: 'Testing, debugging & observability',
                follow_ups: [
                    {
                        text: 'What metrics or dashboards do you check first?',
                        trigger_hint: 'candidate jumps to code changes without gathering evidence',
                    },
                    {
                        text: 'How do you tell a pool exhaustion issue from a network blip?',
                        trigger_hint: 'candidate blames PostgreSQL without isolating layers',
                    },
                    {
                        text: 'What temporary mitigation would you propose before the root cause fix ships?',
                        trigger_hint: 'candidate has no incident containment plan',
                    },
                    {
                        text: 'How do you communicate impact and ETA to customer support?',
                        trigger_hint: 'candidate focuses only on technical debugging',
                    },
                ],
            },
            {
                text: 'Describe how you would add input validation for a new endpoint using a schema library or manual checks.',
                category: 'technical',
                skill: 'REST API design & HTTP semantics',
                follow_ups: [
                    {
                        text: 'Why is server-side validation still required if the frontend already validates?',
                        trigger_hint: 'candidate trusts client validation alone',
                    },
                    {
                        text: 'What error body format helps API consumers fix requests quickly?',
                        trigger_hint: 'candidate returns plain text bad request',
                    },
                    {
                        text: 'How do you validate nested objects and optional fields without over-engineering?',
                        trigger_hint: 'candidate copies validation into every route manually',
                    },
                    {
                        text: 'Where should validation errors be logged vs returned to the client?',
                        trigger_hint: 'candidate logs PII from failed payloads in production logs',
                    },
                ],
            },
            {
                text: 'Tell me about a backend bug or production issue you encountered in a project. What happened and how did you resolve it?',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What evidence did you use to confirm it was actually a backend issue?',
                        trigger_hint: 'candidate gives a vague story without diagnostic steps',
                    },
                    {
                        text: 'Who did you involve and when?',
                        trigger_hint: 'candidate worked in isolation for days',
                    },
                    {
                        text: 'What did you change in your process so a similar bug is caught earlier next time?',
                        trigger_hint: 'candidate fixed the symptom only',
                    },
                    {
                        text: 'How did you communicate status to teammates while the issue was open?',
                        trigger_hint: 'candidate does not mention stakeholders',
                    },
                ],
            },
            {
                text: 'Describe a time you received critical feedback on code you wrote. How did you respond?',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What part of the feedback was hardest to accept and why?',
                        trigger_hint: 'candidate claims they always agree immediately',
                    },
                    {
                        text: 'How did you verify the reviewer was right before changing the code?',
                        trigger_hint: 'candidate rewrote code without understanding the concern',
                    },
                    {
                        text: 'Did the feedback change how you write similar code today? Give a concrete example.',
                        trigger_hint:
                            'candidate says feedback was useful but gives no behavior change',
                    },
                    {
                        text: "How do you give constructive feedback when you review someone else's PR?",
                        trigger_hint: 'candidate only discusses receiving feedback',
                    },
                ],
            },
            {
                text: 'You are assigned a ticket to add a field to an existing API used by three client teams. Walk me through your first day on the task.',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What questions do you ask before writing code?',
                        trigger_hint: 'candidate starts coding without discovery',
                    },
                    {
                        text: 'How do you assess whether the change is backward compatible?',
                        trigger_hint: 'candidate assumes all clients update simultaneously',
                    },
                    {
                        text: 'How would you coordinate release timing with frontend and mobile teams?',
                        trigger_hint: 'candidate ships backend first without communication plan',
                    },
                    {
                        text: 'What would you document when the ticket is done?',
                        trigger_hint: 'candidate merges PR without notes or examples',
                    },
                ],
            },
            {
                text: 'Tell me about a time you had to learn a tool or concept quickly to unblock your team.',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'How did you decide which resources were trustworthy?',
                        trigger_hint: 'candidate watched random tutorials without verification',
                    },
                    {
                        text: 'What was the smallest proof-of-concept you built to validate understanding?',
                        trigger_hint: 'candidate read docs only without hands-on validation',
                    },
                    {
                        text: 'How did you teach what you learned to another teammate?',
                        trigger_hint: 'candidate kept knowledge siloed',
                    },
                    {
                        text: 'What would you do differently if you had another 24 hours?',
                        trigger_hint: 'candidate claims perfect execution with no reflection',
                    },
                ],
            },
            {
                text: 'Describe a situation where you disagreed with a technical approach proposed by a teammate or lead.',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What data or constraints did you bring into the discussion?',
                        trigger_hint: 'candidate disagreed on preference without evidence',
                    },
                    {
                        text: 'How did you express disagreement without blocking the team?',
                        trigger_hint: 'candidate escalated emotionally or disengaged',
                    },
                    {
                        text: 'What compromise or experiment did you agree on?',
                        trigger_hint: 'candidate won or lost with no collaborative outcome',
                    },
                    {
                        text: 'Looking back, what did you learn about decision-making in a team?',
                        trigger_hint: 'candidate still believes they were obviously right',
                    },
                ],
            },
            {
                text: 'How do you balance shipping a small MVP endpoint quickly vs building it the right way on day one?',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'Give an example where you chose speed and what debt you accepted knowingly.',
                        trigger_hint: 'candidate always chooses perfection or always chooses speed',
                    },
                    {
                        text: 'What guardrails do you add even when moving fast?',
                        trigger_hint: 'candidate ships without tests or validation when rushing',
                    },
                    {
                        text: 'How do you communicate tech debt to a product manager?',
                        trigger_hint:
                            'candidate hides debt or uses jargon without impact translation',
                    },
                    {
                        text: 'When would you push back on a deadline?',
                        trigger_hint: 'candidate never pushes back or refuses every deadline',
                    },
                ],
            },
            {
                text: "Tell me about a time you made a mistake that affected someone else's work.",
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'How quickly did you surface the mistake?',
                        trigger_hint: 'candidate hoped nobody would notice',
                    },
                    {
                        text: 'What did you do to fix the immediate impact on others?',
                        trigger_hint: 'candidate apologized without remediation steps',
                    },
                    {
                        text: 'How did you prevent recurrence?',
                        trigger_hint: 'candidate blames external factors only',
                    },
                    {
                        text: 'How did the relationship with that teammate evolve afterward?',
                        trigger_hint: 'candidate does not mention interpersonal follow-up',
                    },
                ],
            },
            {
                text: 'Imagine you do not understand a requirement in a ticket titled "Support partial invoice cancellation." What do you do?',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'Who do you talk to first and what questions do you ask?',
                        trigger_hint: 'candidate guesses the requirement and implements',
                    },
                    {
                        text: 'How do you capture assumptions so they can be validated?',
                        trigger_hint: 'candidate keeps assumptions in their head',
                    },
                    {
                        text: 'At what point do you stop clarifying and start building a spike?',
                        trigger_hint: 'candidate endless researches without delivery',
                    },
                    {
                        text: 'How do you confirm the solution matches finance compliance expectations?',
                        trigger_hint: 'candidate ignores domain experts',
                    },
                ],
            },
            {
                text: 'Why do you want an internship on a regulated invoicing backend instead of a consumer app or frontend role?',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What specific backend skill do you want to strengthen in the next six months?',
                        trigger_hint: 'candidate gives generic I like coding answer',
                    },
                    {
                        text: 'How does this role fit your longer-term career goal?',
                        trigger_hint: 'candidate has no career narrative',
                    },
                    {
                        text: 'What concern do you have about working on financial data, and how would you address it?',
                        trigger_hint: 'candidate claims zero concerns',
                    },
                    {
                        text: 'What would make this internship a success for you and for LedgerBridge?',
                        trigger_hint: 'candidate defines success only in personal terms',
                    },
                ],
            },
            {
                text: 'Describe how you organize your work when you have coursework, a part-time job, and this internship.',
                category: 'behavioral',
                skill: 'Collaboration & professional communication',
                follow_ups: [
                    {
                        text: 'What do you do when internship and exam weeks collide?',
                        trigger_hint: 'candidate has no conflict plan',
                    },
                    {
                        text: 'How do you communicate availability changes to your team early?',
                        trigger_hint: 'candidate disappears without notice',
                    },
                    {
                        text: 'What tooling or habits keep your tasks visible to mentors?',
                        trigger_hint: 'candidate relies on memory alone',
                    },
                    {
                        text: 'Tell me about a time you overcommitted. What happened?',
                        trigger_hint: 'candidate claims they never overcommit',
                    },
                ],
            },
        ],
    },
    {
        slug: 'studio-lumen-nextjs-frontend',
        title: 'Intern Next.js Frontend Developer',
        role: 'Intern Next.js Frontend',
        description:
            "Studio Lumen is a boutique design agency serving fashion, hospitality, and lifestyle brands. Our engineering team builds white-label client portals where brands review creative assets, approve campaigns, and track project milestones in real time. As an Intern Next.js Frontend Developer, you'll pair with senior developers and designers to implement App Router pages, shared component libraries, and responsive layouts that match pixel-accurate Figma specs. Within your first two weeks you'll ship real client work—asset galleries, threaded comment panels, and approval workflows—not demo apps. We use TypeScript, Tailwind CSS, and shadcn/ui, with weekly design QA sessions where you'll learn how frontend quality is judged in agency delivery. Hard requirements: solid React fundamentals (components, hooks, props vs state); TypeScript in a project or coursework setting; hands-on exposure to Next.js 14+ App Router (tutorial or shipped project); Tailwind CSS for layout and styling; basic accessibility awareness (semantic HTML, keyboard focus, alt text). No prior agency experience required, but you should communicate blockers early and open PRs with before-and-after screenshots.",
        tags: [
            'nextjs',
            'app-router',
            'typescript',
            'tailwind',
            'client-portals',
            'design-systems',
            'accessibility',
        ],
        rubric: [
            {
                skill: 'Next.js App Router',
                weight: 3,
                signals: [
                    'Maps a nested client dashboard to file-based routes without mixing pages and app directories',
                    'Chooses Server Components for static portal chrome and isolates interactivity in Client Components',
                    'Uses loading.tsx or Suspense boundaries while asset metadata fetches',
                    'Explains route groups for organizing white-label portals without changing public URLs',
                    'Compares server actions versus route handlers for an approval form with concrete trade-offs',
                    'Describes revalidation or cache tags when client branding assets update',
                    'Marks components with use client only where comment-thread state requires it',
                    'References parallel or intercepting routes when describing in-place asset preview modals',
                ],
            },
            {
                skill: 'React & TypeScript UI',
                weight: 3,
                signals: [
                    'Types component props and API response shapes instead of relying on implicit any',
                    'Builds reusable gallery or comment components with clear prop contracts',
                    'Explains when local state, lifted state, or context fits a portal feature',
                    'Uses useEffect with a stated dependency array and cleanup for subscriptions',
                    'Handles empty, loading, and error UI states in the same answer',
                    'Describes conditional rendering without nesting unreadable ternary chains',
                    'Mentions key usage when rendering dynamic asset lists to avoid stale UI',
                    'Refactors duplicated JSX into composable subcomponents with named responsibilities',
                ],
            },
            {
                skill: 'CSS, layout & design fidelity',
                weight: 2,
                signals: [
                    'Translates Figma spacing tokens into Tailwind classes consistently',
                    'Builds responsive grids that collapse asset columns on tablet breakpoints',
                    'Uses flex or grid to align approval buttons without magic-number margins',
                    'Matches typography scale from design tokens rather than one-off font sizes',
                    'Describes hover, focus, and active states for interactive portal controls',
                    'Fixes overflow or truncation when long campaign titles break layouts',
                    'Compares CSS modules, Tailwind, and styled-components with a reasoned preference',
                    'Checks visual diff against Figma during PR review, not only functional behavior',
                ],
            },
            {
                skill: 'Performance & accessibility',
                weight: 2,
                signals: [
                    'Uses next/image with explicit dimensions or fill to reduce layout shift',
                    'Lazy-loads heavy gallery thumbnails below the fold',
                    'Adds aria labels or roles to icon-only approval buttons',
                    'Ensures keyboard users can tab through comment threads in logical order',
                    'Checks color contrast when brand palettes fail WCAG on secondary text',
                    'Measures LCP or CLS with Lighthouse before claiming a page is fast',
                    'Avoids shipping large client bundles by keeping static headers on the server',
                    'Describes skip links or landmark regions for screen-reader navigation in portals',
                ],
            },
            {
                skill: 'Agency collaboration & delivery',
                weight: 2,
                signals: [
                    'Posts PR descriptions with screenshots for designer sign-off',
                    'Flags ambiguous Figma specs before implementing the wrong interaction',
                    'Breaks large portal features into shippable slices with demoable milestones',
                    'Asks clarifying questions about client deadlines and scope trade-offs',
                    'Documents known limitations when a11y or perf fixes are deferred',
                    'Responds to design QA feedback without defensiveness and proposes fixes',
                    'Syncs with backend on API contract gaps before wiring approval flows',
                    'Estimates task effort honestly and escalates when a milestone is at risk',
                ],
            },
        ],
        question_bank: [
            {
                text: 'Studio Lumen ships white-label client portals on Next.js App Router. How would you structure routes for `/clients/[slug]/projects/[id]/assets`?',
                category: 'technical',
                skill: 'Next.js App Router',
                follow_ups: [
                    {
                        text: 'Where would you put a shared portal sidebar that appears on every client page?',
                        trigger_hint:
                            'candidate maps folders correctly but ignores shared layout concerns',
                    },
                    {
                        text: 'The asset page needs a modal preview without a full navigation. What App Router feature helps?',
                        trigger_hint: 'candidate describes standard routing only',
                    },
                    {
                        text: 'How do you show a skeleton while asset metadata loads on that page?',
                        trigger_hint: 'candidate does not mention loading.tsx or Suspense',
                    },
                    {
                        text: 'Client branding CSS variables differ per slug. Where do you inject them safely?',
                        trigger_hint: 'candidate treats all clients as identical static pages',
                    },
                ],
            },
            {
                text: 'When would you choose a Server Component versus a Client Component for a campaign approval button?',
                category: 'technical',
                skill: 'Next.js App Router',
                follow_ups: [
                    {
                        text: 'The button opens a confirmation dialog with local open/close state. Does that change your choice?',
                        trigger_hint:
                            'candidate picks Server Component without discussing interactivity',
                    },
                    {
                        text: 'How would you submit the approval—server action or fetch to a route handler?',
                        trigger_hint:
                            'candidate mentions client-side fetch without comparing server actions',
                    },
                    {
                        text: 'After approval, the asset list should refresh. How do you revalidate that data?',
                        trigger_hint:
                            'candidate does not discuss cache invalidation or revalidatePath',
                    },
                    {
                        text: 'What happens if you accidentally import a heavy chart library in a Server Component?',
                        trigger_hint: 'candidate conflates server and client bundle boundaries',
                    },
                ],
            },
            {
                text: 'You receive JSON asset data from our CMS API. How do you type it in TypeScript and pass it into a gallery component?',
                category: 'technical',
                skill: 'React & TypeScript UI',
                follow_ups: [
                    {
                        text: 'The API sometimes omits optional caption fields. How does your type reflect that?',
                        trigger_hint:
                            'candidate uses strict types without optional or nullable fields',
                    },
                    {
                        text: 'Would you transform API shapes in the page or inside the gallery component? Why?',
                        trigger_hint:
                            'candidate blurs data-fetching and presentation responsibilities',
                    },
                    {
                        text: 'How do you handle a union type when assets can be image or video?',
                        trigger_hint: 'candidate uses a single generic Asset type for all media',
                    },
                    {
                        text: 'What do you do when the API adds a new field mid-sprint?',
                        trigger_hint:
                            'candidate does not mention backward compatibility or gradual typing',
                    },
                ],
            },
            {
                text: 'A comment thread re-renders on every keystroke and feels sluggish. How do you diagnose and improve it?',
                category: 'technical',
                skill: 'React & TypeScript UI',
                follow_ups: [
                    {
                        text: 'Would memo, useCallback, or splitting components help first? Walk through your reasoning.',
                        trigger_hint:
                            'candidate jumps to memo without identifying the re-render cause',
                    },
                    {
                        text: 'The parent passes an inline callback to each comment row. Why might that matter?',
                        trigger_hint: 'candidate ignores prop stability',
                    },
                    {
                        text: 'When is optimizing re-renders premature for an intern-level portal feature?',
                        trigger_hint: 'candidate over-optimizes without measuring',
                    },
                    {
                        text: 'How would React DevTools help you confirm the fix worked?',
                        trigger_hint: 'candidate proposes fixes without mentioning verification',
                    },
                ],
            },
            {
                text: 'Design handed you a Figma frame with 8px spacing scale and a 12-column grid. How do you implement it in Tailwind without hard-coding random values?',
                category: 'technical',
                skill: 'CSS, layout & design fidelity',
                follow_ups: [
                    {
                        text: 'The portal must look correct at 1280px and 768px. Describe your breakpoint approach.',
                        trigger_hint: 'candidate uses fixed pixel widths only',
                    },
                    {
                        text: 'Long client names break the header layout. What CSS strategy fixes it?',
                        trigger_hint: 'candidate ignores text overflow edge cases',
                    },
                    {
                        text: 'Designers use a brand font not in Tailwind defaults. How do you add it in Next.js?',
                        trigger_hint: 'candidate does not mention next/font or token extension',
                    },
                    {
                        text: 'How do you prove in PR review that implementation matches Figma?',
                        trigger_hint: 'candidate describes coding only, not QA verification',
                    },
                ],
            },
            {
                text: 'Two portal variants share 80% of layout but swap hero and sidebar order. How do you avoid duplicating entire page files?',
                category: 'technical',
                skill: 'CSS, layout & design fidelity',
                follow_ups: [
                    {
                        text: 'Would you use composition slots, variant props, or separate route groups?',
                        trigger_hint: 'candidate copies entire pages for each variant',
                    },
                    {
                        text: 'How do shared layout styles stay consistent when variants diverge?',
                        trigger_hint: 'candidate duplicates CSS across variants',
                    },
                    {
                        text: 'Design adds a third variant next month. What makes your approach scalable?',
                        trigger_hint: 'candidate chooses a one-off structure',
                    },
                    {
                        text: 'Where do variant-specific tokens live versus global design tokens?',
                        trigger_hint: 'candidate hard-codes colors per variant inline',
                    },
                ],
            },
            {
                text: 'An asset gallery page scores poorly on LCP in Lighthouse. Walk through your investigation.',
                category: 'technical',
                skill: 'Performance & accessibility',
                follow_ups: [
                    {
                        text: 'How does next/image change your plan compared to plain img tags?',
                        trigger_hint: 'candidate ignores Next.js image optimization',
                    },
                    {
                        text: 'Hero images are high resolution but displayed small. What do you change?',
                        trigger_hint: 'candidate does not mention sizing or srcset',
                    },
                    {
                        text: 'Would you defer below-the-fold thumbnails? How?',
                        trigger_hint: 'candidate optimizes only the first image',
                    },
                    {
                        text: 'After fixes, how do you prevent regression on future gallery pages?',
                        trigger_hint: 'candidate fixes once without process',
                    },
                ],
            },
            {
                text: 'Icon-only approve and reject buttons must work for keyboard and screen-reader users. What do you implement?',
                category: 'technical',
                skill: 'Performance & accessibility',
                follow_ups: [
                    {
                        text: 'What aria attributes or visible text alternatives would you add?',
                        trigger_hint: 'candidate mentions color-only affordances',
                    },
                    {
                        text: 'How do focus styles look when brand guidelines forbid default outlines?',
                        trigger_hint: 'candidate removes focus rings entirely',
                    },
                    {
                        text: 'The buttons sit inside a list of 50 assets. How does tab order stay usable?',
                        trigger_hint: 'candidate ignores keyboard navigation at scale',
                    },
                    {
                        text: 'How would you manually test this beyond running Lighthouse?',
                        trigger_hint: 'candidate relies only on automated scores',
                    },
                ],
            },
            {
                text: 'You need to fetch client-specific branding on every portal page. Where does that fetch live in App Router, and how do you avoid waterfall requests?',
                category: 'technical',
                skill: 'Next.js App Router',
                follow_ups: [
                    {
                        text: 'Can the layout fetch branding once for all nested project routes?',
                        trigger_hint: 'candidate refetches branding on every leaf page',
                    },
                    {
                        text: 'What caching strategy avoids stale logos after a client rebrand?',
                        trigger_hint: 'candidate caches forever without revalidation',
                    },
                    {
                        text: 'How do you handle fetch failure when branding API is down?',
                        trigger_hint: 'candidate covers happy path only',
                    },
                    {
                        text: 'Would you colocate fetch with the component that consumes it? Why or why not?',
                        trigger_hint: 'candidate cannot explain data colocation trade-offs',
                    },
                ],
            },
            {
                text: 'Design wants optimistic UI when a user approves an asset, but the API can fail. How do you structure the component?',
                category: 'technical',
                skill: 'React & TypeScript UI',
                follow_ups: [
                    {
                        text: 'How do you roll back UI state if the server rejects the approval?',
                        trigger_hint: 'candidate describes optimistic update without rollback',
                    },
                    {
                        text: 'Where do you surface error messages accessibly?',
                        trigger_hint: 'candidate uses alert() or silent failure',
                    },
                    {
                        text: 'Should optimistic state live in the component or a small hook? Why?',
                        trigger_hint: 'candidate cannot separate concerns',
                    },
                    {
                        text: 'How do you prevent double-submit while the request is in flight?',
                        trigger_hint: 'candidate ignores duplicate approval edge case',
                    },
                ],
            },
            {
                text: 'Tell me about a time you received vague design or product requirements. How did you get to something buildable?',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'What questions do you ask first before writing any code?',
                        trigger_hint:
                            'candidate coded first and reworked later without structured discovery',
                    },
                    {
                        text: 'How did you document assumptions for stakeholders?',
                        trigger_hint: 'candidate kept assumptions private',
                    },
                    {
                        text: 'When did you decide to stop asking and ship a prototype instead?',
                        trigger_hint: 'candidate either over-analyzed or never validated',
                    },
                    {
                        text: 'What would you do differently in an agency client deadline crunch?',
                        trigger_hint: 'candidate does not connect story to Studio Lumen context',
                    },
                ],
            },
            {
                text: 'You open a PR for a client portal feature and the designer leaves ten UI nits. How do you respond?',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'How do you separate blockers from nice-to-haves before the client demo?',
                        trigger_hint: 'candidate treats all feedback as equal priority',
                    },
                    {
                        text: 'What does your PR description include to make design review easy?',
                        trigger_hint: 'candidate submits code-only PRs without context',
                    },
                    {
                        text: 'Tell me about a nit you pushed back on. How did you make the case?',
                        trigger_hint: 'candidate never disagrees constructively',
                    },
                    {
                        text: 'How do you avoid the same class of UI bugs on the next portal?',
                        trigger_hint: 'candidate fixes once without improving process',
                    },
                ],
            },
            {
                text: 'Describe a situation where you had to learn a new frontend tool quickly for a deadline.',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'How did you decide what to learn deeply versus copy from docs?',
                        trigger_hint: 'candidate learned randomly without prioritization',
                    },
                    {
                        text: 'Who did you ask for help, and what did you bring to that conversation?',
                        trigger_hint: 'candidate struggled alone too long',
                    },
                    {
                        text: 'How did you validate your solution was production-acceptable?',
                        trigger_hint: 'candidate shipped tutorial code unchanged',
                    },
                    {
                        text: 'What would you learn ahead of time before joining Studio Lumen?',
                        trigger_hint: 'candidate does not reflect on prep',
                    },
                ],
            },
            {
                text: 'Tell me about a bug you shipped to staging. How was it caught and what changed afterward?',
                category: 'behavioral',
                skill: 'React & TypeScript UI',
                follow_ups: [
                    {
                        text: 'How did you communicate the issue to design or PM?',
                        trigger_hint: 'candidate hid the mistake',
                    },
                    {
                        text: 'What testing or checklist would have caught it earlier?',
                        trigger_hint: 'candidate blames others without process improvement',
                    },
                    {
                        text: 'Did the fix require a refactor? How did you scope that safely?',
                        trigger_hint: 'candidate patched symptomatically only',
                    },
                    {
                        text: 'How do you balance speed for client demos with quality as an intern?',
                        trigger_hint: 'candidate gives generic answer without trade-offs',
                    },
                ],
            },
            {
                text: 'Give an example of when you advocated for an accessibility or performance improvement others deprioritized.',
                category: 'behavioral',
                skill: 'Performance & accessibility',
                follow_ups: [
                    {
                        text: 'How did you frame the impact in terms designers or PMs care about?',
                        trigger_hint: 'candidate used jargon only engineers understand',
                    },
                    {
                        text: 'What compromise did you accept when time was short?',
                        trigger_hint: 'candidate insists on all-or-nothing fixes',
                    },
                    {
                        text: 'How did you verify the improvement after shipping?',
                        trigger_hint: 'candidate claims impact without measurement',
                    },
                    {
                        text: 'What would you flag on a Studio Lumen portal in your first week?',
                        trigger_hint: 'candidate stays abstract, no concrete audit behavior',
                    },
                ],
            },
            {
                text: 'Tell me about working with someone whose feedback style clashed with yours.',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'How did you separate the feedback from your reaction to the tone?',
                        trigger_hint: 'candidate stayed defensive',
                    },
                    {
                        text: 'What changed in how you request reviews afterward?',
                        trigger_hint: 'candidate does not adapt process',
                    },
                    {
                        text: 'When did you escalate versus resolve one-on-one?',
                        trigger_hint: 'candidate escalates immediately or never',
                    },
                    {
                        text: 'How would you handle a harsh client comment on a live portal demo?',
                        trigger_hint: 'candidate ignores client-facing agency context',
                    },
                ],
            },
            {
                text: 'Describe a time you had to estimate how long a UI feature would take and missed badly.',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'What early signals told you the estimate was wrong?',
                        trigger_hint: 'candidate surprised at deadline without mid-course checks',
                    },
                    {
                        text: 'How did you communicate the slip to your team?',
                        trigger_hint: 'candidate waited until the due date',
                    },
                    {
                        text: 'What do you break down differently when estimating now?',
                        trigger_hint: 'candidate does not change approach',
                    },
                    {
                        text: 'How would you estimate a Figma-perfect asset grid for an intern sprint?',
                        trigger_hint: 'candidate still gives single-number guesses',
                    },
                ],
            },
            {
                text: 'Tell me about teaching a non-technical teammate something about how the frontend works.',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'How did you check they actually understood versus nodding along?',
                        trigger_hint: 'candidate lectured without confirmation',
                    },
                    {
                        text: 'What analogy or demo worked best?',
                        trigger_hint: 'candidate stays abstract',
                    },
                    {
                        text: 'How did that conversation change what you built?',
                        trigger_hint: 'candidate sees teaching as one-way',
                    },
                    {
                        text: 'How would you explain Server Components to a Studio Lumen designer?',
                        trigger_hint: 'candidate cannot simplify technical concepts',
                    },
                ],
            },
            {
                text: 'Share a time you noticed a small UX detail others overlooked and decided whether to fix it.',
                category: 'behavioral',
                skill: 'CSS, layout & design fidelity',
                follow_ups: [
                    {
                        text: 'What criteria help you decide if a polish item is worth the time?',
                        trigger_hint: 'candidate fixes everything or nothing',
                    },
                    {
                        text: 'How did you bring it up without scope creep?',
                        trigger_hint: 'candidate unilaterally expanded scope',
                    },
                    {
                        text: 'Did you fix it yourself or pair with design? Why?',
                        trigger_hint: 'candidate does not collaborate on UX decisions',
                    },
                    {
                        text: 'What small details would you watch for on client approval flows?',
                        trigger_hint: 'candidate gives generic UX platitudes',
                    },
                ],
            },
            {
                text: 'Tell me about balancing multiple small tasks assigned at once during a sprint.',
                category: 'behavioral',
                skill: 'Agency collaboration & delivery',
                follow_ups: [
                    {
                        text: 'How do you decide what to finish first when everything is "urgent"?',
                        trigger_hint: 'candidate multitasks randomly',
                    },
                    {
                        text: 'When do you ask a lead to reprioritize for you?',
                        trigger_hint: 'candidate never escalates or escalates instantly',
                    },
                    {
                        text: 'How do you keep partial work documented when context-switching?',
                        trigger_hint: 'candidate loses track of in-progress items',
                    },
                    {
                        text: 'What would you do if two client portals both needed fixes before Friday?',
                        trigger_hint: 'candidate ignores agency deadline pressure',
                    },
                ],
            },
        ],
    },
    {
        slug: 'harvest-cart-js-fullstack',
        title: 'Intern Javascript Fullstack Developer',
        role: 'Intern Javascript Full Stack',
        description:
            "Harvest Cart is an agritech marketplace connecting smallholder farmers with restaurants, cafés, and institutional buyers who want traceable local produce. Our intern full stack team maintains the vendor dashboard, order flow, and inventory sync tools that keep harvest windows accurate down to the hour. You'll work in JavaScript and TypeScript across React client apps and Node/Express services backed by MongoDB, pairing with a senior engineer on features like seasonal catalog updates, delivery slot booking, and SMS order alerts. This is hands-on work: you'll write API endpoints, wire forms to real data, and fix bugs reported by farmers using the app on phones in the field. Hard requirements: JavaScript and TypeScript proficiency; experience with both React (components, hooks, forms) and Node.js/Express (routing, middleware); MongoDB or another document database at tutorial-or-above level; Git and REST API fundamentals; ability to explain debugging steps clearly when blocked. We run two-week sprints with demo Fridays where interns show working slices—not slide decks.",
        tags: [
            'javascript',
            'typescript',
            'node',
            'express',
            'react',
            'mongodb',
            'agritech',
            'marketplace',
        ],
        rubric: [
            {
                skill: 'JavaScript & TypeScript fundamentals',
                weight: 3,
                signals: [
                    'Explains let/const scope and hoisting with a concrete bug example',
                    'Uses async/await and describes error propagation in try/catch',
                    'Chooses array methods intentionally and names time-complexity trade-offs simply',
                    'Distinguishes reference versus value when passing order objects into functions',
                    'Types function parameters and return values for marketplace entities',
                    'Avoids == and articulates when Number() or parseInt pitfalls appear',
                    'Describes closure use in event handlers or module patterns without vagueness',
                    'Reads stack traces to locate the failing line in Harvest Cart code paths',
                ],
            },
            {
                skill: 'Node.js APIs & Express',
                weight: 3,
                signals: [
                    'Designs REST routes for CRUD on produce listings with sensible HTTP verbs',
                    'Returns appropriate status codes for validation, auth, and not-found cases',
                    'Places validation middleware before route handlers with clear error shapes',
                    'Handles async errors so one failed query does not crash the server',
                    'Structures Express routers by domain such as orders, farmers, and deliveries',
                    'Discusses idempotency when farmers retry order submissions on poor connectivity',
                    'Logs request context without leaking PII in error responses',
                    'Compares environment config for dev staging versus field-demo deployments',
                ],
            },
            {
                skill: 'React client development',
                weight: 2,
                signals: [
                    'Builds controlled form inputs for quantity and harvest date fields',
                    'Fetches order data with loading and error UI states shown to the user',
                    'Lifts shared cart state or explains why context fits multi-step checkout',
                    'Uses keys correctly when rendering dynamic produce line items',
                    'Prevents duplicate submit while an order POST is in flight',
                    'Splits pages into components aligned with farmer versus buyer workflows',
                    'Handles empty catalog states with actionable messaging',
                    'Describes when to refetch after a mutation versus optimistic update',
                ],
            },
            {
                skill: 'MongoDB & data modeling',
                weight: 2,
                signals: [
                    'Models farmers, listings, and orders with embedded versus referenced documents',
                    'Writes queries filtering by season, region, and availability windows',
                    'Explains when compound indexes help marketplace search patterns',
                    'Discusses ObjectId references integrity when deleting a listing',
                    'Avoids unbounded array growth inside high-traffic order documents',
                    'Uses aggregation or simple joins to report weekly GMV for demos',
                    'Handles duplicate key errors when two interns seed the same SKU',
                    'Mentions transactions when moving inventory and creating an order atomically',
                ],
            },
            {
                skill: 'Teamwork & field empathy',
                weight: 2,
                signals: [
                    'Asks farmers or PM clarifying questions before assuming catalog rules',
                    'Writes PR descriptions that explain user impact on rural connectivity',
                    'Pairs with backend when API contracts block frontend progress',
                    'Admits unknowns and describes reproducible steps taken to debug',
                    'Prioritizes fixes that unblock demos for non-technical stakeholders',
                    'Documents API examples for other interns consuming new endpoints',
                    'Reflects on mobile-first constraints for users in the field',
                    'Accepts code review feedback and explains follow-up commits clearly',
                ],
            },
        ],
        question_bank: [
            {
                text: 'A farmer submits the same order twice because their connection dropped. How do you design the API and client to handle retries safely?',
                category: 'technical',
                skill: 'Node.js APIs & Express',
                follow_ups: [
                    {
                        text: 'Where would you store an idempotency key and how long should it live?',
                        trigger_hint: 'candidate mentions deduplication vaguely without storage',
                    },
                    {
                        text: 'What HTTP status should the second identical request return?',
                        trigger_hint: 'candidate returns 500 or creates duplicate orders',
                    },
                    {
                        text: 'How does the React form disable double-submit while waiting?',
                        trigger_hint: 'candidate focuses only on backend',
                    },
                    {
                        text: 'How would you test this behavior in a sprint demo environment?',
                        trigger_hint: 'candidate has no verification plan',
                    },
                ],
            },
            {
                text: 'Design REST endpoints for farmers to publish a produce listing with price, unit, harvest window, and quantity available.',
                category: 'technical',
                skill: 'Node.js APIs & Express',
                follow_ups: [
                    {
                        text: 'How do you validate that harvest_end is after harvest_start?',
                        trigger_hint: 'candidate validates field types only',
                    },
                    {
                        text: 'What happens when a restaurant tries to order more than quantity available?',
                        trigger_hint: 'candidate ignores concurrency on inventory',
                    },
                    {
                        text: 'Would you use PATCH or PUT for partial listing updates? Why?',
                        trigger_hint: 'candidate picks verbs without HTTP semantics',
                    },
                    {
                        text: 'What error JSON shape helps the mobile client show field-level messages?',
                        trigger_hint: 'candidate returns plain text errors',
                    },
                ],
            },
            {
                text: 'Explain the difference between callbacks, promises, and async/await using a Harvest Cart order fetch example.',
                category: 'technical',
                skill: 'JavaScript & TypeScript fundamentals',
                follow_ups: [
                    {
                        text: 'How do you run two independent fetches—catalog and delivery slots—in parallel?',
                        trigger_hint: 'candidate awaits sequentially without reason',
                    },
                    {
                        text: 'What happens if the order fetch rejects and nothing catches it in Express?',
                        trigger_hint: 'candidate ignores unhandled rejections',
                    },
                    {
                        text: 'When would you still use Promise.allSettled instead of Promise.all here?',
                        trigger_hint: 'candidate treats all parallel patterns as identical',
                    },
                    {
                        text: 'How would you type the fetch response in TypeScript?',
                        trigger_hint: 'candidate stays in untyped JavaScript',
                    },
                ],
            },
            {
                text: 'You have an array of order line items and need totals by produce category. Walk through your approach.',
                category: 'technical',
                skill: 'JavaScript & TypeScript fundamentals',
                follow_ups: [
                    {
                        text: 'Which array methods do you choose and why not a manual for loop?',
                        trigger_hint: 'candidate cannot justify method choice',
                    },
                    {
                        text: 'How do you handle malformed items missing a category field?',
                        trigger_hint: 'candidate assumes perfect data',
                    },
                    {
                        text: 'Does your solution mutate the original array? Should it?',
                        trigger_hint: 'candidate mutates shared state unexpectedly',
                    },
                    {
                        text: 'How would unit tests cover edge cases like empty orders?',
                        trigger_hint: 'candidate does not mention testing',
                    },
                ],
            },
            {
                text: 'Model MongoDB collections for farmers, seasonal listings, and restaurant orders. Embed or reference—and why?',
                category: 'technical',
                skill: 'MongoDB & data modeling',
                follow_ups: [
                    {
                        text: 'A listing document grows with hundreds of historical price changes. What breaks?',
                        trigger_hint: 'candidate embeds unbounded history',
                    },
                    {
                        text: 'How do you query all open orders for tomatoes this week efficiently?',
                        trigger_hint: 'candidate cannot describe indexes or filters',
                    },
                    {
                        text: 'What happens when a farmer deletes a listing that active orders reference?',
                        trigger_hint: 'candidate ignores referential integrity',
                    },
                    {
                        text: 'When would you use a transaction across inventory decrement and order creation?',
                        trigger_hint:
                            'candidate updates inventory and orders separately without atomicity',
                    },
                ],
            },
            {
                text: 'Orders-by-region reports are slow after harvest season peaks. How do you investigate in MongoDB?',
                category: 'technical',
                skill: 'MongoDB & data modeling',
                follow_ups: [
                    {
                        text: 'What does explain() show you and what would you look for?',
                        trigger_hint: 'candidate guesses indexes without measurement',
                    },
                    {
                        text: 'Would a compound index on region and createdAt help? In what order?',
                        trigger_hint: 'candidate adds indexes randomly',
                    },
                    {
                        text: 'Could aggregation pipeline order of stages cause unnecessary work?',
                        trigger_hint: 'candidate never mentions pipeline design',
                    },
                    {
                        text: 'When is denormalizing farmer region onto orders worth the trade-off?',
                        trigger_hint: 'candidate only knows normalized models',
                    },
                ],
            },
            {
                text: 'Build the restaurant checkout form: delivery slot select, line items, and submit. What state lives where in React?',
                category: 'technical',
                skill: 'React client development',
                follow_ups: [
                    {
                        text: 'How do you show validation errors from the Express API on specific fields?',
                        trigger_hint: 'candidate shows generic alert only',
                    },
                    {
                        text: 'What loading UX do farmers on 3G see while submit is pending?',
                        trigger_hint: 'candidate ignores slow network context',
                    },
                    {
                        text: 'Would you lift order state to context? When is that overkill?',
                        trigger_hint: 'candidate uses context for everything',
                    },
                    {
                        text: 'How do you reset the form after a successful order?',
                        trigger_hint: 'candidate leaves stale UI state',
                    },
                ],
            },
            {
                text: 'The vendor dashboard lists live inventory but data feels stale after another user sells the last crate. How do you refresh UI state?',
                category: 'technical',
                skill: 'React client development',
                follow_ups: [
                    {
                        text: 'Polling, manual refresh, or websockets—which fits an intern MVP and why?',
                        trigger_hint: 'candidate picks websockets without complexity analysis',
                    },
                    {
                        text: 'How do you avoid hammering the API on a timer every second?',
                        trigger_hint: 'candidate proposes aggressive polling',
                    },
                    {
                        text: 'What optimistic UI risks exist when two buyers grab the last unit?',
                        trigger_hint: 'candidate optimistic updates without conflict handling',
                    },
                    {
                        text: 'How does the server signal insufficient inventory on concurrent orders?',
                        trigger_hint: 'candidate ignores race conditions',
                    },
                ],
            },
            {
                text: 'Where should input validation live for a new farmer onboarding form—client, server, or both? What does each layer check?',
                category: 'technical',
                skill: 'Node.js APIs & Express',
                follow_ups: [
                    {
                        text: 'Can a malicious client bypass frontend validation? What is your example?',
                        trigger_hint: 'candidate trusts client-only validation',
                    },
                    {
                        text: 'How do you share validation rules between React and Express without duplicating logic?',
                        trigger_hint: 'candidate duplicates divergent rules',
                    },
                    {
                        text: 'What business rules belong on the server even if the UI enforces them?',
                        trigger_hint: 'candidate treats all rules as UI concerns',
                    },
                    {
                        text: 'How should validation errors map to HTTP status codes?',
                        trigger_hint: 'candidate returns 500 for bad input',
                    },
                ],
            },
            {
                text: 'You need middleware that attaches the authenticated farmer to req before order routes run. How do you structure it in Express?',
                category: 'technical',
                skill: 'Node.js APIs & Express',
                follow_ups: [
                    {
                        text: 'What happens when the token is expired—status code and response body?',
                        trigger_hint: 'candidate crashes or returns ambiguous errors',
                    },
                    {
                        text: 'How do you unit test a route that depends on this middleware?',
                        trigger_hint: 'candidate cannot test middleware in isolation',
                    },
                    {
                        text: 'Where do public catalog routes sit relative to auth middleware?',
                        trigger_hint: 'candidate applies auth globally without exceptions',
                    },
                    {
                        text: 'How do you avoid logging raw JWTs during debugging?',
                        trigger_hint: 'candidate logs secrets in error paths',
                    },
                ],
            },
            {
                text: 'Tell me about a time you debugged a bug that only appeared in one environment—not on your laptop.',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'What differences did you check first—data, config, or versions?',
                        trigger_hint: 'candidate guessed randomly',
                    },
                    {
                        text: 'How did you reproduce or approximate the farmer field conditions?',
                        trigger_hint: 'candidate never reproduced the issue',
                    },
                    {
                        text: 'Who did you involve and what did you show them?',
                        trigger_hint: 'candidate debugged in isolation too long',
                    },
                    {
                        text: 'What guardrail prevents that class of bug at Harvest Cart?',
                        trigger_hint: 'candidate fixed once without prevention',
                    },
                ],
            },
            {
                text: 'Describe working with a teammate whose code review comments felt harsh or unclear.',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'How did you turn vague feedback into actionable tasks?',
                        trigger_hint: 'candidate ignored the review',
                    },
                    {
                        text: 'When did you ask for a sync instead of more comment threads?',
                        trigger_hint: 'candidate escalated or avoided conversation',
                    },
                    {
                        text: 'What did you change in your next PR to make review easier?',
                        trigger_hint: 'candidate repeated the same review friction',
                    },
                    {
                        text: 'How do you review others as an intern without overstepping?',
                        trigger_hint: 'candidate does not engage in team review culture',
                    },
                ],
            },
            {
                text: 'Tell me about a time you had to explain a technical trade-off to a non-technical stakeholder.',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'How did you connect the trade-off to user impact for farmers or restaurants?',
                        trigger_hint: 'candidate used internal jargon only',
                    },
                    {
                        text: 'What options did you present and how did you recommend one?',
                        trigger_hint: 'candidate presented one solution without choices',
                    },
                    {
                        text: 'How did you confirm they understood before building?',
                        trigger_hint: 'candidate assumed alignment',
                    },
                    {
                        text: 'What Harvest Cart feature would be hardest to explain simply?',
                        trigger_hint: 'candidate stays abstract',
                    },
                ],
            },
            {
                text: 'Share a situation where you were blocked waiting for someone else. What did you do with the time?',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'At what point did you escalate the blocker?',
                        trigger_hint: 'candidate waited silently until deadline',
                    },
                    {
                        text: 'Did you start parallel work? How did you avoid wasted rework?',
                        trigger_hint: 'candidate idle without communication',
                    },
                    {
                        text: 'How did you document the blocker for sprint standup?',
                        trigger_hint: 'candidate vague in standup updates',
                    },
                    {
                        text: 'What would you do if the API schema was undecided mid-sprint?',
                        trigger_hint: 'candidate cannot adapt plan',
                    },
                ],
            },
            {
                text: 'Tell me about learning MongoDB or Express for the first time on a real task.',
                category: 'behavioral',
                skill: 'JavaScript & TypeScript fundamentals',
                follow_ups: [
                    {
                        text: 'What resources did you trust and how did you verify answers?',
                        trigger_hint: 'candidate copied Stack Overflow without understanding',
                    },
                    {
                        text: 'What smallest working slice did you ship first?',
                        trigger_hint: 'candidate big-banged the feature',
                    },
                    {
                        text: 'What mistake did you make early and how was it caught?',
                        trigger_hint: 'candidate claims flawless learning',
                    },
                    {
                        text: 'How would you onboard another intern to our stack in one week?',
                        trigger_hint: 'candidate cannot teach back',
                    },
                ],
            },
            {
                text: 'Describe a time you cut scope to hit a demo deadline. What did you ship and what waited?',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'How did you communicate deferred work to the team?',
                        trigger_hint: 'candidate quietly dropped features',
                    },
                    {
                        text: 'What quality bar did you refuse to compromise even when rushed?',
                        trigger_hint: 'candidate cut corners on data integrity',
                    },
                    {
                        text: 'How did you ticket follow-up work so it was not forgotten?',
                        trigger_hint: 'candidate left deferred work untracked',
                    },
                    {
                        text: 'What would you defer on a Harvest Cart demo Friday?',
                        trigger_hint: 'candidate cannot prioritize marketplace features',
                    },
                ],
            },
            {
                text: 'Tell me about receiving feedback that your UI was confusing for mobile users.',
                category: 'behavioral',
                skill: 'React client development',
                follow_ups: [
                    {
                        text: 'How did you reproduce the issue on a phone or emulator?',
                        trigger_hint: 'candidate fixed blindly on desktop',
                    },
                    {
                        text: 'What changes did you make beyond shrinking fonts?',
                        trigger_hint: 'candidate cosmetic fixes only',
                    },
                    {
                        text: 'How did you validate the fix with the person who reported it?',
                        trigger_hint: 'candidate closed ticket without verification',
                    },
                    {
                        text: 'What mobile patterns will you default to at Harvest Cart?',
                        trigger_hint: 'candidate generic answer without field empathy',
                    },
                ],
            },
            {
                text: 'Give an example of asking a clarifying question that prevented building the wrong feature.',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'What assumption were you about to encode in code?',
                        trigger_hint: 'candidate rarely asks questions',
                    },
                    {
                        text: 'Who did you ask and how did you phrase the question?',
                        trigger_hint: 'candidate vague about communication',
                    },
                    {
                        text: 'What changed in the implementation after the answer?',
                        trigger_hint: 'candidate question did not affect design',
                    },
                    {
                        text: 'What domain question would you ask about seasonal produce rules?',
                        trigger_hint: 'candidate ignores agritech context',
                    },
                ],
            },
            {
                text: 'Tell me about a time you made a data mistake—wrong field, bad migration, or incorrect query.',
                category: 'behavioral',
                skill: 'MongoDB & data modeling',
                follow_ups: [
                    {
                        text: 'How did you detect the mistake and assess blast radius?',
                        trigger_hint: 'candidate discovered via user complaint only',
                    },
                    {
                        text: 'What did you do to fix existing records safely?',
                        trigger_hint: 'candidate patched forward without remediation',
                    },
                    {
                        text: 'How did you communicate to the team during recovery?',
                        trigger_hint: 'candidate hid the incident',
                    },
                    {
                        text: 'What check would you add before similar changes at Harvest Cart?',
                        trigger_hint: 'candidate no process improvement',
                    },
                ],
            },
            {
                text: 'Describe how you prepare for sprint demo Friday when your feature is half-done.',
                category: 'behavioral',
                skill: 'Teamwork & field empathy',
                follow_ups: [
                    {
                        text: 'What demo narrative do you tell if backend works but UI is rough?',
                        trigger_hint: 'candidate cancels demo without plan',
                    },
                    {
                        text: 'How do you seed or stub data so farmers see realistic flows?',
                        trigger_hint: 'candidate demos empty states only',
                    },
                    {
                        text: 'How do you handle live questions you cannot answer?',
                        trigger_hint: 'candidate bluffs instead of admitting gaps',
                    },
                    {
                        text: 'What will you show in your first Harvest Cart intern demo?',
                        trigger_hint: 'candidate cannot articulate demo goals',
                    },
                ],
            },
        ],
    },
    {
        slug: 'neural-orchard-ai-researcher',
        title: 'Intern Artificial Intelligence Researcher (Python)',
        role: 'Intern AI Researcher',
        description:
            "Neural Orchard is an applied machine learning lab focused on document understanding for legal, insurance, and compliance teams drowning in unstructured PDFs. Our interns work on the research pipeline—not just notebooks in isolation—alongside ML engineers who ship models to staging every sprint. You'll write Python for data cleaning, labeling workflows, baseline classifiers, and evaluation scripts on tasks like clause extraction, entity linking, and semantic search over scanned contracts. Expect real messiness: OCR noise, class imbalance, and labels disagreed on by domain experts. Hard requirements: Python 3.10+; NumPy and pandas for data manipulation; completed coursework or project with supervised learning (train/validation split, metrics); hands-on exposure to PyTorch or TensorFlow; ability to read experiment tracebacks and document results in plain language. We use Hugging Face transformers and Weights & Biases for experiment tracking. Ideal for final-year students or early-career researchers who favor careful evaluation over leaderboard chasing.",
        tags: [
            'python',
            'pytorch',
            'nlp',
            'document-understanding',
            'huggingface',
            'experiment-tracking',
            'ocr',
        ],
        rubric: [
            {
                skill: 'Python for ML pipelines',
                weight: 3,
                signals: [
                    'Structures training scripts with argparse or config files for reproducible runs',
                    'Uses virtual environments and pins dependency versions for shared lab setups',
                    'Vectorizes pandas operations instead of slow row-wise Python loops on large CSVs',
                    'Handles file I/O for PDF text layers and OCR JSON without loading everything into RAM',
                    'Writes functions with type hints and docstrings for dataset loaders teammates reuse',
                    'Catches and logs exceptions in batch jobs without silently dropping failed documents',
                    'Organizes modules for data, models, metrics, and training entrypoints clearly',
                    'Profiles a hot loop with timing or line_profiler before optimizing',
                ],
            },
            {
                skill: 'NLP & document understanding',
                weight: 3,
                signals: [
                    'Explains tokenization truncation effects on long legal clauses',
                    'Chooses encoder models appropriate for extraction versus embedding tasks',
                    'Describes BIO or JSON span labeling schemes for entity extraction',
                    'Handles OCR errors with normalization or robust augmentation strategies',
                    'Compares fine-tuning versus prompting with cost and latency trade-offs',
                    'Uses attention to interpret mispredictions on at least one concrete example',
                    'Discusses multilingual or domain-specific vocabulary challenges in contracts',
                    'Implements chunking or sliding windows when documents exceed model context',
                ],
            },
            {
                skill: 'Experiment design & evaluation',
                weight: 3,
                signals: [
                    'Splits train/val/test by document ID to prevent leakage across pages',
                    'Reports precision, recall, and F1 with macro versus micro justification',
                    'Runs baselines such as regex, TF-IDF, or zero-shot before deep models',
                    'Tracks seeds and hyperparameters so results can be reproduced',
                    'Uses confusion matrices or error buckets to guide next experiments',
                    'Defines success criteria with PM before tuning for marginal benchmark gains',
                    'Compares statistical noise across small validation sets honestly',
                    'Documents ablation outcomes showing which change actually moved metrics',
                ],
            },
            {
                skill: 'Data labeling & preprocessing',
                weight: 2,
                signals: [
                    'Designs labeling guidelines resolving ambiguous entity boundaries',
                    'Measures inter-annotator agreement and escalates inconsistent classes',
                    'Balances classes via sampling or loss weighting with stated trade-offs',
                    'Audits label noise by reviewing high-loss or uncertain predictions',
                    'Versioned datasets with hashes or DVC-style references for experiment traceability',
                    'Anonymizes PII in sample notebooks shared outside the lab',
                    'Validates OCR text quality thresholds before expensive labeling spend',
                    'Creates stratified splits reflecting rare clause types in production',
                ],
            },
            {
                skill: 'Research communication & integrity',
                weight: 2,
                signals: [
                    'Summarizes experiment outcomes in non-technical language for product partners',
                    'Admits negative results and explains why a hypothesis failed',
                    'Cites prior work or Hugging Face model cards when adopting architectures',
                    'Avoids test-set peeking when iterating on model selection',
                    'Visualizes errors with representative document snippets not only metrics',
                    'Estimates GPU hours and proposes cheaper smoke tests for interns',
                    'Writes README steps another intern can follow to rerun training',
                    'Escalates ethical concerns such as biased training corpora or PII retention',
                ],
            },
        ],
        question_bank: [
            {
                text: 'You inherit 40,000 insurance PDFs with OCR text and noisy labels for clause types. What is your first week pipeline plan?',
                category: 'technical',
                skill: 'Data labeling & preprocessing',
                follow_ups: [
                    {
                        text: 'How do you decide which documents to manually audit before training?',
                        trigger_hint: 'candidate jumps to fine-tuning without data audit',
                    },
                    {
                        text: 'What quality checks catch duplicated or truncated OCR pages?',
                        trigger_hint: 'candidate trusts OCR input blindly',
                    },
                    {
                        text: 'How do you version the cleaned dataset for experiments?',
                        trigger_hint: 'candidate overwrites CSVs without tracking',
                    },
                    {
                        text: 'When do you pause and fix guidelines versus push more labels?',
                        trigger_hint: 'candidate scales labeling despite disagreement',
                    },
                ],
            },
            {
                text: 'Explain how you prevent train/validation leakage when pages from the same contract appear multiple times.',
                category: 'technical',
                skill: 'Experiment design & evaluation',
                follow_ups: [
                    {
                        text: 'What split unit do you choose—page, document, or client account—and why?',
                        trigger_hint: 'candidate splits rows randomly',
                    },
                    {
                        text: 'How would leakage inflate your F1 score in deployment?',
                        trigger_hint: 'candidate knows split but not impact',
                    },
                    {
                        text: 'How do you verify the split script is correct with a spot check?',
                        trigger_hint: 'candidate no validation of split logic',
                    },
                    {
                        text: 'Rare clause types appear in only three contracts. How does that affect splitting?',
                        trigger_hint: 'candidate ignores long-tail classes',
                    },
                ],
            },
            {
                text: 'Compare fine-tuning a small encoder versus using a large LLM with prompting for clause extraction.',
                category: 'technical',
                skill: 'NLP & document understanding',
                follow_ups: [
                    {
                        text: 'How do latency and cost differ at inference for 500-page policies?',
                        trigger_hint: 'candidate ignores production constraints',
                    },
                    {
                        text: 'What labeled data volume makes fine-tuning worth it in your view?',
                        trigger_hint: 'candidate chooses fine-tune without data threshold',
                    },
                    {
                        text: 'How do you evaluate hallucinations from the LLM approach?',
                        trigger_hint: 'candidate treats LLM outputs as ground truth',
                    },
                    {
                        text: 'When would you hybridize both approaches in Neural Orchard pipeline?',
                        trigger_hint: 'candidate binary choice without pipeline thinking',
                    },
                ],
            },
            {
                text: 'A scanned contract exceeds the transformer context window. How do you process it end-to-end?',
                category: 'technical',
                skill: 'NLP & document understanding',
                follow_ups: [
                    {
                        text: 'How do you merge predictions from overlapping chunks without double-counting entities?',
                        trigger_hint: 'candidate chunks naively without merge strategy',
                    },
                    {
                        text: 'Where might boundary clauses get cut in half and how do you mitigate?',
                        trigger_hint: 'candidate ignores boundary errors',
                    },
                    {
                        text: 'Do you prioritize sliding window, hierarchical, or retrieval-first designs? Why?',
                        trigger_hint: 'candidate one approach without trade-offs',
                    },
                    {
                        text: 'How do you benchmark chunking strategies fairly?',
                        trigger_hint: 'candidate no evaluation plan for chunking',
                    },
                ],
            },
            {
                text: 'Your classifier hits 92% accuracy but attorneys reject it in review. What metrics and analyses do you run next?',
                category: 'technical',
                skill: 'Experiment design & evaluation',
                follow_ups: [
                    {
                        text: 'Why might accuracy mislead on imbalanced clause types?',
                        trigger_hint: 'candidate sticks to accuracy only',
                    },
                    {
                        text: 'How do you build an error taxonomy from mispredicted examples?',
                        trigger_hint: 'candidate tweaks hyperparameters without error analysis',
                    },
                    {
                        text: 'Which clause types would you prioritize improving first and how do you decide?',
                        trigger_hint: 'candidate optimizes global metric only',
                    },
                    {
                        text: 'How do you present findings so PM can choose ship versus iterate?',
                        trigger_hint: 'candidate report metrics without recommendations',
                    },
                ],
            },
            {
                text: 'Walk through implementing a reproducible training script that logs loss and F1 to Weights & Biases.',
                category: 'technical',
                skill: 'Python for ML pipelines',
                follow_ups: [
                    {
                        text: 'What do you log besides headline metrics so runs are comparable?',
                        trigger_hint: 'candidate logs loss only',
                    },
                    {
                        text: 'How do you set seeds across Python, NumPy, and PyTorch?',
                        trigger_hint: 'candidate ignores reproducibility details',
                    },
                    {
                        text: 'How would another intern rerun your experiment from a fresh clone?',
                        trigger_hint: 'candidate hard-codes local paths',
                    },
                    {
                        text: 'What smoke-test subset saves GPU hours during development?',
                        trigger_hint: 'candidate trains full dataset every debug iteration',
                    },
                ],
            },
            {
                text: 'Two annotators disagree on whether a liability phrase is one entity or two. How do you resolve it in guidelines?',
                category: 'technical',
                skill: 'Data labeling & preprocessing',
                follow_ups: [
                    {
                        text: 'What inter-annotator metric would you track and what threshold triggers review?',
                        trigger_hint: 'candidate ignores agreement measurement',
                    },
                    {
                        text: 'How do ambiguous cases become few-shot examples in docs?',
                        trigger_hint: 'candidate resolves ad hoc each time',
                    },
                    {
                        text: 'Do you drop ambiguous labels or map to an "unknown" class? Trade-offs?',
                        trigger_hint: 'candidate forces binary labels',
                    },
                    {
                        text: 'How do guideline changes affect already labeled data?',
                        trigger_hint: 'candidate never relabels or versioning',
                    },
                ],
            },
            {
                text: 'Design a baseline for semantic search over clauses using embeddings before jumping to cross-encoders.',
                category: 'technical',
                skill: 'NLP & document understanding',
                follow_ups: [
                    {
                        text: 'How do you index vectors and retrieve top-k at query time?',
                        trigger_hint: 'candidate vague on retrieval stack',
                    },
                    {
                        text: 'What failure modes do bi-encoders show on rare legal terms?',
                        trigger_hint: 'candidate assumes embeddings always work',
                    },
                    {
                        text: 'How do you evaluate retrieval with labeled query-clause pairs?',
                        trigger_hint: 'candidate no retrieval metrics',
                    },
                    {
                        text: 'When would you add reranking and how much lift justifies complexity?',
                        trigger_hint: 'candidate adds reranker without justification',
                    },
                ],
            },
            {
                text: 'You notice GPU memory errors when increasing batch size. What do you try before giving up on the experiment?',
                category: 'technical',
                skill: 'Python for ML pipelines',
                follow_ups: [
                    {
                        text: 'How do gradient accumulation and smaller batch interact with learning rate?',
                        trigger_hint: 'candidate lowers batch only without LR discussion',
                    },
                    {
                        text: 'Would mixed precision or gradient checkpointing help here? Why?',
                        trigger_hint: 'candidate unaware of memory techniques',
                    },
                    {
                        text: 'How do you confirm OOM is batch-related versus a memory leak?',
                        trigger_hint: 'candidate guesses without profiling',
                    },
                    {
                        text: 'What is your fallback on CPU-only intern hardware?',
                        trigger_hint: 'candidate blocked without GPU',
                    },
                ],
            },
            {
                text: 'How would you detect and handle PII in training notebooks shared with the product team?',
                category: 'technical',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'What automated redaction tools or regexes would you start with?',
                        trigger_hint: 'candidate manual eyeballing only',
                    },
                    {
                        text: 'Where might regex redaction fail on legal documents?',
                        trigger_hint: 'candidate overconfident in regex',
                    },
                    {
                        text: 'How do you store artifacts so staging models do not leak sensitive snippets?',
                        trigger_hint: 'candidate commits sample outputs to git',
                    },
                    {
                        text: 'When do you escalate to legal or security at Neural Orchard?',
                        trigger_hint: 'candidate handles PII alone silently',
                    },
                ],
            },
            {
                text: 'Tell me about an experiment that failed to beat a simple baseline. What did you learn?',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'How did you document negative results for the team?',
                        trigger_hint: 'candidate hid failed experiments',
                    },
                    {
                        text: 'What would you try differently with one more week—not one more GPU?',
                        trigger_hint: 'candidate only asks for more compute',
                    },
                    {
                        text: 'How did you explain the outcome to a non-research stakeholder?',
                        trigger_hint: 'candidate jargon-heavy summary',
                    },
                    {
                        text: 'When is it right to stop pursuing a fancy model at Neural Orchard?',
                        trigger_hint: 'candidate chases complexity regardless',
                    },
                ],
            },
            {
                text: 'Describe a time you discovered a bug in your own evaluation code that changed conclusions.',
                category: 'behavioral',
                skill: 'Experiment design & evaluation',
                follow_ups: [
                    {
                        text: 'How did you verify which past runs were affected?',
                        trigger_hint: 'candidate fixed forward only',
                    },
                    {
                        text: 'Who did you notify and how quickly after discovery?',
                        trigger_hint: 'candidate delayed disclosure',
                    },
                    {
                        text: 'What test now guards that metric calculation?',
                        trigger_hint: 'candidate no regression test',
                    },
                    {
                        text: 'How do you balance speed and correctness on intern deadlines?',
                        trigger_hint: 'candidate dismisses rigor',
                    },
                ],
            },
            {
                text: 'Tell me about reading a research paper and applying one idea to a practical task.',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'How did you decide the paper was worth reproducing versus hype?',
                        trigger_hint: 'candidate follows trends uncritically',
                    },
                    {
                        text: 'What differed between paper setup and Neural Orchard data reality?',
                        trigger_hint: 'candidate expected exact reproduction',
                    },
                    {
                        text: 'How did you credit the source in your write-up?',
                        trigger_hint: 'candidate no attribution',
                    },
                    {
                        text: 'What did you simplify for the intern timeline?',
                        trigger_hint: 'candidate all-or-nothing implementation',
                    },
                ],
            },
            {
                text: 'Share a situation where labeling budget was limited. How did you prioritize what to label next?',
                category: 'behavioral',
                skill: 'Data labeling & preprocessing',
                follow_ups: [
                    {
                        text: 'Did you use model uncertainty or random sampling? Why?',
                        trigger_hint: 'candidate random only without strategy',
                    },
                    {
                        text: 'How did you involve domain experts efficiently?',
                        trigger_hint: 'candidate wasted senior attorney time',
                    },
                    {
                        text: 'What metric improvement justified more labeling spend?',
                        trigger_hint: 'candidate no ROI framing',
                    },
                    {
                        text: 'How would you prioritize rare clause types versus volume?',
                        trigger_hint: 'candidate ignores business priority',
                    },
                ],
            },
            {
                text: 'Tell me about collaborating with an engineer who wanted to ship your model before you were confident.',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'What evidence did you bring to the conversation—metrics, slices, or examples?',
                        trigger_hint: 'candidate vague discomfort without data',
                    },
                    {
                        text: 'What compromise ship criteria did you agree on?',
                        trigger_hint: 'candidate blocked entirely or caved entirely',
                    },
                    {
                        text: 'How did you monitor the model after a cautious release?',
                        trigger_hint: 'candidate no post-ship plan',
                    },
                    {
                        text: 'How do you phrase risk in terms compliance teams understand?',
                        trigger_hint: 'candidate ML jargon only',
                    },
                ],
            },
            {
                text: 'Describe a time you had to learn PyTorch or Hugging Face quickly for a sprint milestone.',
                category: 'behavioral',
                skill: 'Python for ML pipelines',
                follow_ups: [
                    {
                        text: 'What minimal working example did you build first?',
                        trigger_hint: 'candidate big-banged custom architecture',
                    },
                    {
                        text: 'How did you debug shape mismatches systematically?',
                        trigger_hint: 'candidate trial-and-error randomly',
                    },
                    {
                        text: 'Who did you ask for help and what did you try before asking?',
                        trigger_hint: 'candidate no self-debugging',
                    },
                    {
                        text: 'What would you study before day one at Neural Orchard?',
                        trigger_hint: 'candidate no prep plan',
                    },
                ],
            },
            {
                text: 'Tell me about presenting technical results to a product manager who asked "but does it work for real users?"',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'What qualitative examples did you show beyond charts?',
                        trigger_hint: 'candidate slides metrics-only',
                    },
                    {
                        text: 'How did you translate F1 into review-time saved or error risk?',
                        trigger_hint: 'candidate cannot connect metrics to product',
                    },
                    {
                        text: 'What honest limitations did you disclose upfront?',
                        trigger_hint: 'candidate oversold the model',
                    },
                    {
                        text: 'How would you demo clause extraction on a messy scanned PDF live?',
                        trigger_hint: 'candidate only demos clean samples',
                    },
                ],
            },
            {
                text: 'Give an example of questioning whether training data reflects production diversity.',
                category: 'behavioral',
                skill: 'Data labeling & preprocessing',
                follow_ups: [
                    {
                        text: 'What groups or document sources were underrepresented?',
                        trigger_hint: 'candidate never audits representativeness',
                    },
                    {
                        text: 'What harm could deployment cause if bias persisted?',
                        trigger_hint: 'candidate technical-only view',
                    },
                    {
                        text: 'What data would you collect next to close the gap?',
                        trigger_hint: 'candidate no remediation plan',
                    },
                    {
                        text: 'How do you flag ethical concerns in lab standups?',
                        trigger_hint: 'candidate stays silent on ethics',
                    },
                ],
            },
            {
                text: 'Tell me about juggling coursework or another job while meeting lab experiment deadlines.',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'How did you communicate slip risk early?',
                        trigger_hint: 'candidate missed deadline silently',
                    },
                    {
                        text: 'What tasks did you defer that did not block the team?',
                        trigger_hint: 'candidate wrong prioritization',
                    },
                    {
                        text: 'How did you keep notebooks documented when interrupted mid-experiment?',
                        trigger_hint: 'candidate lost context after breaks',
                    },
                    {
                        text: 'What boundary would you set to keep lab commitments sustainable?',
                        trigger_hint: 'candidate burnout without planning',
                    },
                ],
            },
            {
                text: 'Describe receiving harsh feedback on a write-up or notebook clarity from a senior researcher.',
                category: 'behavioral',
                skill: 'Research communication & integrity',
                follow_ups: [
                    {
                        text: 'What concrete changes did you make to the next experiment doc?',
                        trigger_hint: 'candidate ignored feedback',
                    },
                    {
                        text: 'How do you structure READMEs so others rerun your work?',
                        trigger_hint: 'candidate still cryptic notes',
                    },
                    {
                        text: 'What checklist do you use before sharing results now?',
                        trigger_hint: 'candidate no self-review process',
                    },
                    {
                        text: 'How would you document an intern project at Neural Orchard end-to-end?',
                        trigger_hint: 'candidate cannot articulate documentation standards',
                    },
                ],
            },
        ],
    },

    {
        slug: 'sprintwell-trainee-pm',
        title: 'Trainee Product Manager (SCRUM)',
        role: 'Trainee Product Manager',
        description:
            "Sprintwell builds a SaaS product management platform for software teams—backlogs, sprint boards, retros, and roadmap views used by distributed squads. As a Trainee Product Manager, you'll shadow a senior PM and own small vertical slices: writing user stories, refining acceptance criteria, facilitating standups, and translating customer feedback into prioritized backlog items. You'll partner with design and engineering in two-week Scrum cycles, learning to say no with data, run discovery calls with trial accounts, and keep stakeholders aligned when scope shifts. Hard requirements: working understanding of Scrum (ceremonies, roles, sprint cadence); experience writing user stories with acceptance criteria (academic, volunteer, or professional); hands-on use of Jira, Linear, or an equivalent ticket tool; strong written communication for async updates; comfort reading basic API or UX flow documentation to write testable requirements. You don't need to code, but you should ask engineers what would make a story simpler to ship. Clear async writing matters as much as live workshop skills.",
        tags: [
            'product-management',
            'scrum',
            'agile',
            'saas',
            'user-stories',
            'roadmapping',
            'remote-teams',
            'discovery',
        ],
        rubric: [
            {
                skill: 'Scrum ceremonies & agile delivery',
                weight: 3,
                signals: [
                    'Facilitates standup keeping updates to blockers, plan, and progress without status monologues',
                    'Timeboxes refinement and moves unresolved spikes to explicit follow-ups',
                    'Writes sprint goals connecting backlog items to a demoable outcome',
                    'Distinguishes story points as team estimate versus hour tracking',
                    'Surfaces impediments to scrum master or lead with proposed options',
                    'Prepares retro agendas with data on escaped defects or carryover work',
                    'Protects sprint scope by deferring new asks to backlog with stakeholder note',
                    'Coordinates sprint review demo order so dependent features flow logically',
                ],
            },
            {
                skill: 'Product discovery & requirements',
                weight: 3,
                signals: [
                    'Turns customer quotes into problem statements separate from requested solutions',
                    'Writes user stories with role, need, and testable acceptance criteria',
                    'Asks edge-case questions about permissions, empty states, and error paths',
                    'Runs lightweight prototype or concierge tests before committing eng weeks',
                    'Documents assumptions and open questions in ticket descriptions visibly',
                    'Prioritizes discovery on high-uncertainty features before UI polish',
                    'Maps user journeys for remote PM workflows in Sprintwell context',
                    'Validates requirements with design and QA before sprint commitment',
                ],
            },
            {
                skill: 'Roadmapping & prioritization',
                weight: 2,
                signals: [
                    'Uses RICE or similar framework with explicit reach and confidence inputs',
                    'Separates NOW-NEXT-LATER horizons without overpromising dates',
                    'Balances tech debt, growth experiments, and enterprise commitments transparently',
                    'Revisits priorities when activation or retention metrics shift',
                    'Communicates trade-offs when sales requests a custom integration',
                    'Links backlog items to OKRs or north-star metric movement',
                    'Avoids priority thrash by batching stakeholder requests weekly',
                    'Creates kill criteria for experiments that fail leading indicators',
                ],
            },
            {
                skill: 'SaaS metrics & product analytics',
                weight: 2,
                signals: [
                    'Defines funnel steps for trial-to-paid with event names engineers can implement',
                    'Interprets cohort retention charts without confusing vanity signup counts',
                    'Segments users by team size or plan tier before drawing conclusions',
                    'Pairs qualitative interview insights with quantitative drop-off points',
                    'Sets success metrics before launch not after disappointing results',
                    'Questions sample size when A/B tests on small SaaS traffic',
                    'Uses dashboards to spot retro feature adoption not only revenue',
                    'Escalates data gaps when analytics cannot answer a prioritization question',
                ],
            },
            {
                skill: 'Stakeholder communication & influence',
                weight: 2,
                signals: [
                    'Summarizes decisions in writing with owner, deadline, and rationale',
                    'Translates engineering estimates into customer-facing timeline language carefully',
                    'De-escalates conflicting requests by reframing around shared outcomes',
                    'Runs async updates for remote execs across time zones',
                    'Says no with alternatives instead of vague we-will-see responses',
                    'Prepares release notes customers understand without internal jargon',
                    'Builds trust with engineers by bringing reproducible bug context',
                    'Follows up on action items from retros with visible ticket links',
                ],
            },
        ],
        question_bank: [
            {
                text: 'Sprintwell trial users abandon onboarding at the invite teammates step. Walk me through your first discovery week.',
                category: 'technical',
                skill: 'Product discovery & requirements',
                follow_ups: [
                    {
                        text: 'What qualitative and quantitative sources do you pull before proposing solutions?',
                        trigger_hint: 'candidate jumps to UI redesign without discovery',
                    },
                    {
                        text: 'How do you form a problem statement distinct from add a skip button?',
                        trigger_hint: 'candidate solutionizes immediately',
                    },
                    {
                        text: 'What hypotheses would you test with five user interviews?',
                        trigger_hint: 'candidate generic interviews without script',
                    },
                    {
                        text: 'When do you involve engineering versus running a no-code test first?',
                        trigger_hint: 'candidate schedules sprint work before validation',
                    },
                ],
            },
            {
                text: 'Write a user story for bulk-editing sprint labels on the board. Include acceptance criteria engineers can test.',
                category: 'technical',
                skill: 'Product discovery & requirements',
                follow_ups: [
                    {
                        text: 'What edge cases around permissions or concurrent edits belong in criteria?',
                        trigger_hint: 'candidate happy-path criteria only',
                    },
                    {
                        text: 'How do you split this if it cannot fit one sprint?',
                        trigger_hint: 'candidate one monolithic story',
                    },
                    {
                        text: 'What does out of scope look like for v1?',
                        trigger_hint: 'candidate scope creep in MVP',
                    },
                    {
                        text: 'How would QA verify the story without ambiguous works well language?',
                        trigger_hint: 'candidate subjective acceptance criteria',
                    },
                ],
            },
            {
                text: 'Engineering says a requested Salesforce integration is six weeks; sales wants it next sprint. How do you decide?',
                category: 'technical',
                skill: 'Roadmapping & prioritization',
                follow_ups: [
                    {
                        text: 'What customer or revenue data would change your priority?',
                        trigger_hint: 'candidate decides politically without data',
                    },
                    {
                        text: 'What smaller integration slice could ship earlier?',
                        trigger_hint: 'candidate all-or-nothing integration',
                    },
                    {
                        text: 'How do you communicate the decision to sales in writing?',
                        trigger_hint: 'candidate verbal promise only',
                    },
                    {
                        text: 'Where do you record the deferral so it is not lost?',
                        trigger_hint: 'candidate no backlog artifact',
                    },
                ],
            },
            {
                text: 'You have fifteen stakeholder requests and one squad for the next quarter. Describe your prioritization framework.',
                category: 'technical',
                skill: 'Roadmapping & prioritization',
                follow_ups: [
                    {
                        text: 'How do you score items with weak data but loud executives?',
                        trigger_hint: 'candidate loudest voice wins',
                    },
                    {
                        text: 'What goes on NOW versus NEXT versus LATER for Sprintwell roadmap?',
                        trigger_hint: 'candidate everything is NOW',
                    },
                    {
                        text: 'How often do you revisit priorities and with what trigger?',
                        trigger_hint: 'candidate set-and-forget roadmap',
                    },
                    {
                        text: 'What kill criteria retire an experiment from the roadmap?',
                        trigger_hint: 'candidate never removes items',
                    },
                ],
            },
            {
                text: 'Define three analytics events for tracking retrospective feature adoption. What properties matter?',
                category: 'technical',
                skill: 'SaaS metrics & product analytics',
                follow_ups: [
                    {
                        text: 'How do you avoid PII in event payloads for remote teams?',
                        trigger_hint: 'candidate logs emails unnecessarily',
                    },
                    {
                        text: 'What dashboard would you check weekly and why those metrics?',
                        trigger_hint: 'candidate vanity signup counts only',
                    },
                    {
                        text: 'How do you validate events fire correctly before launch?',
                        trigger_hint: 'candidate trusts implementation blindly',
                    },
                    {
                        text: 'Activation improved but retention flat—what do you investigate?',
                        trigger_hint: 'candidate celebrates activation only',
                    },
                ],
            },
            {
                text: 'Monthly cohort retention dipped for teams under five users. How do you analyze and present findings?',
                category: 'technical',
                skill: 'SaaS metrics & product analytics',
                follow_ups: [
                    {
                        text: 'What segments might confound the trend—plan tier, geography, onboarding variant?',
                        trigger_hint: 'candidate aggregate average only',
                    },
                    {
                        text: 'How small is too small a cohort to trust in Sprintwell traffic?',
                        trigger_hint: 'candidate overfits noise',
                    },
                    {
                        text: 'What qualitative follow-up interviews would you run?',
                        trigger_hint: 'candidate charts without customer context',
                    },
                    {
                        text: 'What recommendation format do execs need—options, impact, effort?',
                        trigger_hint: 'candidate dumps data without recommendation',
                    },
                ],
            },
            {
                text: 'You facilitate sprint planning and the team commits to 40 points but historically completes 28. What do you change?',
                category: 'technical',
                skill: 'Scrum ceremonies & agile delivery',
                follow_ups: [
                    {
                        text: 'How do you use velocity without turning it into a performance metric?',
                        trigger_hint: 'candidate blames engineers for velocity',
                    },
                    {
                        text: 'What belongs in sprint goal versus stretch items?',
                        trigger_hint: 'candidate flat backlog commit',
                    },
                    {
                        text: 'How do you handle mid-sprint urgent bugs from production?',
                        trigger_hint: 'candidate ignores interrupt capacity',
                    },
                    {
                        text: 'What do you document when carryover happens again?',
                        trigger_hint: 'candidate repeats planning without retro input',
                    },
                ],
            },
            {
                text: 'Design a 45-minute backlog refinement agenda for a remote squad across three time zones.',
                category: 'technical',
                skill: 'Scrum ceremonies & agile delivery',
                follow_ups: [
                    {
                        text: 'Which stories must be ready before refinement versus during?',
                        trigger_hint: 'candidate refines cold stories live',
                    },
                    {
                        text: 'How do you keep engineers engaged on video for acceptance criteria?',
                        trigger_hint: 'candidate PM monologue',
                    },
                    {
                        text: 'When do you spin a spike instead of debating unknowns?',
                        trigger_hint: 'candidate endless refinement',
                    },
                    {
                        text: 'How are outcomes shared async for people who could not attend?',
                        trigger_hint: 'candidate no written record',
                    },
                ],
            },
            {
                text: 'An enterprise customer wants custom SSO; your roadmap focuses on SMB self-serve. Draft the stakeholder message.',
                category: 'technical',
                skill: 'Stakeholder communication & influence',
                follow_ups: [
                    {
                        text: 'What alternatives short of full custom SSO could you offer?',
                        trigger_hint: 'candidate yes or no without options',
                    },
                    {
                        text: 'How do you quantify opportunity cost for internal leadership?',
                        trigger_hint: 'candidate emotional argument only',
                    },
                    {
                        text: 'What timeline language avoids overcommitting engineering?',
                        trigger_hint: 'candidate promises dates without eng input',
                    },
                    {
                        text: 'How do you capture the request for future roadmap review?',
                        trigger_hint: 'candidate slack message only',
                    },
                ],
            },
            {
                text: 'Release notes must announce a breaking API change for integrations. What do you include for PM platform users?',
                category: 'technical',
                skill: 'Stakeholder communication & influence',
                follow_ups: [
                    {
                        text: 'How far in advance do partners need notice and how do you segment comms?',
                        trigger_hint: 'candidate day-of announcement',
                    },
                    {
                        text: 'What migration guide elements reduce support tickets?',
                        trigger_hint: 'candidate changelog one-liner only',
                    },
                    {
                        text: 'How do you coordinate docs, in-app banner, and email?',
                        trigger_hint: 'candidate single channel',
                    },
                    {
                        text: 'How do you measure if communication succeeded?',
                        trigger_hint: 'candidate no success metric for comms',
                    },
                ],
            },
            {
                text: 'Tell me about a time you had to say no to a feature request from a vocal stakeholder.',
                category: 'behavioral',
                skill: 'Stakeholder communication & influence',
                follow_ups: [
                    {
                        text: 'What data or principles backed your no?',
                        trigger_hint: 'candidate arbitrary no',
                    },
                    {
                        text: 'What alternative did you offer and was it accepted?',
                        trigger_hint: 'candidate hard no without path',
                    },
                    {
                        text: 'How did the relationship look thirty days later?',
                        trigger_hint: 'candidate ignores relationship fallout',
                    },
                    {
                        text: 'What would you do differently at Sprintwell with remote execs?',
                        trigger_hint: 'candidate does not adapt to async culture',
                    },
                ],
            },
            {
                text: 'Describe facilitating a retro where the team blamed product for missed dates.',
                category: 'behavioral',
                skill: 'Scrum ceremonies & agile delivery',
                follow_ups: [
                    {
                        text: 'How did you keep psychological safety while addressing accountability?',
                        trigger_hint: 'candidate defensive or passive',
                    },
                    {
                        text: 'What concrete actions came out with owners and dates?',
                        trigger_hint: 'candidate vague communicate better',
                    },
                    {
                        text: 'What changed in how you write stories or commit scope afterward?',
                        trigger_hint: 'candidate retro theater only',
                    },
                    {
                        text: 'How would you run this retro async for Sprintwell squads?',
                        trigger_hint: 'candidate in-person only skills',
                    },
                ],
            },
            {
                text: 'Tell me about a discovery interview that contradicted your initial hypothesis.',
                category: 'behavioral',
                skill: 'Product discovery & requirements',
                follow_ups: [
                    {
                        text: 'How did you update the problem statement and who did you tell?',
                        trigger_hint: 'candidate clung to original idea',
                    },
                    {
                        text: 'What question revealed the surprise insight?',
                        trigger_hint: 'candidate scripted questions only',
                    },
                    {
                        text: 'How many interviews before you felt confident changing direction?',
                        trigger_hint: 'candidate one interview pivot',
                    },
                    {
                        text: 'How would you handle this with a skeptical engineering lead?',
                        trigger_hint: 'candidate cannot bring eng along',
                    },
                ],
            },
            {
                text: 'Share a time you shipped a feature that metrics showed was rarely used. What happened next?',
                category: 'behavioral',
                skill: 'SaaS metrics & product analytics',
                follow_ups: [
                    {
                        text: 'What leading indicators could have warned you pre-launch?',
                        trigger_hint: 'candidate surprised post-launch only',
                    },
                    {
                        text: 'Did you iterate, market, or sunset—and how was that decided?',
                        trigger_hint: 'candidate left zombie feature',
                    },
                    {
                        text: 'How did you communicate learnings to stakeholders?',
                        trigger_hint: 'candidate hid failure',
                    },
                    {
                        text: 'What guardrail prevents repeat at Sprintwell?',
                        trigger_hint: 'candidate no process change',
                    },
                ],
            },
            {
                text: 'Tell me about juggling conflicting priorities from customer success and engineering tech debt.',
                category: 'behavioral',
                skill: 'Roadmapping & prioritization',
                follow_ups: [
                    {
                        text: 'What framework helped you compare unlike requests?',
                        trigger_hint: 'candidate gut feel only',
                    },
                    {
                        text: 'How transparent were you with both sides about the decision?',
                        trigger_hint: 'candidate backchannel decisions',
                    },
                    {
                        text: 'What compromise preserved trust with both groups?',
                        trigger_hint: 'candidate zero-sum outcome',
                    },
                    {
                        text: 'How do you batch CS escalations without daily priority thrash?',
                        trigger_hint: 'candidate reactive every slack ping',
                    },
                ],
            },
            {
                text: 'Describe a written spec or PRD that caused rework because engineering misunderstood it.',
                category: 'behavioral',
                skill: 'Product discovery & requirements',
                follow_ups: [
                    {
                        text: 'What was ambiguous in your original doc?',
                        trigger_hint: 'candidate blames engineers only',
                    },
                    {
                        text: 'How did you fix the doc and validate understanding?',
                        trigger_hint: 'candidate verbal patch only',
                    },
                    {
                        text: 'What ritual now catches misunderstandings earlier?',
                        trigger_hint: 'candidate no improvement',
                    },
                    {
                        text: 'How do you write for remote engineers who cannot tap you on the shoulder?',
                        trigger_hint: 'candidate relies on hallway clarifications',
                    },
                ],
            },
            {
                text: 'Tell me about learning Scrum or agile formally and applying it imperfectly on a real team.',
                category: 'behavioral',
                skill: 'Scrum ceremonies & agile delivery',
                follow_ups: [
                    {
                        text: 'What ceremony did your team skip and what broke because of it?',
                        trigger_hint: 'candidate certification-only knowledge',
                    },
                    {
                        text: 'How did you adapt textbook Scrum to reality?',
                        trigger_hint: 'candidate rigid dogma',
                    },
                    {
                        text: 'What did you ask a scrum master or senior PM when stuck?',
                        trigger_hint: 'candidate never sought help',
                    },
                    {
                        text: 'What Sprintwell ceremony would you own first as trainee?',
                        trigger_hint: 'candidate wants to own roadmap day one',
                    },
                ],
            },
            {
                text: 'Give an example of building trust with engineers as a non-technical PM.',
                category: 'behavioral',
                skill: 'Stakeholder communication & influence',
                follow_ups: [
                    {
                        text: 'What did you do before meetings to respect their time?',
                        trigger_hint: 'candidate unprepared requests',
                    },
                    {
                        text: 'How did you handle being wrong about feasibility in public?',
                        trigger_hint: 'candidate doubled down',
                    },
                    {
                        text: 'What bug or tech debt item did you champion and why?',
                        trigger_hint: 'candidate only pushes features',
                    },
                    {
                        text: 'How do you show respect for remote eng deep work time?',
                        trigger_hint: 'candidate constant slack pings',
                    },
                ],
            },
            {
                text: 'Tell me about preparing for your first sprint demo with incomplete design polish.',
                category: 'behavioral',
                skill: 'Scrum ceremonies & agile delivery',
                follow_ups: [
                    {
                        text: 'What narrative tied the demo to sprint goal?',
                        trigger_hint: 'candidate feature tour only',
                    },
                    {
                        text: 'How did you handle questions about missing edge cases live?',
                        trigger_hint: 'candidate bluffed or froze',
                    },
                    {
                        text: 'What feedback changed next sprint planning?',
                        trigger_hint: 'candidate demo as one-way broadcast',
                    },
                    {
                        text: 'How would you demo Sprintwell roadmap view to trial users?',
                        trigger_hint: 'candidate cannot connect demo to customer value',
                    },
                ],
            },
            {
                text: 'Describe a time you used data to change someones mind about a product bet.',
                category: 'behavioral',
                skill: 'SaaS metrics & product analytics',
                follow_ups: [
                    {
                        text: 'What chart or table was most persuasive and why?',
                        trigger_hint: 'candidate anecdote without data',
                    },
                    {
                        text: 'How did you address data limitations honestly?',
                        trigger_hint: 'candidate oversold certainty',
                    },
                    {
                        text: 'What action followed the changed decision?',
                        trigger_hint: 'candidate mind changed but no action',
                    },
                    {
                        text: 'What metric would you watch to validate the new bet at Sprintwell?',
                        trigger_hint: 'candidate no validation plan',
                    },
                ],
            },
        ],
    },
    {
        slug: 'peoplefirst-trainee-hr',
        title: 'Trainee Human Resources',
        role: 'Trainee Human Resources',
        description:
            "PeopleFirst Collective is an HR consultancy helping venture-backed startups stand up people operations before they outgrow ad-hoc spreadsheets. Trainee HR consultants focus on employee relations: intake of workplace concerns, manager coaching on difficult conversations, policy guidance, performance-improvement documentation, and engagement follow-ups after surveys. You'll coordinate onboarding handoffs and offboarding checklists, but your core work is helping managers handle conflict, morale issues, and policy questions with empathy and rigor. Senior consultants review your case notes, join client calls on sensitive matters, and teach you to document factually without legal conclusions. Tools include Notion case logs, handbook templates, and HRIS exports. Hard requirements: HR degree, certificate program, or people-ops internship; demonstrated interest in employee relations, policy, or workplace investigations (not a recruiting-only background); professional written communication; discretion with confidential employee data; comfort saying let me confirm policy before I answer. You won't litigate, but you will flag risks early and de-escalate with clear next steps.",
        tags: [
            'human-resources',
            'employee-relations',
            'conflict-resolution',
            'performance-management',
            'compliance',
            'onboarding',
            'people-operations',
            'consulting',
        ],
        rubric: [
            {
                skill: 'Employee relations & conflict resolution',
                weight: 3,
                signals: [
                    'Conducts intake interviews capturing facts, dates, and witnesses without conclusions',
                    'Triages ER cases by severity and escalates harassment or safety issues immediately',
                    'Coaches managers on neutral language for performance or conduct conversations',
                    'Documents contemporaneous notes after employee or manager conversations',
                    'Separates policy explanation from investigatory questioning during intake',
                    'Proposes interim measures while cases are open—schedule changes, mediation, or monitoring',
                    'Follows up with parties after resolution to confirm retaliation concerns are addressed',
                    'Maintains confidentiality boundaries when employees ask about coworkers cases',
                ],
            },
            {
                skill: 'Onboarding & employee lifecycle',
                weight: 3,
                signals: [
                    'Builds day-one checklists covering payroll, equipment, and access provisioning',
                    'Coordinates I-9 or right-to-work verification steps with documented owners',
                    'Assigns onboarding buddies and 30-60-90 goals visible to managers',
                    'Tracks probation milestones and triggers feedback conversations proactively',
                    'Updates org charts and role records when transfers occur mid-quarter',
                    'Ensures offboarding revokes system access on last working day checklist',
                    'Collects onboarding feedback and routes themes to client leadership',
                    'Standardizes welcome packets while allowing client-specific policy inserts',
                ],
            },
            {
                skill: 'HR compliance & policy basics',
                weight: 2,
                signals: [
                    'Escalates FLSA classification questions instead of guessing exempt status',
                    'Tracks mandatory posting and training deadlines per client state footprint',
                    'Redacts medical or salary data before sharing documents externally',
                    'References handbook sections when advising managers on PTO or leave',
                    'Documents incident intake notes factually without legal conclusions',
                    'Identifies when independent contractor versus employee risk needs counsel',
                    'Keeps audit trails for compensation changes with approver and date',
                    'Flags harassment reports for immediate senior consultant involvement',
                ],
            },
            {
                skill: 'ER case documentation & people analytics',
                weight: 2,
                signals: [
                    'Summarizes engagement survey results with themes and sample quotes anonymized',
                    'Logs ER cases with consistent status, owner, and next-action dates',
                    'Uses consistent file naming and version dates for client deliverables',
                    'Tracks case aging and escalates when SLAs for intake or resolution are missed',
                    'Prepares leadership readouts with caveats on small-team anonymity limits',
                    'Maintains RACI clarity on who owns each ER process step per client',
                    'Reconciles HRIS roster data before advising on team conflict cases',
                    'Spots data discrepancies between systems before client leadership does',
                ],
            },
            {
                skill: 'Client advisory & communication',
                weight: 2,
                signals: [
                    'Opens client calls with agenda and closes with written recap and owners',
                    'Translates HR jargon into founder-friendly language on slack or email',
                    'Sets boundaries when clients request advice beyond trainee scope',
                    'Prepares managers for difficult conversations with scripts and policy cites',
                    'De-escalates employee complaints with empathy, timelines, and next steps',
                    'Proactively warns clients before compliance deadlines not after',
                    'Adapts tone for async updates versus live workshops with stakeholders',
                    'Builds trust by admitting unknowns and citing when counsel will follow up',
                ],
            },
        ],
        question_bank: [
            {
                text: 'An employee reports their manager consistently gives preferred assignments to one teammate. Walk me through your ER intake and first-week plan.',
                category: 'technical',
                skill: 'Employee relations & conflict resolution',
                follow_ups: [
                    {
                        text: 'What questions do you ask to separate perception from documented facts?',
                        trigger_hint: 'candidate jumps to conclusions without intake structure',
                    },
                    {
                        text: 'What interim measures do you consider while reviewing the concern?',
                        trigger_hint: 'candidate has no containment plan during open case',
                    },
                    {
                        text: 'How do you coach the manager before any findings are reached?',
                        trigger_hint: 'candidate confronts manager accusatorily on day one',
                    },
                    {
                        text: 'What do you document after each conversation and who can access it?',
                        trigger_hint: 'candidate takes mental notes only',
                    },
                ],
            },
            {
                text: 'Two teammates on a client project refuse to work together after a heated Slack exchange. How do you handle it?',
                category: 'technical',
                skill: 'Employee relations & conflict resolution',
                follow_ups: [
                    {
                        text: 'How do you interview each party without creating bias in your notes?',
                        trigger_hint: 'candidate interviews together and amplifies conflict',
                    },
                    {
                        text: 'What policy or code-of-conduct sections do you reference?',
                        trigger_hint: 'candidate improvises rules without handbook cite',
                    },
                    {
                        text: 'When do you escalate to a senior consultant or suggest mediation?',
                        trigger_hint: 'candidate handles harassment-level conflict alone',
                    },
                    {
                        text: 'How do you follow up to monitor retaliation or morale impact?',
                        trigger_hint: 'candidate closes case after one conversation',
                    },
                ],
            },
            {
                text: 'Design a day-one onboarding checklist for a remote employee across payroll, IT, and compliance.',
                category: 'technical',
                skill: 'Onboarding & employee lifecycle',
                follow_ups: [
                    {
                        text: 'Who owns I-9 verification and what is the deadline?',
                        trigger_hint: 'candidate vague compliance timing',
                    },
                    {
                        text: 'How do you prevent access-before-start-date security issues?',
                        trigger_hint: 'candidate sends all logins day zero early',
                    },
                    {
                        text: 'What does a 30-60-90 plan include for the manager?',
                        trigger_hint: 'candidate HR-only checklist',
                    },
                    {
                        text: 'How do you gather feedback after the first week?',
                        trigger_hint: 'candidate no feedback loop',
                    },
                ],
            },
            {
                text: 'A manager wants to convert an intern to full-time two months early. What people ops steps do you trigger?',
                category: 'technical',
                skill: 'Onboarding & employee lifecycle',
                follow_ups: [
                    {
                        text: 'What compensation and title approval path do you document?',
                        trigger_hint: 'candidate verbal agreement only',
                    },
                    {
                        text: 'How do systems—payroll, ATS, org chart—stay in sync?',
                        trigger_hint: 'candidate updates one system only',
                    },
                    {
                        text: 'Does probation restart and how do you advise the manager?',
                        trigger_hint: 'candidate ignores probation policy',
                    },
                    {
                        text: 'What communication goes to the intern formally?',
                        trigger_hint: 'candidate informal slack only',
                    },
                ],
            },
            {
                text: 'An employee asks if they are exempt from overtime in a hybrid role. How do you respond as a trainee?',
                category: 'technical',
                skill: 'HR compliance & policy basics',
                follow_ups: [
                    {
                        text: 'What questions do you gather before escalating to senior counsel?',
                        trigger_hint: 'candidate guesses exempt status',
                    },
                    {
                        text: 'What do you avoid saying that could create liability?',
                        trigger_hint: 'candidate definitive legal advice',
                    },
                    {
                        text: 'Where is classification documented after decision?',
                        trigger_hint: 'candidate slack advice only',
                    },
                    {
                        text: 'How do you follow up with the manager on time tracking?',
                        trigger_hint: 'candidate employee-only response',
                    },
                ],
            },
            {
                text: 'A client operates in two jurisdictions with different leave and accommodation policies. What differences might affect your ER guidance?',
                category: 'technical',
                skill: 'HR compliance & policy basics',
                follow_ups: [
                    {
                        text: 'How do you maintain separate policy appendices per jurisdiction?',
                        trigger_hint: 'candidate one-size handbook',
                    },
                    {
                        text: 'What triggers escalation to employment counsel?',
                        trigger_hint: 'candidate DIY legal interpretation',
                    },
                    {
                        text: 'How do you track mandatory training by location?',
                        trigger_hint: 'candidate no tracking system',
                    },
                    {
                        text: 'What do you tell a manager asking for uniform policy anyway?',
                        trigger_hint: 'candidate ignores jurisdictional risk',
                    },
                ],
            },
            {
                text: 'Engagement survey scores dropped on manager trust for one client. How do you analyze and present themes?',
                category: 'technical',
                skill: 'ER case documentation & people analytics',
                follow_ups: [
                    {
                        text: 'How do you anonymize small-team comments?',
                        trigger_hint: 'candidate quotes identifiable feedback',
                    },
                    {
                        text: 'What sample size caveats do you include for a 40-person company?',
                        trigger_hint: 'candidate overstates certainty',
                    },
                    {
                        text: 'What recommended actions belong in the deck versus follow-up workshops?',
                        trigger_hint: 'candidate dumps raw comments',
                    },
                    {
                        text: 'How do you track action items after the readout?',
                        trigger_hint: 'candidate presentation only',
                    },
                ],
            },
            {
                text: 'Your ER case log shows 8 open matters but the client CEO insists there are 12 active employee issues. Walk through your reconciliation.',
                category: 'technical',
                skill: 'ER case documentation & people analytics',
                follow_ups: [
                    {
                        text: 'What definitions do you align on first—open, pending, or resolved?',
                        trigger_hint: 'candidate argues without shared definitions',
                    },
                    {
                        text: 'What sources besides your log might hold undocumented ER conversations?',
                        trigger_hint: 'candidate checks only one system',
                    },
                    {
                        text: 'How do you document the reconciliation for the client CRM?',
                        trigger_hint: 'candidate verbal fix only',
                    },
                    {
                        text: 'What process prevents managers from bypassing formal intake next quarter?',
                        trigger_hint: 'candidate one-off reconciliation',
                    },
                ],
            },
            {
                text: 'Draft an async client update email after week one of an employee relations investigation.',
                category: 'technical',
                skill: 'Client advisory & communication',
                follow_ups: [
                    {
                        text: 'What status, risks, and next steps belong in the first paragraph?',
                        trigger_hint: 'candidate burying the lede',
                    },
                    {
                        text: 'How do you share progress without compromising confidentiality?',
                        trigger_hint: 'candidate includes identifiable details',
                    },
                    {
                        text: 'What asks do you need from the client to keep the timeline on track?',
                        trigger_hint: 'candidate no clear asks',
                    },
                    {
                        text: 'How do you tone-adjust for a first-time HR client versus an experienced COO?',
                        trigger_hint: 'candidate one template fits all',
                    },
                ],
            },
            {
                text: 'A founder wants to terminate someone today without documentation. How do you advise in the moment?',
                category: 'technical',
                skill: 'Client advisory & communication',
                follow_ups: [
                    {
                        text: 'What immediate steps reduce legal and morale risk?',
                        trigger_hint: 'candidate rubber-stamps termination',
                    },
                    {
                        text: 'What do you refuse to do as a trainee and who do you loop in?',
                        trigger_hint: 'candidate handles alone',
                    },
                    {
                        text: 'How do you communicate with remaining team members?',
                        trigger_hint: 'candidate ignores team impact',
                    },
                    {
                        text: 'What documentation should exist before any termination?',
                        trigger_hint: 'candidate no doc requirements',
                    },
                ],
            },
            {
                text: 'Tell me about managing sensitive employee information and a near-miss where you almost shared too much.',
                category: 'behavioral',
                skill: 'HR compliance & policy basics',
                follow_ups: [
                    {
                        text: 'What controls do you use for files and slack channels?',
                        trigger_hint: 'candidate shared in public channel',
                    },
                    {
                        text: 'How did you recover or prevent recurrence?',
                        trigger_hint: 'candidate no process change',
                    },
                    {
                        text: 'How do you train managers on need-to-know?',
                        trigger_hint: 'candidate individual fix only',
                    },
                    {
                        text: 'What would you do if a client founder asked for another employees salary?',
                        trigger_hint: 'candidate would disclose',
                    },
                ],
            },
            {
                text: 'Describe a time you delivered difficult news to an employee about a performance or policy outcome.',
                category: 'behavioral',
                skill: 'Employee relations & conflict resolution',
                follow_ups: [
                    {
                        text: 'How did you prepare the message and timing?',
                        trigger_hint: 'candidate improvised harshly',
                    },
                    {
                        text: 'What follow-up support did you offer after the conversation?',
                        trigger_hint: 'candidate ended contact after notification',
                    },
                    {
                        text: 'How did you manage your own stress afterward?',
                        trigger_hint: 'candidate dismisses emotional labor',
                    },
                    {
                        text: 'What would you do differently for a PeopleFirst client?',
                        trigger_hint: 'candidate generic answer',
                    },
                ],
            },
            {
                text: 'Tell me about juggling multiple client deadlines in one week.',
                category: 'behavioral',
                skill: 'Client advisory & communication',
                follow_ups: [
                    {
                        text: 'How did you prioritize when everything was urgent?',
                        trigger_hint: 'candidate random order',
                    },
                    {
                        text: 'What did you communicate proactively to clients?',
                        trigger_hint: 'candidate missed deadlines silently',
                    },
                    {
                        text: 'Where did you ask senior consultants for help?',
                        trigger_hint: 'candidate overwhelmed alone',
                    },
                    {
                        text: 'What system keeps client tasks visible now?',
                        trigger_hint: 'candidate mental notes only',
                    },
                ],
            },
            {
                text: 'Share an example of catching a compliance or policy mistake before it reached employees.',
                category: 'behavioral',
                skill: 'HR compliance & policy basics',
                follow_ups: [
                    {
                        text: 'What detail looked wrong and how did you verify?',
                        trigger_hint: 'candidate vague intuition',
                    },
                    {
                        text: 'Who did you notify and how quickly?',
                        trigger_hint: 'candidate delayed escalation',
                    },
                    {
                        text: 'How was the handbook or process updated?',
                        trigger_hint: 'candidate fixed case only',
                    },
                    {
                        text: 'What checklists do you use today because of that incident?',
                        trigger_hint: 'candidate no lasting change',
                    },
                ],
            },
            {
                text: 'Tell me about onboarding a manager who had never given structured feedback before.',
                category: 'behavioral',
                skill: 'Onboarding & employee lifecycle',
                follow_ups: [
                    {
                        text: 'What materials or scripts did you provide?',
                        trigger_hint: 'candidate told them to figure it out',
                    },
                    {
                        text: 'How did you measure if the first cycle went okay?',
                        trigger_hint: 'candidate no follow-up',
                    },
                    {
                        text: 'What pushback did you get and how did you handle it?',
                        trigger_hint: 'candidate avoided conflict',
                    },
                    {
                        text: 'How would you adapt for a remote startup client?',
                        trigger_hint: 'candidate in-person only approach',
                    },
                ],
            },
            {
                text: 'Describe a disagreement with a client about how to handle a employee relations issue.',
                category: 'behavioral',
                skill: 'Client advisory & communication',
                follow_ups: [
                    {
                        text: 'How did you present policy and risk without sounding preachy?',
                        trigger_hint: 'candidate lectured client',
                    },
                    {
                        text: 'What compromise or alternative did you offer?',
                        trigger_hint: 'candidate all or nothing',
                    },
                    {
                        text: 'When did you involve a senior consultant?',
                        trigger_hint: 'candidate waited too long or not at all',
                    },
                    {
                        text: 'How did you document the clients decision?',
                        trigger_hint: 'candidate no audit trail',
                    },
                ],
            },
            {
                text: 'Tell me about building a report or dashboard for a client who distrusted HR case data.',
                category: 'behavioral',
                skill: 'ER case documentation & people analytics',
                follow_ups: [
                    {
                        text: 'What sources did you reconcile to build credibility?',
                        trigger_hint: 'candidate single source',
                    },
                    {
                        text: 'How did you explain methodology in plain language?',
                        trigger_hint: 'candidate jargon-heavy',
                    },
                    {
                        text: 'What error did you find and how did you disclose it?',
                        trigger_hint: 'candidate hid mistakes',
                    },
                    {
                        text: 'What metric would you show a skeptical Series A founder first?',
                        trigger_hint: 'candidate vanity metrics',
                    },
                ],
            },
            {
                text: 'Give an example of improving employee relations intake after staff said HR felt dismissive.',
                category: 'behavioral',
                skill: 'Employee relations & conflict resolution',
                follow_ups: [
                    {
                        text: 'What specific feedback triggered the change?',
                        trigger_hint: 'candidate generic improvement',
                    },
                    {
                        text: 'How did you get buy-in from managers to route concerns formally?',
                        trigger_hint: 'candidate changed process alone',
                    },
                    {
                        text: 'How did you measure if trust improved?',
                        trigger_hint: 'candidate no feedback loop',
                    },
                    {
                        text: 'What would you fix first in a PeopleFirst client intake process?',
                        trigger_hint: 'candidate cannot prioritize',
                    },
                ],
            },
            {
                text: 'Tell me about logging employee relations cases in Notion or an HRIS under client pressure.',
                category: 'behavioral',
                skill: 'ER case documentation & people analytics',
                follow_ups: [
                    {
                        text: 'What did you learn before touching live employee case data?',
                        trigger_hint: 'candidate experimented in prod',
                    },
                    {
                        text: 'What mistake did you make and how was it corrected?',
                        trigger_hint: 'candidate claims perfection',
                    },
                    {
                        text: 'How did you document intake steps for the client team?',
                        trigger_hint: 'candidate tribal knowledge only',
                    },
                    {
                        text: 'What case-status workflow would you master first at PeopleFirst?',
                        trigger_hint: 'candidate unfocused learning',
                    },
                ],
            },
            {
                text: 'Describe maintaining professionalism when an employee or client was rude during an ER conversation.',
                category: 'behavioral',
                skill: 'Client advisory & communication',
                follow_ups: [
                    {
                        text: 'What did you say in the moment versus afterward?',
                        trigger_hint: 'candidate escalated emotionally',
                    },
                    {
                        text: 'When did you involve a senior consultant?',
                        trigger_hint: 'candidate absorbed abuse alone',
                    },
                    {
                        text: 'How did you protect confidentiality and team morale despite frustration?',
                        trigger_hint: 'candidate retaliated subtly',
                    },
                    {
                        text: 'What boundary would you set early with difficult clients?',
                        trigger_hint: 'candidate no boundaries',
                    },
                ],
            },
        ],
    },
];
