---
title: "Collapse 6 Fetches Into 1 with Cap’n Web"
description: "Why chatty pages feel slow and how HTTP batching + pipelining collapses chains of dependent requests into a single round trip (our demo shows six, but it applies to any number)."
date: "2025-10-15"
category: "Performance"
legacyUrl: "/posts/2025-10-15-collapse-6-fetches-into-1.html"
---

<section aria-labelledby="problem">
<h2 id="problem">The Problem: Waterfall Latency</h2>
<p>Modern pages often make a bunch of small API calls in sequence: profile → friends → profiles → notifications → greeting → etc. Each call adds a round trip (RTT). On real networks, ~100–200&nbsp;ms of RTT per call adds up fast: a chain of dependent requests can add hundreds of milliseconds to multiple seconds of latency before any server work. (Our demo uses six calls as an example, but the approach applies to any number of calls.)</p>
</section>

<section aria-labelledby="what">
<h2 id="what">What Cap’n Web Is (and Why It Helps)</h2>
<p><a href="https://blog.cloudflare.com/capnweb-javascript-rpc-library/" rel="external noopener noreferrer">Cap’n Web</a> is a JavaScript‑native RPC library with two key ideas:</p>
<ul>
<li><strong>HTTP batch + pipelining:</strong> queue multiple calls and send them in <em>one</em> request. Promises act like stubs, so you can chain calls before the first resolves.</li>
<li><strong>Capability‑based RPC:</strong> pass references (objects with methods) instead of tokens or IDs. Least‑privilege by default.</li>
</ul>
<p>It also supports long‑lived WebSocket sessions and bidirectional calls, but this post focuses on the one‑RTT HTTP batch because it solves the waterfall pain directly.</p>
</section>

<section aria-labelledby="demo">
<h2 id="demo">Architecture Comparison: Chained REST vs Batched RPC</h2>
<p>Many frontend pages load data through a chain of dependent calls. To make the trade-off concrete, this post compares two implementation styles for the same data needs:</p>
<ul>
<li><strong>Chained REST:</strong> multiple dependent HTTP requests executed one after another.</li>
<li><strong>Batched RPC:</strong> one HTTP request carrying multiple logical calls.</li>
</ul>
<p>The key issue is round-trip overhead. As dependency depth increases, network latency often dominates total load time more than server compute does. Batching changes the shape of that cost by collapsing several round trips into one request boundary.</p>
</section>

<section aria-labelledby="how">
<h2 id="how">How the Batch Works</h2>
<p>Client code starts a batch session, adds calls, and awaits once. Under the hood, Cap’n Web sends one HTTP request carrying all calls, and the server executes them (with pipelining support).</p>
        
```
import { newHttpBatchRpcSession } from "capnweb";

const api = newHttpBatchRpcSession("/api");

// Queue calls without awaiting yet
const a = api.a();
const b = api.b();
const c = api.c();
const d = api.d();
const e = api.e();
const f = api.f();

// Send once, await once
const results = await Promise.all([a, b, c, d, e, f]);
```

<p>In a batch, you can even use <code>RpcPromise</code>s as parameters to other calls (promise pipelining). That lets you express dependent operations without additional round trips.</p>
</section>

<section aria-labelledby="worker">
<h2 id="worker">Minimal Worker Shape for Evaluation</h2>
<p>A practical way to evaluate this architecture is to expose two equivalent service shapes from the same backend:</p>
<ul>
<li><code>/rest/1</code>…<code>/rest/6</code>: one JSON response per request for a chained REST flow.</li>
<li><code>/api</code>: a Cap&rsquo;n Web endpoint exposing six methods (<code>a</code>…<code>f</code>) in a batched call boundary.</li>
</ul>
        
```
import { RpcTarget, newWorkersRpcResponse } from "capnweb";

class DemoApi extends RpcTarget {
constructor(delayMs) { super(); this.delayMs = delayMs; }
async a() { await wait(this.delayMs); return { step: "a", at: Date.now() }; }
async b() { await wait(this.delayMs); return { step: "b", at: Date.now() }; }
async c() { await wait(this.delayMs); return { step: "c", at: Date.now() }; }
async d() { await wait(this.delayMs); return { step: "d", at: Date.now() }; }
async e() { await wait(this.delayMs); return { step: "e", at: Date.now() }; }
async f() { await wait(this.delayMs); return { step: "f", at: Date.now() }; }
}
```

<p>In cross-origin testing environments, set <code>Access-Control-Allow-Origin: *</code> and <code>Timing-Allow-Origin: *</code> so browser timing data is available for analysis.</p>
</section>

<section aria-labelledby="results">
<h2 id="results">Expected Results</h2>
<p>If RTT is ~120&nbsp;ms and each call does ~120&nbsp;ms of work:</p>
<ul>
<li><strong>6 sequential REST calls:</strong> ~6 × (RTT + work) ≈ ~1440&nbsp;ms</li>
<li><strong>1 batch (6 calls):</strong> ~1 × (RTT + work) ≈ ~240&nbsp;ms</li>
</ul>
<p>Parallel REST improves over sequential, but still pays multiple RTTs and adds head‑of‑line blocking. The batch sends once.</p>
</section>

<section aria-labelledby="tradeoffs">
<h2 id="tradeoffs">Trade‑offs and When to Use It</h2>
<ul>
<li><strong>Great for:</strong> page boot, dashboards, “fan‑out” reads, and chained calls (authenticate → me → greet).</li>
<li><strong>Consider WebSocket:</strong> for sustained interactions or server‑initiated callbacks.</li>
<li><strong>Error handling:</strong> await all promises you care about; un‑awaited calls won’t return results in the batch.</li>
<li><strong>Security:</strong> capability‑based design reduces token sprawl and scopes authority to the object you hold.</li>
</ul>
</section>

<section aria-labelledby="try">
<h2 id="try">Try It Yourself</h2>
<ol>
<li>Measure a representative page flow in your product and count dependent calls.</li>
<li>Prototype a batched boundary for the same data needs and compare total time.</li>
<li>Test under realistic latency to validate impact before rollout.</li>
</ol>
<p>To build your own, see Cloudflare’s post: <a href="https://blog.cloudflare.com/capnweb-javascript-rpc-library/" rel="external noopener noreferrer">Cap’n Web: a new JavaScript RPC library</a>.</p>
</section>
