import { Link } from "react-router-dom";
import { useState } from "react";
import SourceBadge from "./components/SourceBadge";
import {
  breadthDepthProfiles,
  comparativeGuideSummary,
  sourceStrengths,
  terminologyCrosswalk,
  topicCoverage,
} from "./content/synthesisModel";

const anthropicSourceUrl =
  "https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf";
const openaiSourceUrl = "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf";

const tabMeta = [
  { id: "matrix", label: "Matrix" },
  { id: "crosswalk", label: "Crosswalk" },
  { id: "strengths", label: "Strengths" },
];

const scoreLabels = {
  1: "Very low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very high",
};

function scoreColor(score) {
  if (score >= 5) return { bg: "#1F3C88", color: "#fff" };
  if (score === 4) return { bg: "#CAE9FF", color: "#1B4965" };
  if (score === 3) return { bg: "#FEF3C7", color: "#B45309" };
  if (score === 2) return { bg: "#F5E8D7", color: "#8D5F34" };
  return { bg: "#F3F4F6", color: "#4B5563" };
}

function ScorePill({ label, score, prefix }) {
  const colors = scoreColor(score);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 58,
        minHeight: 26,
        padding: "0 10px",
        borderRadius: 999,
        background: colors.bg,
        color: colors.color,
        fontFamily: "'Helvetica Neue', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      }}
      title={`${prefix} ${score}: ${label}`}
    >
      {prefix}{score}
    </span>
  );
}

export default function ComparativeGuide() {
  const [activeTab, setActiveTab] = useState("matrix");

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Cambria', serif",
        background: "#F8F6F1",
        minHeight: "100vh",
        padding: "32px 24px",
        color: "#1f1f1f",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 28, borderBottom: "3px solid #1f1f1f", paddingBottom: 18 }}>
          <p
            style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#777",
              margin: "0 0 8px",
            }}
          >
            Comparative Guide
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.15 }}>
            Comparative Guide
          </h1>
          <p style={{ fontSize: 14, color: "#666", margin: 0, fontStyle: "italic" }}>
            A side-by-side guide to where Anthropic and OpenAI overlap, where they differ, and how this app combines them.
          </p>
        </div>

        <div
          style={{
            marginBottom: 24,
            padding: 20,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E0DCD6",
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#888",
              margin: "0 0 10px",
            }}
          >
            30-Second Summary
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.65, color: "#333" }}>
            {comparativeGuideSummary.text}
          </p>
          <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.55, color: "#666" }}>
            The scores, shared terms, and crosswalk notes on this page are editorial judgments meant to shorten the reading path while keeping source differences visible.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <SourceBadge sourceId="anthropic" />
            <SourceBadge sourceId="openai" />
            <SourceBadge sourceId="synthesis" />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          {tabMeta.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "7px 14px",
                border: activeTab === tab.id ? "1.5px solid #1f1f1f" : "1px solid #D5CFC6",
                borderRadius: 6,
                background: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#1f1f1f" : "#666",
                fontFamily: "'Helvetica Neue', sans-serif",
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "matrix" && (
          <div style={{ display: "grid", gap: 20, minWidth: 0 }}>
            <div
              style={{
                padding: 22,
                minWidth: 0,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E0DCD6",
              }}
            >
              <h2 style={{ margin: "0 0 12px", fontSize: 20, color: "#1f1f1f" }}>
                Breadth vs Depth Overview
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#666", lineHeight: 1.55 }}>
                These scores are a reading aid, not a formal benchmark. They show where each source goes broad, where it goes deep, and how the app positions itself between them.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {breadthDepthProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    style={{
                      padding: 18,
                      borderRadius: 10,
                      background: "#F8F5F0",
                      border: "1px solid #ECE4D8",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{profile.label}</h3>
                      <SourceBadge sourceId={profile.badgeId} />
                    </div>
                    <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#555", lineHeight: 1.55 }}>
                      {profile.summary}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <ScorePill prefix="B" score={profile.breadth} label={scoreLabels[profile.breadth]} />
                      <ScorePill prefix="D" score={profile.depth} label={scoreLabels[profile.depth]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 22,
                minWidth: 0,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E0DCD6",
              }}
            >
              <h2 style={{ margin: "0 0 12px", fontSize: 20, color: "#1f1f1f" }}>
                Topic-by-Topic Heatmap
              </h2>
              <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "#666", lineHeight: 1.55 }}>
                Each row compares breadth and depth for a specific concept. Breadth shows how widely a source treats the topic; depth shows how much practical detail it provides.
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#666", borderBottom: "1px solid #ECE4D8" }}>Topic</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#666", borderBottom: "1px solid #ECE4D8" }}>Anthropic</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#666", borderBottom: "1px solid #ECE4D8" }}>OpenAI</th>
                      <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#666", borderBottom: "1px solid #ECE4D8" }}>This app</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topicCoverage.map((row) => (
                      <tr key={row.topic}>
                        <td style={{ padding: "14px 12px", verticalAlign: "top", borderBottom: "1px solid #F3EEE6" }}>
                          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#222" }}>
                            {row.topic}
                          </p>
                          <p style={{ margin: 0, fontSize: 12.5, color: "#666", lineHeight: 1.5 }}>
                            {row.rationale}
                          </p>
                        </td>
                        {["anthropic", "openai", "app"].map((key) => (
                          <td key={key} style={{ padding: "14px 12px", verticalAlign: "top", borderBottom: "1px solid #F3EEE6" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              <ScorePill prefix="B" score={row[key].breadth} label={scoreLabels[row[key].breadth]} />
                              <ScorePill prefix="D" score={row[key].depth} label={scoreLabels[row[key].depth]} />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "crosswalk" && (
          <div
            style={{
              padding: 22,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #E0DCD6",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 20, color: "#1f1f1f" }}>
              Terminology Crosswalk
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              {terminologyCrosswalk.map((item) => (
                <div
                  key={item.concept}
                  style={{
                    padding: 16,
                    borderRadius: 10,
                    background: "#F8F5F0",
                    border: "1px solid #ECE4D8",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>{item.concept}</h3>
                    <SourceBadge sourceId={item.relationship === "Strong alignment" ? "both" : "synthesis"} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 12 }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", fontFamily: "'Helvetica Neue', sans-serif" }}>
                        Anthropic
                      </p>
                      <p style={{ margin: 0, fontSize: 13.5, color: "#333" }}>{item.anthropic}</p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", fontFamily: "'Helvetica Neue', sans-serif" }}>
                        OpenAI
                      </p>
                      <p style={{ margin: 0, fontSize: 13.5, color: "#333" }}>{item.openai}</p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", fontFamily: "'Helvetica Neue', sans-serif" }}>
                        Canonical app term
                      </p>
                      <p style={{ margin: 0, fontSize: 13.5, color: "#333", fontWeight: 700 }}>{item.canonical}</p>
                    </div>
                  </div>
                  <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "#555", lineHeight: 1.5 }}>
                    <strong>Relationship:</strong> {item.relationship}
                  </p>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#666", lineHeight: 1.55 }}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "strengths" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div
              style={{
                padding: 22,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E0DCD6",
              }}
            >
              <h2 style={{ margin: "0 0 12px", fontSize: 20, color: "#1f1f1f" }}>
                Source-Specific Strengths
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                {sourceStrengths.map((group) => (
                  <div
                    key={group.title}
                    style={{
                      padding: 18,
                      borderRadius: 10,
                      background: "#F8F5F0",
                      border: "1px solid #ECE4D8",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 18 }}>{group.title}</h3>
                      <SourceBadge sourceId={group.sourceId} />
                    </div>
                    {group.points.map((point) => (
                      <p key={point} style={{ margin: "0 0 8px", fontSize: 13.5, color: "#666", lineHeight: 1.5 }}>
                        {point}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: 22,
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #E0DCD6",
              }}
            >
              <h2 style={{ margin: "0 0 10px", fontSize: 20, color: "#1f1f1f" }}>
                How To Use This Comparison
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>Read Anthropic first if...</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                    you want a stronger architecture and strategy lens before choosing implementation details.
                  </p>
                </div>
                <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>Read OpenAI first if...</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                    you need a sharper understanding of foundations, tools, instructions, guardrails, and handoff mechanics.
                  </p>
                </div>
                <div style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8 }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>Use this app if...</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                    you want the shortest path from concepts to decisions while keeping source differences visible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 24,
            padding: 18,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #E0DCD6",
          }}
        >
          <p
            style={{
              fontFamily: "'Helvetica Neue', sans-serif",
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#888",
              margin: "0 0 12px",
            }}
          >
            Continue Fast
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <Link to="/summary" style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8, textDecoration: "none" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>
                Read the overview
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                Start with the Executive Summary if you want the shortest architecture and tradeoff briefing.
              </p>
            </Link>
            <Link to="/foundations" style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8, textDecoration: "none" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>
                Go deeper on implementation
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                Open Foundations & Guardrails if you need the model, tools, instructions, and safety layer.
              </p>
            </Link>
            <Link to="/decision" style={{ padding: "12px 14px", background: "#F8F5F0", borderRadius: 8, textDecoration: "none" }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#333" }}>
                Make a decision
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>
                Use the Decision Framework when you are ready to turn comparison into a concrete architecture choice.
              </p>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign: "center", fontSize: 11, color: "#777", fontFamily: "'Helvetica Neue', sans-serif" }}>
          <p style={{ margin: "0 0 6px" }}>
            Sources:{" "}
            <a href={anthropicSourceUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>
              Anthropic guide
            </a>
            {" · "}
            <a href={openaiSourceUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>
              OpenAI guide
            </a>
          </p>
          <p style={{ margin: 0 }}>
            Comparison scores and canonical terms are editorial synthesis for this interactive experience.
          </p>
        </div>
      </div>
    </div>
  );
}
