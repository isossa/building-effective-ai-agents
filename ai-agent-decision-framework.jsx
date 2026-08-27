import { useState } from "react";

const anthropicSourceUrl =
  "https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf";
const openaiSourceUrl = "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf";

const screeningQuestions = [
  {
    id: "complex_decisions",
    title: "Does this workflow require complex decision-making?",
    description:
      "Think judgment calls, ambiguity, exception handling, or context-sensitive reasoning where rules alone perform poorly.",
  },
  {
    id: "brittle_rules",
    title: "Has this workflow become hard to maintain with rules?",
    description:
      "Think sprawling if-then logic, exception-heavy automation, or systems that break whenever the workflow shifts.",
  },
  {
    id: "unstructured_data",
    title: "Does the workflow rely heavily on unstructured data?",
    description:
      "Think documents, emails, screenshots, tickets, conversations, PDFs, or other language-first input the system must interpret.",
  },
];

const questions = [
  {
    id: "control",
    question: "What level of control do you need?",
    options: [
      { label: "High", desc: "Regulatory, financial, safety-critical work where traceability matters", value: "high" },
      { label: "Moderate", desc: "Need flexibility, but still want clear oversight and guardrails", value: "moderate" },
      { label: "Low", desc: "Exploration, research, and open-ended analysis are the main goal", value: "low" },
    ],
  },
  {
    id: "complexity",
    question: "How complex is your problem domain?",
    options: [
      { label: "Single domain", desc: "One main area with repeatable workflows", value: "single" },
      { label: "Multi-domain, predictable", desc: "Several domains, but the path can mostly be mapped in advance", value: "multi-predictable" },
      { label: "Complex, open-ended", desc: "The task needs exploration, adaptation, or multiple perspectives", value: "complex" },
    ],
  },
  {
    id: "resources",
    question: "What are your resource constraints?",
    options: [
      { label: "Limited budget", desc: "Efficiency and token discipline matter at scale", value: "limited" },
      { label: "Time-to-market pressure", desc: "You need something useful in production quickly", value: "time" },
      { label: "Long-term strategic", desc: "You can invest in a design that evolves over time", value: "strategic" },
    ],
  },
  {
    id: "expertise",
    question: "Do you need deep domain expertise?",
    options: [
      { label: "Single domain", desc: "One area with established practices and reusable knowledge", value: "single-domain" },
      { label: "Multiple domains", desc: "Distinct specialties need to coordinate", value: "multi-domain" },
    ],
  },
];

const recommendations = {
  "high-single-limited-single-domain": { pattern: "Single Agent", tier: "start" },
  "high-single-limited-multi-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "high-single-time-single-domain": { pattern: "Single Agent", tier: "start" },
  "high-single-time-multi-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "high-single-strategic-single-domain": { pattern: "Single Agent → Sequential", tier: "evolve" },
  "high-single-strategic-multi-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-multi-predictable-limited-single-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-multi-predictable-limited-multi-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-multi-predictable-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "high-multi-predictable-time-multi-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-multi-predictable-strategic-single-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-multi-predictable-strategic-multi-domain": { pattern: "Sequential + Parallel", tier: "grow" },
  "high-complex-limited-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "high-complex-limited-multi-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "high-complex-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "high-complex-time-multi-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "high-complex-strategic-single-domain": { pattern: "Sequential + Evaluator", tier: "grow" },
  "high-complex-strategic-multi-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "moderate-single-limited-single-domain": { pattern: "Single Agent", tier: "start" },
  "moderate-single-limited-multi-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "moderate-single-time-single-domain": { pattern: "Single Agent", tier: "start" },
  "moderate-single-time-multi-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "moderate-single-strategic-single-domain": { pattern: "Single Agent → Hierarchical", tier: "evolve" },
  "moderate-single-strategic-multi-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "moderate-multi-predictable-limited-single-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "moderate-multi-predictable-limited-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "moderate-multi-predictable-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "moderate-multi-predictable-time-multi-domain": { pattern: "Sequential Workflow", tier: "grow" },
  "moderate-multi-predictable-strategic-single-domain": { pattern: "Sequential + Evaluator", tier: "grow" },
  "moderate-multi-predictable-strategic-multi-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "moderate-complex-limited-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "moderate-complex-limited-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "moderate-complex-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "moderate-complex-time-multi-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "moderate-complex-strategic-single-domain": { pattern: "Hierarchical Multi-Agent", tier: "scale" },
  "moderate-complex-strategic-multi-domain": { pattern: "Hierarchical + Parallel Hybrid", tier: "scale" },
  "low-single-limited-single-domain": { pattern: "Single Agent", tier: "start" },
  "low-single-limited-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "low-single-time-single-domain": { pattern: "Single Agent", tier: "start" },
  "low-single-time-multi-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "low-single-strategic-single-domain": { pattern: "Single Agent → Collaborative", tier: "evolve" },
  "low-single-strategic-multi-domain": { pattern: "Collaborative Multi-Agent", tier: "scale" },
  "low-multi-predictable-limited-single-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "low-multi-predictable-limited-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "low-multi-predictable-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "low-multi-predictable-time-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "low-multi-predictable-strategic-single-domain": { pattern: "Parallel + Evaluator", tier: "grow" },
  "low-multi-predictable-strategic-multi-domain": { pattern: "Collaborative Multi-Agent", tier: "scale" },
  "low-complex-limited-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "low-complex-limited-multi-domain": { pattern: "Parallel Workflow", tier: "grow" },
  "low-complex-time-single-domain": { pattern: "Single Agent + Skills", tier: "start" },
  "low-complex-time-multi-domain": { pattern: "Collaborative Multi-Agent", tier: "scale" },
  "low-complex-strategic-single-domain": { pattern: "Collaborative Multi-Agent", tier: "scale" },
  "low-complex-strategic-multi-domain": { pattern: "Collaborative + Hierarchical Hybrid", tier: "scale" },
};

const tierMeta = {
  start: { label: "Start Here", color: "#2D6A4F", bg: "#D8F3DC", icon: "●" },
  evolve: { label: "Plan to Evolve", color: "#5A189A", bg: "#E8DAEF", icon: "◐" },
  grow: { label: "Structured Growth", color: "#B45309", bg: "#FEF3C7", icon: "◑" },
  scale: { label: "Scale Play", color: "#1B4965", bg: "#CAE9FF", icon: "◉" },
};

const costData = [
  { pattern: "Single Agent", tokens: "1x", note: "Baseline cost and the fastest way to learn" },
  { pattern: "Sequential Workflow", tokens: "2-4x", note: "More structure and control, with linear cost growth" },
  { pattern: "Parallel Workflow", tokens: "3-6x", note: "Faster or broader, but you still pay for concurrent work" },
  { pattern: "Hierarchical Multi-Agent", tokens: "10-15x", note: "Useful when specialist coordination clearly earns its keep" },
  { pattern: "Collaborative Multi-Agent", tokens: "10-15x+", note: "Highest cost and hardest to predict operationally" },
];

const screeningOutcomes = {
  strong: {
    label: "Strong agent fit",
    color: "#2D6A4F",
    bg: "#D8F3DC",
    summary:
      "This workflow has the traits that usually justify agentic design: ambiguity, brittle rule systems, or heavy unstructured data.",
    next:
      "Continue into the architecture questions and decide how much control and orchestration you actually need.",
  },
  possible: {
    label: "Possible fit",
    color: "#B45309",
    bg: "#FEF3C7",
    summary:
      "There are signs an agent could help, but the case is not overwhelming yet. You may still want to compare against simpler deterministic automation.",
    next:
      "Continue if you want to explore an agentic option, but sanity-check whether a simpler workflow could solve the problem first.",
  },
  weak: {
    label: "Weak fit",
    color: "#6A040F",
    bg: "#FFD6D6",
    summary:
      "This workflow does not strongly match the conditions that typically justify an agent. A deterministic system may be the better starting point.",
    next:
      "Only continue if you have another reason to explore agents; otherwise, prioritize conventional automation or software design first.",
  },
};

const patternNotes = {
  "Single Agent": {
    why: "You need the most direct path to value with the least coordination overhead.",
    fallback: "Single Agent + Skills",
    evolution: "Add routing or a sequential workflow when one agent starts mixing too many jobs.",
    pilot: "Launch one agent on one workflow with a human-review checkpoint for the highest-risk outputs.",
    metrics: ["Task completion rate", "Human review pass rate", "Time saved per task"],
    watchouts: ["Prompt drift", "Weak tool design", "Assuming more agents will fix unclear requirements"],
  },
  "Single Agent + Skills": {
    why: "The work still fits one agent, but it needs deeper domain expertise or reusable workflows.",
    fallback: "Single Agent",
    evolution: "Split into specialist paths only when different domains truly need different reasoning loops.",
    pilot: "Equip one agent with domain-specific instructions, tools, and reusable playbooks before adding orchestration.",
    metrics: ["Accuracy on domain tasks", "Reduction in escalations", "Reuse rate of skills or playbooks"],
    watchouts: ["Overstuffed prompts", "Hidden assumptions in skills", "Treating skills as a substitute for observability"],
  },
  "Sequential Workflow": {
    why: "You need predictability, traceability, and clear stage ownership across a known process.",
    fallback: "Single Agent + Skills",
    evolution: "Add parallelism or evaluator stages if quality or breadth becomes the bottleneck.",
    pilot: "Map the workflow into 3-5 stages and define a crisp handoff contract for each stage.",
    metrics: ["Stage pass-through rate", "Failure rate by stage", "Cycle time per request"],
    watchouts: ["Too many stages", "Forcing creative work into a rigid pipeline", "No recovery path for edge cases"],
  },
  "Parallel Workflow": {
    why: "Independent analysis can run at the same time, improving speed or confidence without full collaboration.",
    fallback: "Sequential Workflow",
    evolution: "Add an evaluator or supervisor if contradictory answers become common.",
    pilot: "Run two or three bounded analyses in parallel and define how ties or contradictions will be resolved.",
    metrics: ["Turnaround time", "Agreement rate between branches", "Decision confidence uplift"],
    watchouts: ["Messy aggregation", "Duplicate work", "Parallelizing tasks that really depend on each other"],
  },
  "Hierarchical Multi-Agent": {
    why: "You need coordination across distinct specialties, but still want a central decision-maker.",
    fallback: "Sequential Workflow",
    evolution: "Push only certain branches into parallel or evaluator loops once the supervisor pattern is stable.",
    pilot: "Define one supervisor, 2-3 specialists, and strict scope boundaries for each specialist.",
    metrics: ["Delegation accuracy", "Specialist utilization", "Outcome quality on complex tasks"],
    watchouts: ["Supervisor bottlenecks", "Context bloat", "Too many overlapping specialists"],
  },
  "Collaborative Multi-Agent": {
    why: "The work benefits from distributed exploration and low-control, multi-perspective problem solving.",
    fallback: "Hierarchical Multi-Agent",
    evolution: "Formalize communication budgets and memory rules before expanding the team further.",
    pilot: "Start with a small peer group on a bounded research problem and instrument their communication heavily.",
    metrics: ["Novel insight rate", "Time to converge", "Communication cost per successful outcome"],
    watchouts: ["Emergent loops", "Unpredictable coordination", "Runaway token usage"],
  },
  "Sequential + Parallel": {
    why: "You need a controlled process overall, but specific stages benefit from concurrent work.",
    fallback: "Sequential Workflow",
    evolution: "Introduce supervisors only if the middle parallel stages become too hard to reconcile.",
    pilot: "Keep the workflow linear except for one or two clearly independent parallel branches.",
    metrics: ["End-to-end cycle time", "Parallel branch conflict rate", "Quality lift from concurrency"],
    watchouts: ["Overcomplicated routing", "Branch sprawl", "No clear merge logic"],
  },
  "Sequential + Evaluator": {
    why: "You need a predictable flow, plus explicit quality checking before outputs ship.",
    fallback: "Sequential Workflow",
    evolution: "Add specialist agents only when evaluation reveals systematic domain gaps.",
    pilot: "Insert one evaluator stage at the highest-risk output boundary rather than everywhere.",
    metrics: ["Evaluator catch rate", "Reduction in rework", "Quality score before and after evaluation"],
    watchouts: ["Too many review loops", "Vague evaluator criteria", "Latency spikes"],
  },
  "Hierarchical + Parallel Hybrid": {
    why: "The problem needs a central coordinator and concurrent specialist work across several lanes.",
    fallback: "Hierarchical Multi-Agent",
    evolution: "Only expand breadth after supervisor tracing is stable and costs are understood.",
    pilot: "Start with a supervisor and just one parallel specialist cluster.",
    metrics: ["Supervisor load", "Parallel branch efficiency", "Complex task success rate"],
    watchouts: ["Layered complexity", "Context explosion", "Difficult root-cause debugging"],
  },
  "Collaborative + Hierarchical Hybrid": {
    why: "You need both distributed ideation and some supervisory structure to avoid total chaos.",
    fallback: "Collaborative Multi-Agent",
    evolution: "Keep the hybrid narrow and prove the value of each coordination layer separately.",
    pilot: "Use collaborative peers for exploration, then hand results to a supervisor for synthesis.",
    metrics: ["Exploration yield", "Synthesis quality", "Coordination overhead"],
    watchouts: ["Unclear authority", "High token cost", "Difficult governance"],
  },
  "Parallel + Evaluator": {
    why: "You want multiple views of the problem and then an explicit quality or adjudication pass.",
    fallback: "Parallel Workflow",
    evolution: "Add hierarchy only if adjudication becomes domain-specific and complex.",
    pilot: "Parallelize a small set of analyses, then use one evaluator to rank or merge them.",
    metrics: ["Evaluator agreement", "False positive reduction", "Confidence uplift versus single-pass"],
    watchouts: ["Too much duplication", "Evaluator overload", "Complex merge logic"],
  },
  "Single Agent → Sequential": {
    why: "You should start with one agent now, but the workflow probably wants more explicit stage control later.",
    fallback: "Single Agent",
    evolution: "Break the process into ordered steps once the single-agent bottlenecks are visible.",
    pilot: "Build the single-agent version with clean boundaries so stages can be separated later.",
    metrics: ["Where the agent stalls", "Error concentration by subtask", "Manual intervention rate"],
    watchouts: ["Premature decomposition", "Unclear stage boundaries", "No instrumentation for evolution"],
  },
  "Single Agent → Hierarchical": {
    why: "One agent is the right launch shape, but specialist coordination will likely become necessary as scope expands.",
    fallback: "Single Agent + Skills",
    evolution: "Promote repeated subtask types into specialists under one coordinator.",
    pilot: "Start with one accountable agent and log which task families most often need separate treatment.",
    metrics: ["Escalation categories", "Complexity growth over time", "Specialist-worthy failure patterns"],
    watchouts: ["Skipping the learning phase", "Adding specialists before task boundaries are known", "Context sprawl"],
  },
  "Single Agent → Collaborative": {
    why: "You need a fast starting point today, but future work may benefit from more exploratory, peer-like reasoning.",
    fallback: "Single Agent + Skills",
    evolution: "Experiment with peer agents only after the single-agent baseline is well understood.",
    pilot: "Use one agent first, then test a small peer group on cases where exploration clearly matters.",
    metrics: ["Baseline quality", "Improvement on exploratory tasks", "Cost per additional insight"],
    watchouts: ["Jumping to collaboration too early", "No communication rules", "Weak comparison against baseline"],
  },
};

function normalizePattern(pattern) {
  if (patternNotes[pattern]) return pattern;
  if (pattern.includes("Collaborative")) return "Collaborative Multi-Agent";
  if (pattern.includes("Hierarchical")) return "Hierarchical Multi-Agent";
  if (pattern.includes("Sequential")) return "Sequential Workflow";
  if (pattern.includes("Parallel")) return "Parallel Workflow";
  if (pattern.includes("Single Agent + Skills")) return "Single Agent + Skills";
  if (pattern.includes("Single Agent")) return "Single Agent";
  return "Single Agent";
}

function getDecisionSupport(answers, rec) {
  const key = normalizePattern(rec.pattern);
  const base = patternNotes[key];
  const controlText =
    answers.control === "high"
      ? "Because control is a priority, the recommendation leans toward patterns with clearer handoffs and stronger auditability."
      : answers.control === "moderate"
        ? "Because you need flexibility with oversight, the recommendation balances structure with adaptability."
        : "Because exploration matters more than tight control, the recommendation allows for more open-ended reasoning.";
  const complexityText =
    answers.complexity === "complex"
      ? "Your problem is complex enough that structure or specialization will likely matter."
      : answers.complexity === "multi-predictable"
        ? "Your workflow spans multiple areas, but it is still predictable enough to benefit from deliberate orchestration."
        : "Your work is constrained enough that a simpler design is still a strength, not a limitation.";

  return {
    ...base,
    fit: `${base.why} ${controlText} ${complexityText}`,
  };
}

function getScreeningResult(screeningAnswers) {
  const positives = screeningQuestions.filter((item) => screeningAnswers[item.id] === "yes").length;

  if (positives >= 2) return { key: "strong", positives };
  if (positives === 1) return { key: "possible", positives };
  return { key: "weak", positives };
}

export default function DecisionFramework() {
  const [answers, setAnswers] = useState({});
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [showArchitecture, setShowArchitecture] = useState(false);

  const screeningComplete = screeningQuestions.every((item) => screeningAnswers[item.id]);
  const screeningResult = screeningComplete ? getScreeningResult(screeningAnswers) : null;
  const screeningMeta = screeningResult ? screeningOutcomes[screeningResult.key] : null;

  const handleSelect = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleScreeningSelect = (qId, value) => {
    setScreeningAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id]);
  const key = allAnswered ? `${answers.control}-${answers.complexity}-${answers.resources}-${answers.expertise}` : null;
  const rec = key ? recommendations[key] || { pattern: "Hierarchical Multi-Agent", tier: "scale" } : null;
  const tier = rec ? tierMeta[rec.tier] : null;
  const support = rec && allAnswered ? getDecisionSupport(answers, rec) : null;

  return (
    <div style={{ fontFamily: "'Georgia', 'Cambria', serif", background: "#F5F0EB", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, borderBottom: "3px solid #1a1a1a", paddingBottom: 18 }}>
          <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", margin: "0 0 8px" }}>
            Decision Framework
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a", lineHeight: 1.2 }}>
            Architecture Decision Framework
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0, fontStyle: "italic" }}>
            First decide whether the workflow should be agentic at all, then choose an appropriate architecture.
          </p>
        </div>

        <div style={{ marginBottom: 24, padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #E0DCD6" }}>
          <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 10px" }}>
            30-Second Summary
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.65, color: "#333" }}>
            This tool is designed to help you avoid over-engineering. The best answer is usually the simplest pattern that meets today&apos;s requirements while leaving a clear path to scale later.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
              <strong>Agent fit first.</strong> Not every workflow should become agentic.
            </div>
            <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
              <strong>Control high?</strong> Lean simpler.
            </div>
            <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
              <strong>Complexity high?</strong> Add structure slowly.
            </div>
            <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
              <strong>Need expertise?</strong> Try skills before more agents.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: 22, background: "#fff", borderRadius: 12, border: "1px solid #E0DCD6" }}>
          <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 10px" }}>
            Step 1 · Should This Be An Agent?
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.65, color: "#444" }}>
            OpenAI recommends prioritizing agents when traditional automation falls short because the workflow depends on nuanced decisions, brittle rule systems, or unstructured inputs.
          </p>

          {screeningQuestions.map((item) => (
            <div key={item.id} style={{ marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, letterSpacing: 1.3, textTransform: "uppercase", color: "#555", margin: "0 0 8px" }}>
                {item.title}
              </h3>
              <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "#666", lineHeight: 1.55 }}>
                {item.description}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ].map((option) => {
                  const selected = screeningAnswers[item.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleScreeningSelect(item.id, option.value)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 999,
                        border: selected ? "2px solid #1a1a1a" : "1px solid #D4CFC8",
                        background: selected ? "#fff" : "#FDFCFA",
                        cursor: "pointer",
                        fontFamily: "'Helvetica Neue', sans-serif",
                        fontWeight: selected ? 700 : 500,
                        color: "#333",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {screeningMeta && (
            <div style={{ marginTop: 12, padding: 18, borderRadius: 10, background: screeningMeta.bg }}>
              <p style={{ margin: "0 0 6px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.3, textTransform: "uppercase", color: screeningMeta.color }}>
                {screeningMeta.label}
              </p>
              <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.6, color: "#333" }}>
                {screeningMeta.summary}
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#444" }}>
                {screeningMeta.next}
              </p>
            </div>
          )}

          {screeningComplete && (
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setShowArchitecture(true)}
                style={{
                  minHeight: 44,
                  padding: "0 18px",
                  borderRadius: 999,
                  border: "none",
                  background: "#1a1a1a",
                  color: "#fff",
                  cursor: "pointer",
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 700,
                }}
              >
                Continue to architecture selection
              </button>
            </div>
          )}
        </div>

        {showArchitecture && questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "#555", margin: "0 0 10px" }}>
              Step 2.{qi + 1} {q.question}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(q.id, opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "12px 16px",
                      border: isSelected ? "2px solid #1a1a1a" : "1.5px solid #d4cfc8",
                      borderRadius: 8,
                      background: isSelected ? "#fff" : "#FDFCFA",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                  >
                    <span style={{ width: 18, height: 18, borderRadius: "50%", border: isSelected ? "5px solid #1a1a1a" : "2px solid #bbb", flexShrink: 0, marginTop: 2, boxSizing: "border-box" }} />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{opt.label}</span>
                      <span style={{ fontSize: 12.5, color: "#777", marginLeft: 8 }}>{opt.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {showArchitecture && rec && tier && support && (
          <div style={{ marginTop: 12, padding: 24, background: "#fff", border: `2px solid ${tier.color}33`, borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 12px" }}>
              Recommended Pattern
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 10, background: tier.bg, fontSize: 22, color: tier.color }}>
                {tier.icon}
              </span>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: "#1a1a1a", fontWeight: 700 }}>{rec.pattern}</h2>
                <span style={{ display: "inline-block", marginTop: 4, padding: "3px 10px", borderRadius: 12, background: tier.bg, color: tier.color, fontSize: 11, fontWeight: 600, fontFamily: "'Helvetica Neue', sans-serif", letterSpacing: 0.5 }}>
                  {tier.label}
                </span>
              </div>
            </div>

            <div style={{ padding: "14px 16px", background: "#F8F5F0", borderRadius: 8, marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#333" }}>{support.fit}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
              <div style={{ padding: "14px 16px", border: "1px solid #ECE7E0", borderRadius: 8 }}>
                <p style={{ margin: "0 0 6px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#888" }}>
                  Best Fit Now
                </p>
                <p style={{ margin: 0, fontSize: 14, color: "#222", lineHeight: 1.5 }}>{rec.pattern}</p>
              </div>
              <div style={{ padding: "14px 16px", border: "1px solid #ECE7E0", borderRadius: 8 }}>
                <p style={{ margin: "0 0 6px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#888" }}>
                  Cheaper Fallback
                </p>
                <p style={{ margin: 0, fontSize: 14, color: "#222", lineHeight: 1.5 }}>{support.fallback}</p>
              </div>
              <div style={{ padding: "14px 16px", border: "1px solid #ECE7E0", borderRadius: 8 }}>
                <p style={{ margin: "0 0 6px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#888" }}>
                  Likely Evolution Path
                </p>
                <p style={{ margin: 0, fontSize: 14, color: "#222", lineHeight: 1.5 }}>{support.evolution}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              <div style={{ padding: "16px 18px", background: "#FAFAF7", borderRadius: 8 }}>
                <p style={{ margin: "0 0 8px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.3, textTransform: "uppercase", color: "#888" }}>
                  What To Do Next
                </p>
                <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.55 }}>{support.pilot}</p>
              </div>
              <div style={{ padding: "16px 18px", background: "#FAFAF7", borderRadius: 8 }}>
                <p style={{ margin: "0 0 8px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.3, textTransform: "uppercase", color: "#888" }}>
                  What To Measure
                </p>
                {support.metrics.map((metric) => (
                  <p key={metric} style={{ margin: "0 0 6px", fontSize: 13.5, color: "#333", lineHeight: 1.5 }}>
                    {metric}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 16, padding: "16px 18px", background: "#241D1D", borderRadius: 8, border: "1px solid #463131" }}>
              <p style={{ margin: "0 0 8px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.3, textTransform: "uppercase", color: "#F0B6B6" }}>
                Watchouts
              </p>
              {support.watchouts.map((item) => (
                <p key={item} style={{ margin: "0 0 6px", fontSize: 13.5, color: "#E0CACA", lineHeight: 1.5 }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, padding: 20, background: "#fff", borderRadius: 10, border: "1px solid #e0dcd6" }}>
          <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 14px" }}>
            Token Cost Reference
          </h3>
          {costData.map((c, i) => (
            <div key={c.pattern} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < costData.length - 1 ? "1px solid #f0ece6" : "none" }}>
              <span style={{ fontSize: 13.5, color: "#333", fontWeight: 500 }}>{c.pattern}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 10, background: "#F5F0EB", fontSize: 12, fontWeight: 700, color: "#555", fontFamily: "'Helvetica Neue', sans-serif", marginRight: 8 }}>
                  {c.tokens}
                </span>
                <span style={{ fontSize: 11.5, color: "#999" }}>{c.note}</span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 24, fontFamily: "'Helvetica Neue', sans-serif" }}>
          Sources:{" "}
          <a href={anthropicSourceUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>
            Anthropic guide
          </a>
          {" · "}
          <a href={openaiSourceUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>
            OpenAI guide
          </a>
        </p>
      </div>
    </div>
  );
}
