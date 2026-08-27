import { useState } from "react";
import SourceBadge from "./src/components/SourceBadge";

const anthropicSourceUrl =
  "https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf";
const openaiSourceUrl = "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf";

const patterns = [
  {
    id: "single",
    label: "Single Agent",
    icon: "◉",
    color: "#2D6A4F",
    bg: "#D8F3DC",
    analogy: "Like a strong generalist handling one problem end to end.",
    summary: "One agent loops through perceive, decide, and act until the task is done.",
    when: [
      "Open-ended problems where the path is not predetermined",
      "Clear business rules with one main domain",
      "Code review, document work, and routine analysis",
    ],
    avoid: [
      "You need consistently perfect first-pass output",
      "The task spans several independent specialist domains",
      "Different perspectives are central to quality",
    ],
    components: ["AI model", "Prompt", "Tools", "Skills"],
    insight: "Before adding more agents, try making one agent better equipped.",
    mistake: "Teams often escalate to multi-agent too early instead of improving prompts, tools, or skills.",
    metrics: { control: "High", cost: "Low", speed: "Fast", complexity: "Low" },
    sourceIds: ["anthropic", "openai", "both"],
    sourceFraming: {
      anthropic: "Anthropic treats the single agent as the best starting point for most enterprise use cases and emphasizes adding skills before orchestration.",
      openai: "OpenAI explicitly recommends maximizing one capable agent first before splitting logic across multiple agents.",
      synthesis: "Both guides strongly align here: the default should be one capable agent with strong tools and behavior guidance.",
    },
    openaiMapping: "OpenAI single-agent systems",
  },
  {
    id: "hierarchical",
    label: "Hierarchical / Supervisory",
    icon: "◈",
    color: "#1B4965",
    bg: "#CAE9FF",
    analogy: "Like a manager delegating to specialists and consolidating the work.",
    summary: "A supervisor agent routes work to sub-agents and synthesizes results.",
    when: [
      "Several specialist domains need one coordinator",
      "Oversight and accountability matter",
      "The system needs flexibility without total decentralization",
    ],
    avoid: [
      "A single agent already handles the job well",
      "Coordination overhead costs more than it helps",
      "The budget cannot support heavier orchestration",
    ],
    components: ["Supervisor agent", "Specialist agents", "Shared memory", "Context controls"],
    insight: "This is often the most practical first multi-agent pattern for enterprises.",
    mistake: "The supervisor becomes a bottleneck when too much context or too many decisions flow through one place.",
    metrics: { control: "Moderate-High", cost: "High", speed: "Medium", complexity: "Medium-High" },
    sourceIds: ["anthropic", "openai", "both"],
    sourceFraming: {
      anthropic: "Anthropic frames this as hierarchical or supervisory coordination with a central controller and clear accountability.",
      openai: "OpenAI calls the nearest equivalent the manager pattern, where specialist agents are used as tools by a central orchestrator.",
      synthesis: "These are near-equivalent concepts, with OpenAI leaning more code-first and Anthropic leaning more organizational and architectural.",
    },
    openaiMapping: "OpenAI manager pattern (agents as tools)",
  },
  {
    id: "collaborative",
    label: "Collaborative / Peer-to-Peer",
    icon: "◇",
    color: "#6A040F",
    bg: "#FFD6D6",
    analogy: "Like a team room where experts talk directly to each other.",
    summary: "Autonomous agents coordinate through direct communication rather than a central boss.",
    when: [
      "Problems are open-ended and benefit from multiple viewpoints",
      "Exploration matters more than strict auditability",
      "Distributed intelligence improves the result",
    ],
    avoid: [
      "The environment is regulated or highly auditable",
      "Emergent behavior is too risky",
      "Token cost is tightly constrained",
    ],
    components: ["Peer agents", "Shared conversation or events", "Collective memory", "Conflict resolution"],
    insight: "Useful for exploration, but expensive and harder to predict.",
    mistake: "Without clear collaboration rules, agents can duplicate work or bounce tasks indefinitely.",
    metrics: { control: "Low", cost: "Very High", speed: "Medium", complexity: "High" },
    sourceIds: ["anthropic", "openai", "synthesis"],
    sourceFraming: {
      anthropic: "Anthropic explicitly emphasizes peer-to-peer collaboration, emergent coordination, and the value of multiple perspectives.",
      openai: "OpenAI discusses decentralized handoffs, where agents operate as peers and transfer control to one another directly.",
      synthesis: "They overlap, but are not identical: Anthropic goes broader on collaboration, while OpenAI is more specific about handoff mechanics.",
    },
    openaiMapping: "Related to OpenAI decentralized handoffs",
  },
  {
    id: "sequential",
    label: "Sequential Workflow",
    icon: "▸",
    color: "#5A189A",
    bg: "#E8DAEF",
    analogy: "Like an assembly line with clear handoffs.",
    summary: "A fixed path moves work from stage to stage in a predictable order.",
    when: [
      "The task can be broken into clean, ordered steps",
      "Traceability matters",
      "Each stage makes the next stage easier",
    ],
    avoid: [
      "Agents need to collaborate instead of handing off",
      "The work requires backtracking or improvisation",
      "A single agent could handle the whole flow simply",
    ],
    components: ["Ordered pipeline", "Decision points", "Audit trail", "Stage-level error handling"],
    insight: "Great for control and clarity when the process is knowable in advance.",
    mistake: "Teams force messy work into a rigid pipeline and then wonder why quality drops.",
    metrics: { control: "High", cost: "Medium", speed: "Medium-Slow", complexity: "Medium" },
    sourceIds: ["anthropic", "synthesis"],
    sourceFraming: {
      anthropic: "Anthropic treats sequential workflows as a primary pattern for predictable multi-step processes and compliance-heavy flows.",
      openai: "OpenAI does not foreground sequential workflow as a named category in the same way, but its guidance on routines and controlled workflows supports the same design instinct.",
      synthesis: "This pattern is more explicitly articulated by Anthropic, but still compatible with OpenAI's implementation-first guidance.",
    },
    openaiMapping: "Implicitly supported through routines and controlled runs",
  },
  {
    id: "parallel",
    label: "Parallel Workflow",
    icon: "⫘",
    color: "#B45309",
    bg: "#FEF3C7",
    analogy: "Like several experts working at once and comparing notes afterward.",
    summary: "Independent agents work simultaneously and their outputs get merged later.",
    when: [
      "Independent perspectives add confidence",
      "Speed matters and the work can run concurrently",
      "The task can be split without heavy coordination",
    ],
    avoid: [
      "Later steps depend tightly on earlier ones",
      "You need a strict operation order",
      "There is no plan for conflicting answers",
    ],
    components: ["Fan-out dispatcher", "Independent agents", "Aggregator", "Conflict resolution"],
    insight: "A useful way to buy speed or breadth without full collaboration.",
    mistake: "Parallelism creates noise if outputs are hard to compare or reconcile.",
    metrics: { control: "Moderate", cost: "Medium-High", speed: "Fast", complexity: "Medium" },
    sourceIds: ["anthropic", "synthesis"],
    sourceFraming: {
      anthropic: "Anthropic treats parallelism as a distinct workflow pattern for independent analyses and diverse viewpoints.",
      openai: "OpenAI does not isolate parallel workflow as a named pattern in the guide, though manager-style coordination can still orchestrate multiple specialist calls.",
      synthesis: "Parallel workflow remains more Anthropic-specific in this app's taxonomy, but it complements OpenAI's orchestration primitives.",
    },
    openaiMapping: "Can be composed inside manager-led orchestration",
  },
  {
    id: "evaluator",
    label: "Evaluator-Optimizer",
    icon: "⟳",
    color: "#374151",
    bg: "#E5E7EB",
    analogy: "Like a writer and editor iterating until the work is strong enough.",
    summary: "One system generates; another critiques; the loop repeats until quality is acceptable.",
    when: [
      "Clear evaluation criteria exist",
      "Nuance and revision materially improve quality",
      "You can afford extra passes for better output",
    ],
    avoid: [
      "First-pass quality is already good enough",
      "Criteria are vague or subjective",
      "The task needs instant results",
    ],
    components: ["Generator", "Evaluator", "Iteration cap", "Quality threshold"],
    insight: "Works best when feedback is concrete, actionable, and bounded.",
    mistake: "If the evaluator cannot give precise feedback, the loop burns cost without improving much.",
    metrics: { control: "Moderate-High", cost: "Medium-High", speed: "Slow", complexity: "Medium" },
    sourceIds: ["anthropic", "synthesis"],
    sourceFraming: {
      anthropic: "Anthropic presents evaluator-optimizer as a specific workflow pattern for iterative quality improvement.",
      openai: "OpenAI's guide does not name this pattern directly, but its emphasis on routines, guardrails, and explicit behavior design supports the same quality-control instinct.",
      synthesis: "This remains mostly Anthropic framing, but it fits naturally into a broader implementation toolkit informed by OpenAI's safety guidance.",
    },
    openaiMapping: "No direct named equivalent in the guide",
  },
];

const hybrids = [
  {
    name: "Single Agent + Escalation",
    text: "Use one agent for routine work, then escalate only hard edge cases into a multi-agent system.",
  },
  {
    name: "Hierarchical + Parallel",
    text: "A supervisor delegates to specialist teams that run parallel analyses inside their own lane.",
  },
  {
    name: "Sequential + Dynamic Routing",
    text: "A predictable pipeline handles the normal flow, but certain stages route work differently based on what the system sees.",
  },
];

const emerging = [
  "Dynamic agent generation: assembling agents at runtime from reusable prompts, tools, and configurations.",
  "Network or peer-to-peer architectures: many-to-many communication with fewer supervisor bottlenecks.",
];

const scoreOrder = ["Low", "Moderate", "Moderate-High", "High", "Very High"];

function metricScore(value) {
  const idx = scoreOrder.indexOf(value);
  return idx === -1 ? 0 : idx;
}

function compareMetric(a, b) {
  if (a === b) return "Same";
  return metricScore(a) > metricScore(b) ? "Higher" : "Lower";
}

export default function ArchitecturePatterns() {
  const [selected, setSelected] = useState("single");
  const [compareIds, setCompareIds] = useState(["single", "sequential"]);
  const active = patterns.find((p) => p.id === selected);
  const comparePatterns = compareIds.map((id) => patterns.find((p) => p.id === id)).filter(Boolean);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.length === 1 ? prev : prev.filter((item) => item !== id);
      }
      if (prev.length === 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Cambria', serif", background: "#FAFAF7", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 30, borderBottom: "3px solid #1a1a1a", paddingBottom: 20 }}>
          <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#888", margin: "0 0 8px" }}>
            Architecture Patterns
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a", lineHeight: 1.2 }}>
            Agent Architecture Patterns
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0, fontStyle: "italic" }}>
            Compare the main patterns, understand their tradeoffs, and see where hybrid strategies fit.
          </p>
        </div>

        <div style={{ marginBottom: 26, padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #E7E0D9" }}>
          <p style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 10px" }}>
            30-Second Summary
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.65, color: "#333" }}>
            Most teams should start with a single agent, then add structure only when the job clearly demands more control, more breadth, or more quality loops. The right pattern is the one that solves the problem with the least coordination overhead.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <strong>Best for control:</strong> Single, Sequential
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <strong>Best for speed:</strong> Single, Parallel
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <strong>Best for complexity:</strong> Hierarchical, Collaborative
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <strong>Best for refinement:</strong> Evaluator-Optimizer
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            <SourceBadge sourceId="anthropic" />
            <SourceBadge sourceId="openai" />
            <SourceBadge sourceId="synthesis" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {patterns.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                padding: "8px 16px",
                border: selected === p.id ? `2px solid ${p.color}` : "1.5px solid #d0d0d0",
                borderRadius: 6,
                background: selected === p.id ? p.bg : "#fff",
                color: selected === p.id ? p.color : "#555",
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 13,
                fontWeight: selected === p.id ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ marginRight: 6 }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {active && (
          <div style={{ background: "#fff", border: `2px solid ${active.color}22`, borderRadius: 12, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32, color: active.color }}>{active.icon}</span>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, color: active.color, fontWeight: 700 }}>{active.label}</h2>
                <p style={{ margin: "4px 0 0", fontSize: 15, color: "#444", fontStyle: "italic" }}>{active.summary}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {active.sourceIds.map((sourceId) => (
                <SourceBadge key={sourceId} sourceId={sourceId} />
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "12px 14px", background: "#FAFAF7", borderRadius: 8, borderLeft: `4px solid ${active.color}` }}>
              <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.5 }}>
                <strong style={{ color: active.color }}>Plain-English analogy:</strong> {active.analogy}
              </p>
            </div>

            <div style={{ marginTop: 16, padding: "14px 18px", background: "#F8F6F1", borderRadius: 8, border: "1px solid #ECE7E0" }}>
              <p style={{ margin: "0 0 8px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "#666" }}>
                Source Mapping
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#333", lineHeight: 1.55 }}>
                <strong>OpenAI mapping:</strong> {active.openaiMapping}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#333", lineHeight: 1.55 }}>
                <strong>Anthropic framing:</strong> {active.sourceFraming.anthropic}
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#333", lineHeight: 1.55 }}>
                <strong>OpenAI framing:</strong> {active.sourceFraming.openai}
              </p>
              <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.55 }}>
                <strong>Synthesis note:</strong> {active.sourceFraming.synthesis}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 18 }}>
              {Object.entries(active.metrics).map(([label, value]) => (
                <div key={label} style={{ padding: "12px 14px", borderRadius: 8, background: active.bg }}>
                  <p style={{ margin: "0 0 4px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: active.color }}>
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#222" }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#2D6A4F", margin: "0 0 10px" }}>
                  When to Use
                </h3>
                {active.when.map((item) => (
                  <p key={item} style={{ fontSize: 13.5, color: "#333", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #D8F3DC", lineHeight: 1.45 }}>
                    {item}
                  </p>
                ))}
              </div>

              <div>
                <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#6A040F", margin: "0 0 10px" }}>
                  When to Avoid
                </h3>
                {active.avoid.map((item) => (
                  <p key={item} style={{ fontSize: 13.5, color: "#333", margin: "0 0 6px", paddingLeft: 12, borderLeft: "2px solid #FFD6D6", lineHeight: 1.45 }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 22 }}>
              <h3 style={{ fontFamily: "'Helvetica Neue', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888", margin: "0 0 10px" }}>
                Core Components
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {active.components.map((c) => (
                  <span key={c} style={{ padding: "5px 12px", background: active.bg, borderRadius: 20, fontSize: 12.5, color: active.color, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 500 }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 22, padding: "14px 18px", background: "#FAFAF7", borderRadius: 8, borderLeft: `4px solid ${active.color}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "#333", lineHeight: 1.5 }}>
                <strong style={{ color: active.color }}>Key insight:</strong> {active.insight}
              </p>
              <p style={{ margin: 0, fontSize: 13.5, color: "#333", lineHeight: 1.5 }}>
                <strong style={{ color: active.color }}>Common mistake:</strong> {active.mistake}
              </p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24, padding: 22, background: "#fff", borderRadius: 12, border: "1px solid #E7E0D9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, color: "#1a1a1a" }}>Compare Two Patterns</h2>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#666" }}>
                Select up to two patterns to see which one is higher or lower on the main tradeoffs.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {patterns.map((p) => {
                const activeCompare = compareIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleCompare(p.id)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: 999,
                      border: activeCompare ? `1.5px solid ${p.color}` : "1px solid #D7D2CB",
                      background: activeCompare ? p.bg : "#fff",
                      color: activeCompare ? p.color : "#555",
                      cursor: "pointer",
                      fontFamily: "'Helvetica Neue', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {comparePatterns.length === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {comparePatterns.map((p, idx) => {
                const other = comparePatterns[idx === 0 ? 1 : 0];
                return (
                  <div key={p.id} style={{ border: "1px solid #ECE7E0", borderRadius: 10, padding: 16 }}>
                    <h3 style={{ margin: "0 0 10px", fontSize: 18, color: p.color }}>{p.label}</h3>
                    <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#444", lineHeight: 1.5 }}>{p.analogy}</p>
                    {Object.entries(p.metrics).map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 0", borderBottom: "1px solid #F1ECE6" }}>
                        <span style={{ fontSize: 12.5, color: "#666", textTransform: "capitalize" }}>{label}</span>
                        <span style={{ fontSize: 12.5, color: "#222", fontWeight: 700 }}>
                          {value} · {compareMetric(value, other.metrics[label])} than {other.label}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          <div style={{ padding: 22, background: "#fff", borderRadius: 12, border: "1px solid #E7E0D9" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 20, color: "#1a1a1a" }}>How the Guides Relate</h2>
            <div style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <p style={{ margin: "0 0 4px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 700, color: "#444" }}>
                Anthropic goes broader on pattern taxonomy
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "#666" }}>
                This page keeps Anthropic&apos;s richer pattern vocabulary because it distinguishes sequential, parallel, collaborative, and evaluator flows more explicitly.
              </p>
            </div>
            <div style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <p style={{ margin: "0 0 4px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 700, color: "#444" }}>
                OpenAI sharpens orchestration mechanics
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "#666" }}>
                OpenAI&apos;s guide makes the manager pattern and decentralized handoffs especially useful for mapping implementation choices back to concrete orchestration behavior.
              </p>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
              <p style={{ margin: "0 0 4px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 700, color: "#444" }}>
                This synthesis keeps both lenses
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "#666" }}>
                Anthropic helps you reason about architectural shape; OpenAI helps you reason about how that shape is implemented and handed off in practice.
              </p>
            </div>
          </div>

          <div style={{ padding: 22, background: "#fff", borderRadius: 12, border: "1px solid #E7E0D9" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 20, color: "#1a1a1a" }}>Hybrid Patterns</h2>
            {hybrids.map((item) => (
              <div key={item.name} style={{ marginBottom: 12, padding: "12px 14px", borderRadius: 8, background: "#F8F6F1" }}>
                <p style={{ margin: "0 0 4px", fontFamily: "'Helvetica Neue', sans-serif", fontSize: 12, fontWeight: 700, color: "#444" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: "#666" }}>{item.text}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: 22, background: "#fff", borderRadius: 12, border: "1px solid #E7E0D9" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 20, color: "#1a1a1a" }}>Emerging Patterns</h2>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#666", lineHeight: 1.55 }}>
              These are worth knowing about, but they should usually be treated as experimental rather than default recommendations.
            </p>
            {emerging.map((item) => (
              <p key={item} style={{ margin: "0 0 8px", fontSize: 13.5, color: "#333", lineHeight: 1.5, paddingLeft: 12, borderLeft: "2px solid #D8D2CB" }}>
                {item}
              </p>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 28, fontFamily: "'Helvetica Neue', sans-serif" }}>
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
