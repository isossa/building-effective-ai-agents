import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import SourceBadge from "./components/SourceBadge";
import {
  routeArchitecture,
  sourceRegistry,
  synthesisPrinciples,
  terminologyCrosswalk,
} from "./content/synthesisModel";
import ExecutiveSummary from "../ai-agent-executive-summary.jsx";
import ArchitecturePatterns from "../ai-agent-architecture-patterns.jsx";
import DecisionFramework from "../ai-agent-decision-framework.jsx";
import FoundationsAndGuardrails from "./FoundationsAndGuardrails";
import ComparativeGuide from "./ComparativeGuide";
import GlossaryPage from "./GlossaryPage";

const quickPoints = [
  "Built for readers who want the main ideas quickly",
  "Brings together Anthropic and OpenAI guidance with clear source attribution",
  "Organized around architecture, implementation, decision-making, and comparison",
];

const liveExperiences = routeArchitecture.filter((item) => item.status === "live");
const sourceList = [sourceRegistry.anthropic, sourceRegistry.openai];
const routeByPath = Object.fromEntries(routeArchitecture.map((item) => [item.path, item]));

const navGroups = [
  {
    label: "Start",
    description: "Get oriented and qualify the workflow.",
    paths: ["/summary", "/decision"],
  },
  {
    label: "Build",
    description: "Choose architecture and implementation foundations.",
    paths: ["/patterns", "/foundations"],
  },
  {
    label: "Reference",
    description: "Compare sources and clarify terms.",
    paths: ["/compare", "/glossary"],
  },
];

const recommendedPath = [
  "/summary",
  "/decision",
  "/patterns",
  "/foundations",
  "/compare",
  "/glossary",
];

function PlannedExperiencePage({ title, summary, plannedSections, sourceIds }) {
  return (
    <main className="shell" style={{ display: "grid", gap: 22 }}>
      <section className="hero">
        <p className="eyebrow">Planned Experience</p>
        <h1 style={{ maxWidth: "none" }}>{title}</h1>
        <p className="hero-copy">{summary}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
          {sourceIds.map((sourceId) => (
            <SourceBadge key={sourceId} sourceId={sourceId} />
          ))}
        </div>
      </section>

      <section className="guidance-panel">
        <div>
          <p className="panel-label">Why this page exists</p>
          <p className="panel-text">
            This route is part of the new synthesis architecture. It will help
            bridge the current Anthropic-focused app with OpenAI&apos;s practical
            implementation guidance.
          </p>
        </div>
        <div>
          <p className="panel-label">Planned sections</p>
          <div className="panel-text">
            {plannedSections.map((section) => (
              <p key={section} style={{ margin: "0 0 6px" }}>
                {section}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function HomePage() {
  return (
    <main className="shell home-shell">
      <section className="hero home-hero">
        <div className="home-hero-title">
          <p className="eyebrow">AI Agents Guide</p>
          <h1>Building Effective AI Agents</h1>
        </div>
        <div className="home-hero-content">
          <p className="hero-copy">
            An interactive guide to Anthropic&apos;s and OpenAI&apos;s frameworks
            for building agents, with focused paths for architecture,
            implementation, safety, and comparison.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/summary">
              Start with the summary
            </Link>
          </div>
        </div>
      </section>

      <section className="highlights-panel" aria-label="Guide highlights">
        {quickPoints.map((item, index) => (
          <div key={item} className="highlight-pill">
            <span>{index + 1}</span>
            <p>{item}</p>
          </div>
        ))}
      </section>

      <section className="path-overview" aria-labelledby="path-overview-title">
        <div>
          <p className="panel-label">Recommended Path</p>
          <h2 id="path-overview-title">Move from quick context to confident design.</h2>
        </div>
        <div className="path-overview-steps path-overview-steps-vertical">
          {recommendedPath.map((path, index) => {
            const item = routeByPath[path];
            return (
              <Link key={path} className="path-step-card" to={path}>
                <span className="path-step-summary">
                  <span className="path-step-number">{index + 1}</span>
                  <span className="path-step-title">{item.title}</span>
                </span>
                <span className="path-step-detail">
                  <span>{item.description}</span>
                  <span className="path-step-sources">
                    {item.sourceIds.map((sourceId) => (
                      <SourceBadge key={`${item.path}-${sourceId}`} sourceId={sourceId} />
                    ))}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="guidance-panel">
        <div>
          <p className="panel-label">Synthesis principles</p>
          <div className="panel-text">
            {synthesisPrinciples.map((item) => (
              <p key={item} style={{ margin: "0 0 8px" }}>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="panel-label">Sample term crosswalk</p>
          <div className="panel-text">
            {terminologyCrosswalk.slice(0, 3).map((item) => (
              <p key={item.concept} style={{ margin: "0 0 10px" }}>
                <strong>{item.concept}:</strong> {item.canonical}
              </p>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        {sourceList.map((source) => (
          <p key={source.id} className="footer-text">
            Source:{" "}
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label}, &quot;{source.title}&quot;
            </a>
          </p>
        ))}
      </footer>
    </main>
  );
}

function SiteNav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = location.pathname === "/";
  const activeRoute = routeByPath[location.pathname];
  const activeGroup = navGroups.find((group) => group.paths.includes(location.pathname));

  useEffect(() => {
    setIsMenuOpen(false);
    document
      .querySelectorAll(".site-nav details[open]")
      .forEach((item) => item.removeAttribute("open"));
  }, [location.pathname]);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="nav-top">
          <Link className="brand" to="/">
            AI Agents Guide
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav
          id="primary-navigation"
          className={`nav-links${isMenuOpen ? " open" : ""}`}
          aria-label="Primary"
        >
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            Home
          </Link>
          <details className="about-menu">
            <summary>About</summary>
            <div className="about-panel">
              <p className="explore-group-label">About This Project</p>
              <p className="about-panel-text">
                This project brings together Anthropic&apos;s and OpenAI&apos;s
                guidance on building agents into one interactive reference for
                moving from core concepts to architecture choices,
                implementation foundations, and source comparison.
              </p>
              <div className="about-panel-grid">
                <div>
                  <p className="explore-group-label">Best For</p>
                  <p className="about-panel-text">
                    Engineering leaders, product teams, technical educators,
                    and builders evaluating agent design choices.
                  </p>
                </div>
                <div>
                  <p className="explore-group-label">Sources</p>
                  <div className="about-panel-sources">
                    <SourceBadge sourceId="anthropic" />
                    <SourceBadge sourceId="openai" />
                    <SourceBadge sourceId="synthesis" />
                  </div>
                </div>
              </div>
            </div>
          </details>
          <details className="explore-menu">
            <summary className={activeGroup ? "active" : ""}>
              Explore
              {activeGroup ? <span>{activeGroup.label}</span> : null}
            </summary>
            <div className="explore-panel">
              {navGroups.map((group) => (
                <section key={group.label} className="explore-group">
                  <div>
                    <p className="explore-group-label">{group.label}</p>
                    <p className="explore-group-description">{group.description}</p>
                  </div>
                  <div className="explore-group-links">
                    {group.paths.map((path) => {
                      const item = routeByPath[path];
                      return (
                        <Link
                          key={path}
                          className={location.pathname === path ? "active" : ""}
                          to={path}
                        >
                          <span>{item.title}</span>
                          <small>{item.role}</small>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </details>
          <Link
            className={location.pathname === "/decision" ? "active" : ""}
            to="/decision"
          >
            Decide
          </Link>
          <Link
            className={location.pathname === "/patterns" ? "active" : ""}
            to="/patterns"
          >
            Patterns
          </Link>
        </nav>
      </div>
      {!isHome && activeRoute ? (
        <nav className="path-strip" aria-label="Recommended path">
          {recommendedPath.map((path, index) => {
            const item = routeByPath[path];
            return (
              <Link
                key={path}
                className={location.pathname === path ? "active" : ""}
                to={path}
                aria-current={location.pathname === path ? "page" : undefined}
              >
                <span>{index + 1}</span>
                {item.title}
              </Link>
            );
          })}
        </nav>
      ) : (
        <div className="nav-divider" />
      )}
    </header>
  );
}

export default function App() {
  return (
    <div className="app-frame">
      <SiteNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/summary" element={<ExecutiveSummary />} />
        <Route path="/patterns" element={<ArchitecturePatterns />} />
        <Route path="/decision" element={<DecisionFramework />} />
        <Route path="/foundations" element={<FoundationsAndGuardrails />} />
        <Route path="/compare" element={<ComparativeGuide />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Routes>
    </div>
  );
}
