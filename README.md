# AI Agents Guide

An interactive guide that synthesizes Anthropic's and OpenAI's guidance on building agents into a smaller set of decision-oriented learning experiences.

## Live site

- Deployment target: GitHub Pages from the personal repository.

## Routes

- `/` Home page
- `/summary` Executive summary
- `/patterns` Architecture patterns
- `/decision` Decision framework
- `/foundations` Foundations & Guardrails
- `/compare` Comparative Guide
- `/glossary` Glossary

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Project overview

This project presents the source material through five live experiences:

- `Executive Summary`: a compressed, high-signal walkthrough of the main architecture and tradeoff argument
- `Architecture Patterns`: an interactive comparison of agent design options and cross-source orchestration mappings
- `Decision Framework`: a guided chooser for deciding whether a workflow should be agentic and what architecture to start with
- `Foundations & Guardrails`: live implementation-focused route drawing more heavily from OpenAI
- `Comparative Guide`: live crosswalk route comparing Anthropic and OpenAI directly, including a breadth-vs-depth matrix

The build copies `index.html` into each route folder so direct visits to pretty URLs like `/summary` or `/decision` work on GitHub Pages.
