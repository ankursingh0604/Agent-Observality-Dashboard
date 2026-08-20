# Agent Observability Dashboard

Real-time monitoring UI for multi-agent LangGraph pipelines. Streams live execution events from a running agent workflow and renders them as both a flat event log and a live-updating fan-out/fan-in graph, so you can watch a multi-agent system execute step by step instead of guessing what's happening from log files.

Built to instrument a [https://github.com/ankursingh0604/Research-Paper-Analyzer](#) — a LangGraph pipeline with a Boss Agent orchestrating parallel sub-agents (metadata extraction, paper analysis, summarization, citation extraction, key insights) with LLM-based review gates and automatic retries.

![Dashboard screenshot showing live graph with retry node highlighted](docs/screenshot.png)

## What it shows

- **Live execution graph** — every node in the pipeline, colored by status (idle / running / completed / failed), with retry nodes highlighted separately so quality-gate rejections are visually obvious
- **Event log** — timestamped stream of every agent transition, tagged by run ID
- **Fan-out/fan-in structure** — the actual graph topology (parallel branches, sequential dependencies, retry loops) rendered as a diagram, not just a list

## Architecture

```
┌──────────────────┐      WebSocket       ┌──────────────────┐      HTTP POST        ┌─────────────────────┐
│  React Frontend   │ ◄──────────────────► │  Node/Express      │ ◄──────────────────── │  Python/LangGraph     │
│  (react-flow +     │      live events      │  Gateway + WS hub  │      per-node events     │  pipeline (any repo)   │
│  event log)         │                       │                    │                          │                        │
└──────────────────┘                       └──────────────────┘                        └─────────────────────┘
```

The gateway is pipeline-agnostic — any Python (or other) backend can push events to it over a simple HTTP POST, and every connected browser client receives them live over WebSocket. No changes to agent logic required; instrumentation is done by wrapping node functions.

## Stack

- **Frontend:** React (Vite), react-flow, WebSocket API
- **Gateway:** Node.js, Express, `ws`
- **Instrumented pipeline:** Python, LangGraph (example integration included, works with any LangGraph-based system)

## Running it

### 1. Start the gateway
```bash
cd gateway
npm install
node server.js
```
Listens on `http://localhost:4000`, exposes:
- `POST /internal/events` — receives events from an instrumented pipeline
- `GET /internal/history/:run_id` — replay events for a specific run
- WebSocket endpoint at `ws://localhost:4000` — broadcasts events live to connected clients

### 2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

### 3. Instrument your pipeline

Drop `events.py` into your Python project:

```python
import httpx, time

def emit_event(run_id: str, agent: str, status: str, detail: dict = None):
    try:
        httpx.post("http://localhost:4000/internal/events", json={
            "run_id": run_id,
            "agent": agent,
            "status": status,
            "detail": detail or {},
            "timestamp": time.time(),
        }, timeout=2.0)
    except Exception as e:
        print(f"[events] failed to emit: {e}")
```

Wrap your LangGraph node functions (no changes needed inside the nodes themselves):

```python
def instrument(name, fn):
    def wrapped(state):
        run_id = state.get("run_id", "unknown")
        emit_event(run_id, name, "started")
        try:
            result = fn(state)
            emit_event(run_id, name, "completed")
            return result
        except Exception as e:
            emit_event(run_id, name, "failed", {"error": str(e)})
            raise
    return wrapped

g.add_node("my_agent", instrument("my_agent", agents.my_agent))
```

Generate a `run_id` (e.g. `uuid.uuid4()`) and pass it into your initial state dict when invoking the graph.

## Event schema

```typescript
{
  run_id: string;
  agent: string;
  status: "started" | "completed" | "failed";
  detail: Record<string, any>;
  timestamp: number;
}
```

## Notes

- All state is in-memory (React state + a 200-event ring buffer in the gateway) — no database, no persistence between gateway restarts. Fine for a monitoring tool; would need a real store for production use.
- Graph layout in `frontend/src/graphLayout.js` is currently hardcoded to match the analyzer pipeline's structure. A more general version would infer layout from the graph's actual edge definitions.

---

Built by [Ankur Singh](https://github.com/ankursingh0604) as an observability layer on top of a [https://github.com/ankursingh0604/Research-Paper-Analyzer](#).