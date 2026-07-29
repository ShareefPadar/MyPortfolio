"use client";

import { useState } from "react";

// ── Mizan Business · account hold communication · prototype ──────
// Case study #2 by Shareef Padar. Grounded in dated, public complaints
// about UAE business banking freezes (ownership/director changes).
//
// Thesis: the bank knows the status. The customer gets "wait another
// 24 hours." Everything needed already exists internally and never
// reaches the screen.
//
// Deliberately a different product from Sanad: institutional dashboard,
// dark rail, mono for reference data, status-first rather than form-first.

const NAV = [
  { id: "notice", label: "What happened", sub: "Notification" },
  { id: "status", label: "Review status", sub: "Live tracker" },
  { id: "action", label: "Action required", sub: "2 items" },
  { id: "access", label: "What still works", sub: "Access scope" },
];

const STAGES = [
  { id: "received", label: "Documents received", note: "All 4 files logged" },
  { id: "review", label: "Compliance review", note: "In progress" },
  { id: "external", label: "External verification", note: "Registry check" },
  { id: "decision", label: "Decision & reactivation", note: "Not started" },
];

const DOCS = [
  { name: "Amended trade licence", state: "accepted", when: "Accepted working day 2" },
  { name: "New shareholder passport copy", state: "accepted", when: "Accepted working day 2" },
  {
    name: "Board resolution — ownership transfer",
    state: "needed",
    why: "The copy we have isn't signed by the outgoing shareholder.",
  },
  {
    name: "Source of funds — new shareholder",
    state: "needed",
    why: "Required for the new beneficial owner only. Six months of statements.",
  },
];

export default function MizanPrototype() {
  // day = elapsed working days; slipped = past the original 10-day estimate
  const [screen, setScreen] = useState("notice");
  const [day, setDay] = useState(6);
  const [resolved, setResolved] = useState(false);
  const [docs, setDocs] = useState<any[]>(DOCS);
  const slipped = day > 10;
  const outstanding = docs.filter((d) => d.state === "needed").length;
  const blocked = outstanding > 0;

  const go = (s: string) => setScreen(s);

  return (
    <div className="mz">
      <Styles />
      <div className="mz-shell">
        <Rail current={screen} onGo={go} resolved={resolved} outstanding={outstanding} />
        <main className="mz-main">
          <TopStrip
            day={day}
            slipped={slipped}
            resolved={resolved}
            blocked={blocked}
            outstanding={outstanding}
            onGo={go}
          />
          <div key={screen + resolved + slipped + outstanding} className="mz-anim">
            {resolved ? (
              <Resolved onGo={go} />
            ) : (
              <>
                {screen === "notice" && (
                  <Notice onGo={go} slipped={slipped} blocked={blocked} outstanding={outstanding} />
                )}
                {screen === "status" && (
                  <Status
                    day={day}
                    slipped={slipped}
                    blocked={blocked}
                    outstanding={outstanding}
                    onGo={go}
                  />
                )}
                {screen === "action" && (
                  <ActionRequired docs={docs} setDocs={setDocs} onGo={go} />
                )}
                {screen === "access" && <Access />}
              </>
            )}
          </div>
          <Sim
            day={day}
            setDay={setDay}
            resolved={resolved}
            setResolved={setResolved}
            setDocs={setDocs}
            onGo={go}
          />
        </main>
      </div>
    </div>
  );
}

/* ── Rail ───────────────────────────────────────────────── */

function Rail({ current, onGo, resolved, outstanding }: any) {
  return (
    <aside className="rail">
      <div className="rail-brand">
        <span className="rail-mark">M</span>
        <span className="rail-name">Mizan<span className="rail-biz">Business</span></span>
      </div>

      <p className="rail-disclaimer">
        Concept UI · fictional product · not any real bank's interface
      </p>

      <div className="rail-acct">
        <span className="rail-acct-name">Meridian Trading FZ-LLC</span>
        <span className={`rail-acct-state ${resolved ? "ok" : "held"}`}>
          {resolved ? "Active" : "On hold"}
        </span>
      </div>

      <nav className="rail-nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`rail-item ${current === n.id && !resolved ? "on" : ""}`}
            onClick={() => onGo(n.id)}
          >
            <span className="rail-item-label">
              {n.label}
              {n.id === "action" && outstanding > 0 && !resolved && (
                <span className="rail-badge">{outstanding}</span>
              )}
            </span>
            <span className="rail-item-sub">
              {n.id === "action"
                ? outstanding > 0 && !resolved
                  ? "Waiting on you"
                  : "Nothing outstanding"
                : n.sub}
            </span>
          </button>
        ))}
      </nav>

      <div className="rail-foot">
        <span className="rail-foot-k">Case reference</span>
        <span className="rail-foot-v">MZ-4418-06</span>
        <span className="rail-foot-note">Quote this on any call. Updates appear here first.</span>
      </div>
    </aside>
  );
}

/* ── Persistent top strip — the day counter lives everywhere ── */

function TopStrip({ day, slipped, resolved, blocked, outstanding, onGo }: any) {
  if (resolved) {
    return (
      <div className="strip ok">
        <span className="strip-dot ok" />
        <span className="strip-main">Account reactivated</span>
        <span className="strip-meta">Completed on working day {day}</span>
      </div>
    );
  }
  if (blocked) {
    return (
      <div className="strip block">
        <span className="strip-dot block" />
        <span className="strip-main">
          Paused — waiting on {outstanding} document{outstanding > 1 ? "s" : ""} from you
        </span>
        <button className="strip-act" onClick={() => onGo("action")}>
          Review now
        </button>
      </div>
    );
  }
  return (
    <div className={`strip ${slipped ? "slip" : ""}`}>
      <span className={`strip-dot ${slipped ? "slip" : ""}`} />
      <span className="strip-main">
        {slipped
          ? `Working day ${day} — past our 10-day estimate`
          : `Working day ${day} of up to 10`}
      </span>
      <span className="strip-meta">Updated today, 09:12</span>
    </div>
  );
}

/* ── 1 · Notice ─────────────────────────────────────────── */

function Notice({ onGo, blocked, outstanding }: any) {
  return (
    <div className="page">
      <p className="kicker">Notification · 17 February</p>
      <h1 className="h1">
        Your account is on hold while we complete your ownership change.
      </h1>
      <p className="lede">
        You requested a change of ownership on 17 February. UAE regulations
        require us to re-verify the business before the account can operate under
        new ownership. Your funds are safe and remain yours throughout.
      </p>

      <div className="grid2">
        <Panel title="What's affected">
          <ul className="ticks">
            <li className="no">
              POS settlement to this account
              <span className="tick-note">
                We know this one stops you trading. See below.
              </span>
            </li>
            <li className="no">Outgoing transfers and payments</li>
            <li className="no">Card transactions</li>
          </ul>
        </Panel>
        <Panel title="What still works">
          <ul className="ticks">
            <li className="yes">Viewing balances and statements</li>
            <li className="yes">Receiving incoming funds (held, not rejected)</li>
            <li className="yes">Exporting data for your accountant</li>
          </ul>
          <button className="link-btn" onClick={() => onGo("access")}>
            See full access scope →
          </button>
        </Panel>
      </div>

      <Panel title="If your POS is linked to this account">
        <p className="p">
          Card takings will keep being collected and <strong>held</strong> — they
          are not rejected and your customers see nothing unusual. You can
          nominate a different settlement account for the duration of the hold so
          you keep trading.
        </p>
        <div className="btn-row">
          <button className="btn ghost">Nominate a settlement account</button>
        </div>
      </Panel>

      <Panel title="What happens next" tone="quiet">
        <p className="p">
          We've logged the four documents you submitted on 17 February. Review
          normally takes <strong>up to 10 working days</strong>. You'll get an
          email at every stage change — you don't need to call to find out where
          it stands.
        </p>
        <div className="btn-row">
          <button className="btn" onClick={() => onGo("status")}>
            Track the review
          </button>
          {blocked && (
            <button className="btn ghost" onClick={() => onGo("action")}>
              {outstanding} item{outstanding > 1 ? "s" : ""} need you
            </button>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* ── 2 · Status ─────────────────────────────────────────── */

function Status({ day, slipped, blocked, outstanding, onGo }: any) {
  const currentIdx = blocked ? 1 : day > 10 ? 2 : day > 4 ? 1 : 0;
  const log = blocked
    ? [
        ["Today, 09:12", "We requested 2 further documents"],
        ["Day 4, 14:30", "Moved to compliance review"],
        ["Day 2, 11:05", "2 of 4 documents accepted"],
        ["Day 1, 08:40", "Hold applied · ownership change"],
      ]
    : slipped
    ? [
        ["Day 19 · 16 Mar", "Escalated to named owner — estimate breached"],
        ["Day 18 · 13 Mar", "Still with external registry — no movement"],
        ["Day 11 · 3 Mar", "Moved to external verification"],
        ["Day 4 · 20 Feb", "Moved to compliance review"],
        ["Day 1 · 17 Feb", "Hold applied · ownership change requested"],
      ]
    : [
        ["Day 4, 14:30", "Moved to compliance review"],
        ["Day 2, 11:05", "All 4 documents accepted"],
        ["Day 1, 08:40", "Hold applied · ownership change"],
      ];
  return (
    <div className="page">
      <p className="kicker">Review status</p>
      <h1 className="h1">Where your review actually is</h1>
      <p className="lede">
        We can't share the details of a compliance review, but we can always tell
        you which stage it's in, who it's with, and when it last moved.
      </p>

      {blocked && (
        <div className="alert block">
          <span className="alert-title">The clock is paused — this one's with you</span>
          <p className="p">
            We can't continue until we have {outstanding} outstanding document
            {outstanding > 1 ? "s" : ""}. Your remaining days don't tick down
            while we wait, so you're not losing time — but the review can't move
            either.
          </p>
          <button className="btn small dark" onClick={() => onGo("action")}>
            See what's needed
          </button>
        </div>
      )}

      {slipped && !blocked && (
        <div className="alert">
          <span className="alert-title">
            We've missed our estimate, and we've been telling you the wrong thing
          </span>
          <p className="p">
            Your review passed our 10-working-day estimate on day 11. It's now
            with external registry verification, which we don't control. Our
            revised estimate is <strong>4–6 more working days</strong>.
          </p>
          <div className="promises">
            <span className="promises-title">
              What we told you before, and why it was wrong
            </span>
            <div className="promise-row">
              <span className="promise-when">Day 12, 14, 16, 18</span>
              <span className="promise-what">
                "Please wait another 24 hours" — our agents couldn't see the
                external stage, so they guessed. They can now.
              </span>
            </div>
            <div className="promise-row">
              <span className="promise-when">Day 15</span>
              <span className="promise-what">
                A call promising same-day activation. That was wrong and we
                shouldn't have said it.
              </span>
            </div>
          </div>
          <span className="alert-meta">
            Owner: A. Rahman · Escalated day 11 · Next update by day {day + 2}, with
            or without news
          </span>
        </div>
      )}

      <div className="stages">
        {STAGES.map((s, i) => {
          const st = i < currentIdx ? "done" : i === currentIdx ? "now" : "todo";
          const waiting = blocked && i === 1;
          return (
            <div key={s.id} className={`stage ${st} ${waiting ? "wait" : ""}`}>
              <span className="stage-node">
                {st === "done" ? "✓" : waiting ? "!" : i + 1}
              </span>
              <div className="stage-body">
                <span className="stage-label">
                  {waiting ? "Compliance review — paused" : s.label}
                </span>
                <span className="stage-note">
                  {st === "done"
                    ? s.note
                    : waiting
                    ? "Waiting on documents from you, not from us"
                    : st === "now"
                    ? i === 2
                      ? "With external registry — outside our control"
                      : "In progress with our compliance team"
                    : "Not started"}
                </span>
              </div>
              <span className="stage-when">
                {st === "done" ? `Day ${i === 0 ? 1 : 4}` : st === "now" ? "Now" : "—"}
              </span>
            </div>
          );
        })}
      </div>

      <section className="panel">
        <h2 className="panel-title">Activity — what's changed</h2>
        <div className="log">
          {log.map(([when, what]) => (
            <div key={when} className="log-row">
              <span className="log-when">{when}</span>
              <span className="log-what">{what}</span>
            </div>
          ))}
        </div>
        <p className="p small logfoot">
          Every change appears here first. If nothing new is listed, nothing has
          changed — calling won't reveal more than this page shows.
        </p>
      </section>

      <div className="grid2">
        <Panel title="Estimate">
          <p className="big-num">
            {blocked ? "Paused" : slipped ? "4–6" : Math.max(10 - day, 1)}
          </p>
          <p className="p small">
            {blocked
              ? "resumes when we have your documents"
              : slipped
              ? "more working days, revised on day 11"
              : "working days remaining on the original estimate"}
          </p>
        </Panel>
        <Panel title="Last movement">
          <p className="big-num">Day {blocked ? day : slipped ? 11 : 4}</p>
          <p className="p small">
            {blocked
              ? "We asked you for 2 more documents."
              : `Moved to ${
                  slipped ? "external verification" : "compliance review"
                }. No action needed from you.`}
          </p>
        </Panel>
      </div>
    </div>
  );
}

/* ── 3 · Action required ────────────────────────────────── */

function ActionRequired({ docs, setDocs, onGo }: any) {
  const outstanding = docs.filter((d: any) => d.state === "needed").length;
  const upload = (i: number) =>
    setDocs(docs.map((d: any, j: number) => (j === i ? { ...d, state: "submitted", when: "Submitted just now" } : d)));

  return (
    <div className="page">
      <p className="kicker">Action required</p>
      <h1 className="h1">
        {outstanding === 0
          ? "Nothing outstanding — it's with us now."
          : `${outstanding} things we need from you`}
      </h1>
      <p className="lede">
        Only these items are outstanding. Everything else you sent has been
        accepted — you don't need to resubmit it.
      </p>

      <div className="docs">
        {docs.map((d: any, i: number) => (
          <div key={d.name} className={`doc ${d.state}`}>
            <div className="doc-row">
              <span className={`doc-pip ${d.state}`} />
              <div className="doc-text">
                <span className="doc-name">{d.name}</span>
                <span className="doc-meta">
                  {d.state === "needed" ? d.why : d.when}
                </span>
              </div>
              {d.state === "needed" ? (
                <button className="btn small" onClick={() => upload(i)}>
                  Upload
                </button>
              ) : (
                <span className={`tag ${d.state}`}>
                  {d.state === "accepted" ? "Accepted" : "Submitted"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {outstanding === 0 ? (
        <Panel title="What happens now">
          <p className="p">
            Everything's with us. The clock restarts today and your review returns
            to compliance — you'll see it move on the status page, and we'll email
            you at each stage. <strong>Nothing else is needed from you.</strong>
          </p>
          <div className="btn-row">
            <button className="btn" onClick={() => onGo("status")}>
              View updated status
            </button>
          </div>
        </Panel>
      ) : (
        <Panel title="Why we're asking again" tone="quiet">
          <p className="p">
            We asked for the board resolution once before. This isn't a repeat
            request — the file you sent was the unsigned draft. We've kept
            everything else, so this is the only gap.
          </p>
        </Panel>
      )}

      <button className="btn ghost wide" onClick={() => onGo("status")}>
        ← Back to status
      </button>
    </div>
  );
}

/* ── 4 · Access scope ───────────────────────────────────── */

function Access() {
  const rows = [
    ["View balances and transaction history", true],
    ["Download statements and export data", true],
    ["Receive incoming transfers (held in account)", true],
    ["Add or view team members", true],
    ["Outgoing transfers and payments", false],
    ["Card spending", false],
    ["POS settlement to this account", false],
    ["Closing the account", false],
  ];
  return (
    <div className="page">
      <p className="kicker">Access scope</p>
      <h1 className="h1">Exactly what you can and can't do right now</h1>
      <p className="lede">
        A hold doesn't mean a blackout. We restrict only what the regulation
        requires — everything else stays open so you can keep running your
        books.
      </p>
      <div className="scope">
        {rows.map(([label, ok]: any) => (
          <div key={label} className={`scope-row ${ok ? "on" : "off"}`}>
            <span className="scope-mark">{ok ? "✓" : "—"}</span>
            <span className="scope-label">{label}</span>
            <span className="scope-state">{ok ? "Available" : "Restricted"}</span>
          </div>
        ))}
      </div>
      <Panel title="About incoming payments" tone="quiet">
        <p className="p">
          Money sent to you is <strong>held, not returned</strong>. It'll land in
          your balance the moment the hold lifts. Your customers don't see a
          failed payment, and you don't lose the transaction.
        </p>
      </Panel>
    </div>
  );
}

/* ── 5 · Resolved ───────────────────────────────────────── */

function Resolved(_props: any) {
  return (
    <div className="page">
      <div className="done-mark">✓</div>
      <p className="kicker ok">Resolved</p>
      <h1 className="h1">Your account is active again.</h1>
      <p className="lede">
        The ownership change is complete and all restrictions have been lifted.
        Incoming funds held during the review have been released into your
        balance.
      </p>
      <Panel title="What happened, in short">
        <div className="summary">
          <div><span>Hold started</span><span>17 Feb · ownership change</span></div>
          <div><span>Documents accepted</span><span>4 of 4</span></div>
          <div><span>Held funds released</span><span>AED 48,200 · 3 transfers</span></div>
          <div><span>Total duration</span><span>14 working days</span></div>
        </div>
      </Panel>
      <Panel title="One thing to know" tone="quiet">
        <p className="p">
          Your next annual compliance refresh is due in November. We'll ask for
          documents <strong>4 weeks ahead</strong> so it never interrupts trading
          again.
        </p>
      </Panel>
    </div>
  );
}

/* ── Shared ─────────────────────────────────────────────── */

function Panel({ title, children, tone }: any) {
  return (
    <section className={`panel ${tone || ""}`}>
      <h2 className="panel-title">{title}</h2>
      {children}
    </section>
  );
}

function Sim({ day, setDay, resolved, setResolved, setDocs, onGo }: any) {
  const clear = () =>
    setDocs((ds: any[]) => ds.map((d: any) => (d.state === "needed" ? { ...d, state: "accepted", when: "Accepted working day 5" } : d)));
  return (
    <div className="sim">
      <span className="sim-label">Prototype — simulate</span>
      <div className="sim-actions">
        <button
          className="sim-btn"
          onClick={() => {
            setResolved(false);
            setDay(6);
            setDocs(DOCS);
            onGo("status");
          }}
        >
          Waiting on you
        </button>
        <button
          className="sim-btn"
          onClick={() => {
            setResolved(false);
            setDay(6);
            clear();
            onGo("status");
          }}
        >
          Day 6 · on track
        </button>
        <button
          className="sim-btn"
          onClick={() => {
            setResolved(false);
            setDay(19);
            clear();
            onGo("status");
          }}
        >
          Day 19 · a month in
        </button>
        <button
          className="sim-btn"
          onClick={() => {
            setDay(14);
            clear();
            setResolved(true);
          }}
        >
          Resolved
        </button>
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────── */

function Styles() {
  return (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    .mz{
      --ink:#14161A; --ink2:#4E545E; --ink3:#878D98;
      --paper:#F7F7F5; --card:#FFFFFF; --line:#E4E5E2; --line2:#D3D5D1;
      --dark:#1B1F26; --dark2:#252A33; --dark3:#8A929E;
      --go:#1F7A5A; --go-soft:#E8F2ED;
      --hold:#B5761C; --hold-soft:#FAF0DF;
      --stop:#B4443F;
      --sans:'IBM Plex Sans',system-ui,sans-serif;
      --mono:'IBM Plex Mono',ui-monospace,monospace;
      font-family:var(--sans); color:var(--ink); background:var(--paper);
      -webkit-font-smoothing:antialiased; width:100%;
    }
    .mz *{box-sizing:border-box}
    .mz button{font-family:inherit;cursor:pointer}
    .mz :is(button,a):focus-visible{outline:2px solid var(--go);outline-offset:2px}

    .mz-shell{display:flex;min-height:640px;max-width:1120px;margin:0 auto;
      background:var(--paper);border:1px solid var(--line);border-radius:14px;overflow:hidden}

    /* Rail */
    .rail{width:252px;flex-shrink:0;background:var(--dark);color:#fff;
      display:flex;flex-direction:column;padding:22px 18px}
    .rail-brand{display:flex;align-items:center;gap:10px;margin-bottom:26px}
    .rail-mark{width:28px;height:28px;border-radius:7px;background:#fff;color:var(--dark);
      display:grid;place-items:center;font-weight:600;font-size:15px}
    .rail-name{font-size:15px;font-weight:600;letter-spacing:-.01em}
    .rail-biz{display:block;font-size:10.5px;font-weight:400;color:var(--dark3);
      letter-spacing:.14em;text-transform:uppercase;margin-top:1px}
    .rail-disclaimer{font-size:10px;line-height:1.45;color:var(--dark3);letter-spacing:.03em;
      margin:-16px 0 20px;padding:7px 9px;border:1px dashed #3A414C;border-radius:6px}
    .rail-acct{background:var(--dark2);border-radius:9px;padding:12px 13px;margin-bottom:22px}
    .rail-acct-name{display:block;font-size:13px;font-weight:500;margin-bottom:6px}
    .rail-acct-state{display:inline-block;font-size:11px;font-weight:500;padding:3px 9px;
      border-radius:99px;letter-spacing:.02em}
    .rail-acct-state.held{background:rgba(181,118,28,.22);color:#E5B268}
    .rail-acct-state.ok{background:rgba(31,122,90,.24);color:#6ECBA3}
    .rail-nav{display:flex;flex-direction:column;gap:2px;flex:1}
    .rail-item{background:none;border:none;text-align:left;padding:10px 11px;border-radius:8px;
      color:var(--dark3);transition:.15s}
    .rail-item:hover{background:var(--dark2);color:#fff}
    .rail-item.on{background:var(--dark2);color:#fff}
    .rail-item-label{display:block;font-size:13.5px;font-weight:500}
    .rail-item-sub{display:block;font-size:11.5px;color:var(--dark3);margin-top:1px}
    .rail-item.on .rail-item-sub{color:#A9B2BF}
    .rail-foot{border-top:1px solid var(--dark2);padding-top:16px;margin-top:16px}
    .rail-foot-k{display:block;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--dark3)}
    .rail-foot-v{display:block;font-family:var(--mono);font-size:16px;margin:4px 0 6px}
    .rail-foot-note{display:block;font-size:11.5px;line-height:1.45;color:var(--dark3)}

    /* Main */
    .mz-main{flex:1;min-width:0;display:flex;flex-direction:column}
    .strip{display:flex;align-items:center;gap:11px;padding:13px 26px;background:var(--card);
      border-bottom:1px solid var(--line);font-size:13.5px}
    .strip-dot{width:8px;height:8px;border-radius:99px;background:var(--go);flex-shrink:0}
    .strip-dot.slip{background:var(--hold)}
    .strip-dot.ok{background:var(--go)}
    .strip.slip{background:var(--hold-soft)}
    .strip.ok{background:var(--go-soft)}
    .strip.block{background:var(--hold-soft)}
    .strip-dot.block{background:var(--hold)}
    .strip-act{margin-left:auto;background:var(--dark);color:#fff;border:none;border-radius:99px;
      padding:6px 14px;font-size:12.5px;font-weight:500}
    .strip-act:hover{background:#000}
    .rail-badge{display:inline-grid;place-items:center;min-width:17px;height:17px;padding:0 5px;
      margin-left:7px;border-radius:99px;background:var(--hold);color:#fff;
      font-size:10.5px;font-weight:600;vertical-align:middle}
    .tick-note{display:block;font-size:12px;color:var(--hold);margin-top:3px}
    .promises{background:rgba(255,255,255,.6);border-radius:8px;padding:13px 15px;margin-top:14px}
    .promises-title{display:block;font-size:11px;font-weight:600;letter-spacing:.1em;
      text-transform:uppercase;color:var(--hold);margin-bottom:10px}
    .promise-row{display:flex;gap:14px;padding:7px 0;align-items:baseline}
    .promise-row:not(:last-child){border-bottom:1px solid rgba(181,118,28,.18)}
    .promise-when{font-family:var(--mono);font-size:11.5px;color:var(--hold);
      min-width:106px;flex-shrink:0}
    .promise-what{font-size:13px;line-height:1.5;color:var(--ink2)}
    .alert.block{background:var(--hold-soft);border-color:#EBD5AE}
    .btn.dark{background:var(--dark);color:#fff;border:none;margin-top:13px}
    .stage.wait .stage-node{border-color:var(--hold);background:var(--hold);color:#fff;
      box-shadow:0 0 0 3px rgba(181,118,28,.15)}
    .stage.wait .stage-label{color:var(--hold)}
    .log{display:flex;flex-direction:column}
    .log-row{display:flex;gap:16px;padding:9px 0;font-size:13.5px;align-items:baseline}
    .log-row:not(:last-child){border-bottom:1px solid var(--line)}
    .log-when{font-family:var(--mono);font-size:11.5px;color:var(--ink3);
      min-width:108px;flex-shrink:0}
    .log-what{color:var(--ink2)}
    .logfoot{margin-top:13px;padding-top:12px;border-top:1px dashed var(--line2)}
    .strip-main{font-weight:500}
    .strip-meta{margin-left:auto;font-family:var(--mono);font-size:11.5px;color:var(--ink3)}

    .page{padding:34px 40px 20px;max-width:720px}
    .kicker{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
      color:var(--ink3);margin:0 0 12px}
    .kicker.ok{color:var(--go)}
    .h1{font-size:27px;line-height:1.24;font-weight:600;letter-spacing:-.018em;margin:0 0 12px;max-width:22ch}
    .lede{font-size:15.5px;line-height:1.6;color:var(--ink2);margin:0 0 26px;max-width:56ch}
    .p{font-size:14.5px;line-height:1.6;color:var(--ink2);margin:0}
    .p.small{font-size:13px;margin-top:4px}
    .p strong{color:var(--ink);font-weight:600}

    .panel{background:var(--card);border:1px solid var(--line);border-radius:11px;
      padding:18px 20px;margin-bottom:16px}
    .panel.quiet{background:transparent;border-style:dashed}
    .panel-title{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
      color:var(--ink3);margin:0 0 12px}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
    .grid2 .panel{margin:0}

    .ticks{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px}
    .ticks li{font-size:14px;color:var(--ink2);padding-left:22px;position:relative;line-height:1.45}
    .ticks li::before{position:absolute;left:0;top:0;font-weight:600}
    .ticks li.yes::before{content:"✓";color:var(--go)}
    .ticks li.no::before{content:"—";color:var(--stop)}

    .link-btn{background:none;border:none;padding:0;margin-top:13px;color:var(--go);
      font-size:13px;font-weight:500}
    .link-btn:hover{text-decoration:underline}

    .btn{background:var(--dark);color:#fff;border:none;border-radius:8px;padding:11px 18px;
      font-size:14px;font-weight:500;transition:.15s}
    .btn:hover{background:#000}
    .btn.ghost{background:none;color:var(--ink);border:1px solid var(--line2)}
    .btn.ghost:hover{border-color:var(--ink2);background:var(--card)}
    .btn.small{padding:7px 14px;font-size:13px}
    .btn.wide{width:100%;margin-top:4px}
    .btn-row{display:flex;gap:10px;margin-top:16px}

    .alert{background:var(--hold-soft);border:1px solid #EBD5AE;border-radius:11px;
      padding:17px 19px;margin-bottom:20px}
    .alert-title{display:block;font-size:14.5px;font-weight:600;color:var(--hold);margin-bottom:7px}
    .alert-meta{display:block;font-family:var(--mono);font-size:11.5px;color:var(--hold);margin-top:11px}

    .stages{background:var(--card);border:1px solid var(--line);border-radius:11px;
      padding:6px 20px;margin-bottom:16px}
    .stage{display:flex;align-items:center;gap:14px;padding:15px 0;position:relative}
    .stage:not(:last-child){border-bottom:1px solid var(--line)}
    .stage-node{width:24px;height:24px;border-radius:99px;flex-shrink:0;display:grid;place-items:center;
      font-size:11.5px;font-weight:600;border:1.5px solid var(--line2);color:var(--ink3);background:var(--card)}
    .stage.done .stage-node{background:var(--go);border-color:var(--go);color:#fff}
    .stage.now .stage-node{border-color:var(--hold);color:var(--hold);background:var(--hold-soft);
      box-shadow:0 0 0 3px rgba(181,118,28,.13)}
    .stage-body{flex:1;display:flex;flex-direction:column;gap:2px}
    .stage-label{font-size:14.5px;font-weight:500}
    .stage.todo .stage-label{color:var(--ink3)}
    .stage-note{font-size:12.5px;color:var(--ink3);line-height:1.4}
    .stage-when{font-family:var(--mono);font-size:12px;color:var(--ink3);flex-shrink:0}

    .big-num{font-family:var(--mono);font-size:30px;font-weight:500;margin:0;letter-spacing:-.02em}

    .docs{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
    .doc{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
    .doc.needed{border-color:#EBD5AE;background:var(--hold-soft)}
    .doc-row{display:flex;align-items:center;gap:13px}
    .doc-pip{width:8px;height:8px;border-radius:99px;flex-shrink:0;background:var(--go)}
    .doc-pip.needed{background:var(--hold)}
    .doc-pip.submitted{background:var(--ink3)}
    .doc-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
    .doc-name{font-size:14.5px;font-weight:500}
    .doc-meta{font-size:12.5px;color:var(--ink2);line-height:1.45}
    .tag{font-size:11.5px;font-weight:500;padding:4px 10px;border-radius:99px;white-space:nowrap}
    .tag.accepted{background:var(--go-soft);color:var(--go)}
    .tag.submitted{background:#EDEEEB;color:var(--ink2)}

    .scope{background:var(--card);border:1px solid var(--line);border-radius:11px;
      padding:4px 20px;margin-bottom:16px}
    .scope-row{display:flex;align-items:center;gap:14px;padding:12px 0;font-size:14px}
    .scope-row:not(:last-child){border-bottom:1px solid var(--line)}
    .scope-mark{width:18px;font-weight:600;flex-shrink:0}
    .scope-row.on .scope-mark{color:var(--go)}
    .scope-row.off .scope-mark{color:var(--stop)}
    .scope-label{flex:1}
    .scope-row.off .scope-label{color:var(--ink2)}
    .scope-state{font-size:12px;color:var(--ink3);font-family:var(--mono)}

    .done-mark{width:46px;height:46px;border-radius:99px;background:var(--go);color:#fff;
      display:grid;place-items:center;font-size:20px;margin-bottom:18px}
    .summary{display:flex;flex-direction:column;gap:1px}
    .summary > div{display:flex;justify-content:space-between;gap:16px;padding:9px 0;font-size:14px}
    .summary > div:not(:last-child){border-bottom:1px solid var(--line)}
    .summary span:first-child{color:var(--ink2)}
    .summary span:last-child{font-weight:500;font-family:var(--mono);font-size:13px}

    .sim{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:12px;
      padding:14px 26px;border-top:1px dashed var(--line2);background:var(--card);flex-wrap:wrap}
    .sim-label{font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--ink3);font-weight:600}
    .sim-actions{display:flex;gap:8px;flex-wrap:wrap}
    .sim-btn{background:none;border:1px solid var(--line2);border-radius:99px;padding:6px 13px;
      font-size:12.5px;color:var(--ink2);transition:.15s}
    .sim-btn:hover{border-color:var(--ink2);color:var(--ink)}

    .mz-anim{animation:mzIn .4s cubic-bezier(.4,0,.2,1)}
    @keyframes mzIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

    @media(max-width:820px){
      .mz-shell{flex-direction:column;border-radius:0;border-left:none;border-right:none}
      .rail{width:100%;padding:16px}
      .rail-nav{flex-direction:row;overflow-x:auto;gap:6px}
      .rail-item{white-space:nowrap;padding:8px 12px}
      .rail-item-sub{display:none}
      .rail-foot{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
      .rail-foot-note{display:none}
      .rail-foot-v{margin:0}
      .page{padding:26px 20px 16px}
      .h1{font-size:23px}
      .grid2{grid-template-columns:1fr}
      .strip{padding:12px 20px;flex-wrap:wrap;gap:8px}
      .strip-meta{margin-left:0;width:100%}
      .sim{padding:12px 20px}
    }
    @media(prefers-reduced-motion:reduce){.mz-anim{animation:none}}
    `}</style>
  );
}
