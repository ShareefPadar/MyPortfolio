"use client";

import { useState, useEffect } from "react";

// ── Sanad · KYB onboarding prototype ─────────────────────────────
// A self-initiated B2B fintech case study by Shareef Padar.
// Six screens: Overview · Business · Owners · Documents · Pending · Rejection.
// Design direction: Mercury-calm, warm off-white, deep-evergreen brand,
// borders over shadows, restraint everywhere except the two moments
// incumbents fumble — the honest wait and the blameless rejection.

const STEPS = [
  { id: "business", label: "Business", sub: "Company details" },
  { id: "owners", label: "Owners", sub: "Who controls it" },
  { id: "documents", label: "Documents", sub: "Proof & IDs" },
  { id: "review", label: "Review", sub: "Confirm & submit" },
];

export default function SanadPrototype() {
  const [screen, setScreen] = useState("overview");
  const [flagged, setFlagged] = useState<string | null>(null); // doc id needing resubmit
  const stepIndex = STEPS.findIndex((s) => s.id === screen);

  return (
    <div className="sanad-root">
      <Styles />
      <TopBar screen={screen} onExit={() => setScreen("overview")} />

      {screen === "overview" && <Overview onStart={() => setScreen("business")} />}

      {["business", "owners", "documents", "review"].includes(screen) && (
        <div className="shell">
          <Rail current={screen} onJump={setScreen} />
          <main className="main">
            <div key={screen} className="screen-anim">
              {screen === "business" && (
                <Business onNext={() => setScreen("owners")} />
              )}
              {screen === "owners" && (
                <Owners
                  onNext={() => setScreen("documents")}
                  onBack={() => setScreen("business")}
                />
              )}
              {screen === "documents" && (
                <Documents
                  flagged={flagged}
                  onNext={() => setScreen("review")}
                  onBack={() => setScreen("owners")}
                />
              )}
              {screen === "review" && (
                <Review
                  onSubmit={() => {
                    setFlagged(null);
                    setScreen("pending");
                  }}
                  onBack={() => setScreen("documents")}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {screen === "pending" && (
        <Pending
          onApprove={() => setScreen("approved")}
          onReject={() => {
            setFlagged("address");
            setScreen("rejected");
          }}
        />
      )}

      {screen === "approved" && <Approved onRestart={() => setScreen("overview")} />}

      {screen === "rejected" && (
        <Rejected onFix={() => setScreen("documents")} />
      )}
    </div>
  );
}

/* ── Chrome ─────────────────────────────────────────────── */

function TopBar({ screen, onExit }: any) {
  const inFlow = ["business", "owners", "documents", "review"].includes(screen);
  return (
    <header className="topbar">
      <button className="wordmark" onClick={onExit} aria-label="Sanad home">
        Sanad<span className="wordmark-dot">.</span>
      </button>
      {inFlow ? (
        <button className="ghost-link" onClick={onExit}>
          Save &amp; exit
        </button>
      ) : (
        <span className="topbar-tag">Business verification</span>
      )}
    </header>
  );
}

function Rail({ current, onJump }: any) {
  const order = ["business", "owners", "documents", "review"];
  const curIdx = order.indexOf(current);
  const pct = Math.round(((curIdx) / order.length) * 100);
  return (
    <aside className="rail">
      <div className="rail-head">
        <p className="rail-kicker">Getting Sanad ready</p>
        <p className="rail-title">A few steps to verify your business</p>
      </div>
      <div className="rail-progress">
        <div className="rail-progress-bar" style={{ width: `${Math.max(pct, 4)}%` }} />
      </div>
      <ol className="rail-steps">
        {STEPS.map((s, i) => {
          const state =
            i < curIdx ? "done" : i === curIdx ? "active" : "todo";
          return (
            <li
              key={s.id}
              className={`rail-step ${state}`}
              onClick={() => i <= curIdx && onJump(s.id)}
              role={i <= curIdx ? "button" : undefined}
            >
              <span className="rail-node">
                {state === "done" ? <Check /> : <span className="rail-num">{i + 1}</span>}
              </span>
              <span className="rail-step-text">
                <span className="rail-step-label">{s.label}</span>
                <span className="rail-step-sub">{s.sub}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="rail-foot">
        <ShieldSmall /> Your details are encrypted and used only for verification.
      </p>
    </aside>
  );
}

/* ── Screen 1 · Overview (the map) ──────────────────────── */

function Overview({ onStart }: any) {
  return (
    <div className="overview screen-anim">
      <div className="ov-card">
        <p className="ov-kicker">Verify your business</p>
        <h1 className="ov-title">
          Let&rsquo;s get your business verified so you can start moving money.
        </h1>
        <p className="ov-lede">
          Regulators require us to confirm a few things before you go live. Here&rsquo;s
          the whole path up front — no surprises. Most businesses finish the form in
          about 10 minutes.
        </p>

        <ol className="ov-steps">
          {[
            ["Business details", "Legal name, registration, address.", "~3 min"],
            ["Owners", "Anyone who owns or controls 25%+.", "~4 min"],
            ["Documents", "Proof of the above. Miss one? Add it later.", "~3 min"],
            ["Review", "Check it over and submit.", "~1 min"],
          ].map(([t, d, time], i) => (
            <li key={t} className="ov-step">
              <span className="ov-step-num">{i + 1}</span>
              <span className="ov-step-body">
                <span className="ov-step-title">{t}</span>
                <span className="ov-step-desc">{d}</span>
              </span>
              <span className="ov-step-time">{time}</span>
            </li>
          ))}
        </ol>

        <div className="ov-after">
          <ClockSmall />
          <span>
            After you submit, verification takes <strong>1&ndash;2 business days</strong>.
            You can leave and pick up exactly where you left off.
          </span>
        </div>

        <button className="btn-primary btn-lg" onClick={onStart}>
          Start verification
        </button>
      </div>
    </div>
  );
}

/* ── Screen 2 · Business details ────────────────────────── */

function Business({ onNext }: any) {
  const [why, setWhy] = useState<string | null>(null);
  return (
    <FormShell
      kicker="Step 1 of 4"
      title="Tell us about your business"
      lede="This is what regulators call the “business identity.” We only ask what we’re required to verify."
    >
      <Prefilled
        label="Legal business name"
        value="Meridian Trading FZ-LLC"
        note="Pulled from your sign-up"
      />
      <Field
        label="Registration number"
        placeholder="e.g. 2039481"
        why="This is checked against the official business registry to confirm your company legally exists."
        active={why === "reg"}
        onWhy={() => setWhy(why === "reg" ? null : "reg")}
      />
      <div className="field-row">
        <Field label="Entity type" placeholder="Free Zone LLC" small />
        <Field label="Date incorporated" placeholder="MM / YYYY" small />
      </div>
      <Field
        label="Registered address"
        placeholder="Street, city, country"
        why="We confirm your business operates from a real, verifiable address. A PO box won’t pass."
        active={why === "addr"}
        onWhy={() => setWhy(why === "addr" ? null : "addr")}
      />

      <NavRow next="Continue to owners" onNext={onNext} />
    </FormShell>
  );
}

/* ── Screen 3 · Beneficial owners ───────────────────────── */

function Owners({ onNext, onBack }: any) {
  const [owners, setOwners] = useState<any[]>([
    { name: "You (Shareef Padar)", role: "Primary applicant", pct: 60, you: true },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", pct: "" });
  const total = owners.reduce((s, o) => s + (Number(o.pct) || 0), 0);

  return (
    <FormShell
      kicker="Step 2 of 4"
      title="Who owns or controls the business?"
      lede="Add anyone who owns 25% or more, plus anyone who controls it (like a director). We verify each person’s identity."
    >
      <div className="owner-list">
        {owners.map((o, i) => (
          <div key={i} className={`owner-card ${o.you ? "you" : ""}`}>
            <span className="owner-avatar">{o.name.trim()[0]}</span>
            <span className="owner-info">
              <span className="owner-name">{o.name}</span>
              <span className="owner-role">{o.role || "Beneficial owner"}</span>
            </span>
            <span className="owner-pct">{o.pct}%</span>
            {!o.you && (
              <button
                className="owner-remove"
                onClick={() => setOwners(owners.filter((_, j) => j !== i))}
                aria-label="Remove owner"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {adding ? (
        <div className="owner-add-form">
          <div className="field-row">
            <Field
              label="Full legal name"
              placeholder="As on their ID"
              small
              value={draft.name}
              onChange={(v: string) => setDraft({ ...draft, name: v })}
            />
            <Field
              label="Ownership %"
              placeholder="25"
              small
              value={draft.pct}
              onChange={(v: string) => setDraft({ ...draft, pct: v })}
            />
          </div>
          <p className="owner-add-hint">
            We’ll ask this person to verify their ID by secure link — you don’t need
            their documents on hand right now.
          </p>
          <div className="owner-add-actions">
            <button className="btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                if (!draft.name) return;
                setOwners([...owners, { ...draft, pct: draft.pct || 0 }]);
                setDraft({ name: "", pct: "" });
                setAdding(false);
              }}
            >
              Add person
            </button>
          </div>
        </div>
      ) : (
        <button className="add-row" onClick={() => setAdding(true)}>
          <span className="add-plus">+</span> Add another owner
        </button>
      )}

      <div className={`owner-total ${total > 100 ? "over" : ""}`}>
        <span>Ownership accounted for</span>
        <span className="owner-total-val">{total}%</span>
      </div>

      <NavRow next="Continue to documents" onNext={onNext} onBack={onBack} />
    </FormShell>
  );
}

/* ── Screen 4 · Documents ───────────────────────────────── */

function Documents({ onNext, onBack, flagged }: any) {
  const [docs, setDocs] = useState<any>({
    incorporation: "uploaded",
    address: flagged === "address" ? "flagged" : "todo",
    bank: "todo",
  });
  const [why, setWhy] = useState<string | null>(null);

  useEffect(() => {
    if (flagged === "address") setDocs((d: any) => ({ ...d, address: "flagged" }));
  }, [flagged]);

  const rows = [
    {
      id: "incorporation",
      name: "Certificate of incorporation",
      why: "Confirms your company is officially registered. Must match the legal name above.",
      required: true,
    },
    {
      id: "address",
      name: "Proof of business address",
      why: "A utility bill or bank letter issued in the last 3 months, showing your business address.",
      required: true,
    },
    {
      id: "bank",
      name: "Recent bank statement",
      why: "Helps us confirm your business is active. If you don’t have it now, add it later — it won’t block you.",
      required: false,
    },
  ];

  return (
    <FormShell
      kicker="Step 3 of 4"
      title="Upload your documents"
      lede="Clear photos or PDFs work fine. Missing one? Skip it and add it later — we’ll hold your place."
    >
      <div className="doc-list">
        {rows.map((r) => (
          <DocRow
            key={r.id}
            row={r}
            status={docs[r.id]}
            whyOpen={why === r.id}
            onWhy={() => setWhy(why === r.id ? null : r.id)}
            onUpload={() => setDocs({ ...docs, [r.id]: "uploaded" })}
            onLater={() => setDocs({ ...docs, [r.id]: "later" })}
          />
        ))}
      </div>

      <div className="save-note">
        <SaveIcon />
        <span>Saved automatically. Close this and come back anytime.</span>
      </div>

      <NavRow next="Review and submit" onNext={onNext} onBack={onBack} />
    </FormShell>
  );
}

function DocRow({ row, status, whyOpen, onWhy, onUpload, onLater }: any) {
  return (
    <div className={`doc-row ${status}`}>
      <div className="doc-main">
        <span className="doc-icon">
          {status === "uploaded" ? <Check /> : status === "flagged" ? <Alert /> : <DocIcon />}
        </span>
        <div className="doc-text">
          <span className="doc-name">
            {row.name}
            {!row.required && <span className="doc-optional">Optional</span>}
          </span>
          {status === "flagged" ? (
            <span className="doc-flag-msg">
              Date is older than 3 months — please replace with a recent one.
            </span>
          ) : (
            <button className="why-link" onClick={onWhy}>
              {whyOpen ? "Hide" : "Why we ask"}
            </button>
          )}
        </div>
        <div className="doc-action">
          {status === "uploaded" && <span className="chip chip-done">Uploaded</span>}
          {status === "later" && <span className="chip chip-later">Added later</span>}
          {(status === "todo" || status === "flagged") && (
            <button className="btn-upload" onClick={onUpload}>
              {status === "flagged" ? "Replace" : "Upload"}
            </button>
          )}
        </div>
      </div>
      {whyOpen && status !== "flagged" && <p className="doc-why">{row.why}</p>}
      {(status === "todo") && !row.required && (
        <button className="doc-later" onClick={onLater}>
          I don&rsquo;t have this right now
        </button>
      )}
    </div>
  );
}

/* ── Review ─────────────────────────────────────────────── */

function Review({ onSubmit, onBack }: any) {
  return (
    <FormShell
      kicker="Step 4 of 4"
      title="Quick review before we verify"
      lede="Check the essentials. You can still edit any step from the list on the left."
    >
      <div className="review-groups">
        <ReviewGroup
          title="Business"
          items={[
            ["Legal name", "Meridian Trading FZ-LLC"],
            ["Registration", "2039481"],
            ["Address", "Dubai, United Arab Emirates"],
          ]}
        />
        <ReviewGroup
          title="Owners"
          items={[
            ["Shareef Padar", "60% · Primary"],
            ["1 more added", "40%"],
          ]}
        />
        <ReviewGroup
          title="Documents"
          items={[
            ["Certificate of incorporation", "Uploaded"],
            ["Proof of address", "Uploaded"],
            ["Bank statement", "Adding later"],
          ]}
        />
      </div>

      <div className="review-consent">
        <span className="consent-check"><Check /></span>
        <span>
          I confirm this information is accurate to the best of my knowledge.
        </span>
      </div>

      <NavRow next="Submit for verification" onNext={onSubmit} onBack={onBack} />
    </FormShell>
  );
}

function ReviewGroup({ title, items }: any) {
  return (
    <div className="review-group">
      <p className="review-group-title">{title}</p>
      {items.map(([k, v]: any) => (
        <div key={k} className="review-item">
          <span className="review-k">{k}</span>
          <span className="review-v">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Screen 5 · Pending (the honest wait) ───────────────── */

function Pending({ onApprove, onReject }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="pending-orb">
          <span className="pending-orb-core" />
        </div>
        <p className="outcome-kicker">Submitted &middot; under review</p>
        <h1 className="outcome-title">
          We&rsquo;re verifying Meridian Trading.
        </h1>
        <p className="outcome-lede">
          A specialist reviews your documents against official registries. This
          normally takes <strong>1&ndash;2 business days</strong> — most come back sooner.
        </p>

        <div className="timeline">
          <TimelineStep state="done" title="Received" note="Just now" />
          <TimelineStep state="active" title="Under review" note="In progress" />
          <TimelineStep state="todo" title="Decision" note="Est. within 2 days" />
        </div>

        <div className="wait-do">
          <p className="wait-do-title">While you wait, you can</p>
          <ul className="wait-do-list">
            <li>Explore your dashboard in read-only mode</li>
            <li>Invite a teammate so they&rsquo;re ready on day one</li>
          </ul>
        </div>

        <p className="notify-line">
          <MailSmall /> We&rsquo;ll email you the moment there&rsquo;s a decision — nothing to
          watch here.
        </p>

        <div className="proto-bar">
          <span className="proto-label">Prototype — simulate outcome</span>
          <div className="proto-actions">
            <button className="btn-ghost" onClick={onApprove}>Approved</button>
            <button className="btn-ghost" onClick={onReject}>Needs a fix</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ state, title, note }: any) {
  return (
    <div className={`tl-step ${state}`}>
      <span className="tl-dot">{state === "done" && <Check />}</span>
      <span className="tl-body">
        <span className="tl-title">{title}</span>
        <span className="tl-note">{note}</span>
      </span>
    </div>
  );
}

/* ── Screen 6 · Rejection / resubmit (blameless) ────────── */

function Rejected({ onFix }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="reject-mark"><Alert /></div>
        <p className="outcome-kicker amber">One thing needs another look</p>
        <h1 className="outcome-title">
          Your proof of address didn&rsquo;t go through.
        </h1>
        <p className="outcome-lede">
          The document you sent is dated more than three months ago. We just need a
          newer one — a utility bill or bank letter from the last 3 months does it.
          <strong> Everything else is verified and saved.</strong>
        </p>

        <div className="reject-detail">
          <span className="reject-detail-icon"><DocIcon /></span>
          <div className="reject-detail-body">
            <span className="reject-detail-name">Proof of business address</span>
            <span className="reject-detail-reason">Issued 14 Jan 2026 — needs to be within 3 months</span>
          </div>
        </div>

        <button className="btn-primary btn-lg" onClick={onFix}>
          Replace document
        </button>
        <button className="text-link-center">Something look wrong? Contact support</button>
      </div>
    </div>
  );
}

/* ── Approved (small reward state) ──────────────────────── */

function Approved({ onRestart }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="approve-mark"><Check /></div>
        <p className="outcome-kicker success">Verified</p>
        <h1 className="outcome-title">Meridian Trading is verified.</h1>
        <p className="outcome-lede">
          You&rsquo;re cleared to move money on Sanad. Your dashboard is fully unlocked.
        </p>
        <button className="btn-primary btn-lg" onClick={onRestart}>
          Back to start
        </button>
      </div>
    </div>
  );
}

/* ── Shared form pieces ─────────────────────────────────── */

function FormShell({ kicker, title, lede, children }: any) {
  return (
    <div className="form-shell">
      <p className="form-kicker">{kicker}</p>
      <h1 className="form-title">{title}</h1>
      <p className="form-lede">{lede}</p>
      <div className="form-body">{children}</div>
    </div>
  );
}

function Field({ label, placeholder, why, active, onWhy, small, value, onChange }: any) {
  return (
    <div className={`field ${small ? "small" : ""}`}>
      <div className="field-top">
        <label className="field-label">{label}</label>
        {why && (
          <button className="why-link" onClick={onWhy}>
            {active ? "Hide" : "Why we ask"}
          </button>
        )}
      </div>
      <input
        className="field-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e: any) => onChange(e.target.value) : undefined}
      />
      {why && active && <p className="field-why">{why}</p>}
    </div>
  );
}

function Prefilled({ label, value, note }: any) {
  return (
    <div className="field prefilled">
      <label className="field-label">{label}</label>
      <div className="prefilled-box">
        <span>{value}</span>
        <span className="prefilled-note">
          <Check /> {note}
        </span>
      </div>
    </div>
  );
}

function NavRow({ next, onNext, onBack }: any) {
  return (
    <div className="nav-row">
      {onBack ? (
        <button className="btn-ghost" onClick={onBack}>Back</button>
      ) : (
        <span />
      )}
      <button className="btn-primary" onClick={onNext}>{next}</button>
    </div>
  );
}

/* ── Icons (inline, tiny) ───────────────────────────────── */
const Check = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden>
    <path d="M3 8.5l3 3 7-7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Alert = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
    <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const DocIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
    <path d="M4 2h5l3 3v9H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const SaveIcon = () => (
  <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden>
    <path d="M3 3h8l2 2v8H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M6 3v3h4V3M6 13v-3h4v3" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);
const ShieldSmall = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden>
    <path d="M8 2l5 2v4c0 3-2.2 5-5 6-2.8-1-5-3-5-6V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const ClockSmall = () => (
  <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const MailSmall = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
    <rect x="2" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M3 5l5 3.5L13 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

/* ── Styles ─────────────────────────────────────────────── */
function Styles() {
  return (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Geist+Mono:wght@400;500&display=swap');

    .sanad-root {
      --bg:#FAF9F5; --surface:#FFFFFF; --surface-2:#F5F3ED;
      --border:#E8E6DD; --border-strong:#DAD7CB;
      --ink:#1A1B18; --ink-2:#585A50; --ink-3:#8C8D82;
      --brand:#13543F; --brand-hover:#0E4432; --brand-soft:#E9F1EC; --brand-ring:rgba(19,84,63,.16);
      --amber:#A9631F; --amber-soft:#F6ECDD;
      --success:#2E7D5B;
      --font-ui:'Instrument Sans',system-ui,-apple-system,sans-serif;
      --font-brand:'Fraunces',Georgia,serif;
      --font-mono:'Geist Mono',ui-monospace,monospace;
      font-family:var(--font-ui);
      color:var(--ink); background:var(--bg);
      min-height:100%; width:100%;
      -webkit-font-smoothing:antialiased;
      letter-spacing:-0.01em;
    }
    .sanad-root *{box-sizing:border-box;}
    .sanad-root button{font-family:inherit;cursor:pointer;}

    /* Topbar */
    .topbar{display:flex;align-items:center;justify-content:space-between;
      padding:20px 28px;border-bottom:1px solid var(--border);background:var(--bg);}
    .wordmark{font-family:var(--font-brand);font-size:22px;font-weight:600;
      color:var(--ink);background:none;border:none;letter-spacing:-0.02em;padding:0;}
    .wordmark-dot{color:var(--brand);}
    .ghost-link{background:none;border:none;color:var(--ink-2);font-size:14px;font-weight:500;}
    .ghost-link:hover{color:var(--ink);}
    .topbar-tag{font-size:13px;color:var(--ink-3);font-weight:500;}

    /* Shell */
    .shell{display:flex;gap:0;max-width:1080px;margin:0 auto;}
    .main{flex:1;display:flex;justify-content:center;padding:56px 40px 80px;}

    /* Rail */
    .rail{width:290px;flex-shrink:0;padding:56px 32px;border-right:1px solid var(--border);}
    .rail-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;
      color:var(--ink-3);font-weight:600;margin:0 0 6px;}
    .rail-title{font-size:16px;line-height:1.35;color:var(--ink);margin:0 0 22px;font-weight:500;}
    .rail-progress{height:4px;background:var(--surface-2);border-radius:99px;overflow:hidden;margin-bottom:26px;}
    .rail-progress-bar{height:100%;background:var(--brand);border-radius:99px;transition:width .5s cubic-bezier(.4,0,.2,1);}
    .rail-steps{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:2px;}
    .rail-step{display:flex;gap:13px;align-items:center;padding:11px 10px;border-radius:10px;transition:background .15s;}
    .rail-step.done,.rail-step.active{cursor:pointer;}
    .rail-step.done:hover{background:var(--surface-2);}
    .rail-node{width:26px;height:26px;border-radius:99px;display:grid;place-items:center;flex-shrink:0;
      border:1.5px solid var(--border-strong);color:var(--ink-3);font-size:12px;font-weight:600;transition:.2s;}
    .rail-step.done .rail-node{background:var(--brand);border-color:var(--brand);color:#fff;}
    .rail-step.active .rail-node{border-color:var(--brand);color:var(--brand);background:var(--brand-soft);}
    .rail-step-text{display:flex;flex-direction:column;gap:1px;}
    .rail-step-label{font-size:14px;font-weight:500;color:var(--ink-2);}
    .rail-step.active .rail-step-label,.rail-step.done .rail-step-label{color:var(--ink);}
    .rail-step-sub{font-size:12px;color:var(--ink-3);}
    .rail-foot{display:flex;gap:7px;align-items:flex-start;margin-top:34px;font-size:12px;
      line-height:1.5;color:var(--ink-3);}
    .rail-foot svg{margin-top:2px;flex-shrink:0;}

    /* Overview */
    .overview{padding:56px 24px 90px;display:flex;justify-content:center;}
    .ov-card{max-width:560px;width:100%;}
    .ov-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;
      color:var(--brand);font-weight:600;margin:0 0 14px;}
    .ov-title{font-family:var(--font-brand);font-weight:500;font-size:34px;line-height:1.16;
      letter-spacing:-0.025em;margin:0 0 16px;color:var(--ink);}
    .ov-lede{font-size:16px;line-height:1.6;color:var(--ink-2);margin:0 0 34px;max-width:52ch;}
    .ov-steps{list-style:none;padding:0;margin:0 0 26px;border:1px solid var(--border);
      border-radius:14px;overflow:hidden;background:var(--surface);}
    .ov-step{display:flex;align-items:center;gap:16px;padding:18px 20px;border-bottom:1px solid var(--border);}
    .ov-step:last-child{border-bottom:none;}
    .ov-step-num{width:26px;height:26px;border-radius:99px;background:var(--brand-soft);
      color:var(--brand);font-size:13px;font-weight:600;display:grid;place-items:center;flex-shrink:0;}
    .ov-step-body{display:flex;flex-direction:column;gap:2px;flex:1;}
    .ov-step-title{font-size:15px;font-weight:500;color:var(--ink);}
    .ov-step-desc{font-size:13.5px;color:var(--ink-2);}
    .ov-step-time{font-family:var(--font-mono);font-size:12px;color:var(--ink-3);flex-shrink:0;}
    .ov-after{display:flex;gap:11px;align-items:flex-start;padding:15px 17px;background:var(--surface-2);
      border-radius:12px;font-size:13.5px;line-height:1.55;color:var(--ink-2);margin-bottom:30px;}
    .ov-after svg{margin-top:1px;flex-shrink:0;color:var(--brand);}
    .ov-after strong{color:var(--ink);font-weight:600;}

    /* Form shell */
    .form-shell{max-width:520px;width:100%;}
    .form-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;
      color:var(--brand);font-weight:600;margin:0 0 12px;}
    .form-title{font-family:var(--font-brand);font-weight:500;font-size:27px;line-height:1.2;
      letter-spacing:-0.02em;margin:0 0 10px;}
    .form-lede{font-size:15px;line-height:1.55;color:var(--ink-2);margin:0 0 32px;max-width:50ch;}
    .form-body{display:flex;flex-direction:column;gap:20px;}

    /* Field */
    .field{display:flex;flex-direction:column;gap:7px;}
    .field-row{display:flex;gap:14px;}
    .field.small{flex:1;}
    .field-top{display:flex;justify-content:space-between;align-items:baseline;}
    .field-label{font-size:13.5px;font-weight:500;color:var(--ink);}
    .field-input{border:1px solid var(--border-strong);border-radius:10px;padding:12px 14px;
      font-size:15px;font-family:inherit;color:var(--ink);background:var(--surface);transition:.15s;width:100%;}
    .field-input::placeholder{color:var(--ink-3);}
    .field-input:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-ring);}
    .why-link{background:none;border:none;color:var(--brand);font-size:12.5px;font-weight:500;padding:0;}
    .why-link:hover{text-decoration:underline;}
    .field-why{margin:2px 0 0;font-size:13px;line-height:1.5;color:var(--ink-2);
      background:var(--brand-soft);padding:11px 13px;border-radius:9px;}
    .prefilled-box{display:flex;align-items:center;justify-content:space-between;gap:10px;
      border:1px solid var(--border);border-radius:10px;padding:12px 14px;background:var(--surface-2);font-size:15px;}
    .prefilled-note{display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--success);font-weight:500;flex-shrink:0;}

    /* Owners */
    .owner-list{display:flex;flex-direction:column;gap:10px;}
    .owner-card{display:flex;align-items:center;gap:13px;padding:14px 16px;
      border:1px solid var(--border);border-radius:12px;background:var(--surface);}
    .owner-card.you{background:var(--brand-soft);border-color:transparent;}
    .owner-avatar{width:34px;height:34px;border-radius:99px;background:var(--brand);color:#fff;
      display:grid;place-items:center;font-size:14px;font-weight:600;flex-shrink:0;}
    .owner-info{display:flex;flex-direction:column;gap:1px;flex:1;}
    .owner-name{font-size:14.5px;font-weight:500;color:var(--ink);}
    .owner-role{font-size:12.5px;color:var(--ink-2);}
    .owner-pct{font-family:var(--font-mono);font-size:13px;color:var(--ink-2);font-weight:500;}
    .owner-remove{background:none;border:none;color:var(--ink-3);font-size:20px;line-height:1;padding:0 4px;}
    .owner-remove:hover{color:var(--ink);}
    .add-row{display:flex;align-items:center;gap:9px;width:100%;padding:14px 16px;
      border:1px dashed var(--border-strong);border-radius:12px;background:none;color:var(--brand);
      font-size:14px;font-weight:500;transition:.15s;}
    .add-row:hover{background:var(--brand-soft);border-color:var(--brand);}
    .add-plus{font-size:17px;}
    .owner-add-form{border:1px solid var(--border-strong);border-radius:12px;padding:16px;background:var(--surface);
      display:flex;flex-direction:column;gap:14px;}
    .owner-add-hint{font-size:12.5px;color:var(--ink-2);line-height:1.5;margin:0;}
    .owner-add-actions{display:flex;justify-content:flex-end;gap:10px;}
    .owner-total{display:flex;justify-content:space-between;align-items:center;padding:13px 16px;
      background:var(--surface-2);border-radius:10px;font-size:13.5px;color:var(--ink-2);}
    .owner-total.over{background:var(--amber-soft);color:var(--amber);}
    .owner-total-val{font-family:var(--font-mono);font-weight:500;}

    /* Documents */
    .doc-list{display:flex;flex-direction:column;gap:12px;}
    .doc-row{border:1px solid var(--border);border-radius:12px;padding:15px 16px;background:var(--surface);transition:.15s;}
    .doc-row.uploaded{background:var(--surface-2);}
    .doc-row.flagged{border-color:var(--amber);background:var(--amber-soft);}
    .doc-main{display:flex;align-items:center;gap:13px;}
    .doc-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;flex-shrink:0;
      background:var(--surface-2);color:var(--ink-3);}
    .doc-row.uploaded .doc-icon{background:var(--brand);color:#fff;}
    .doc-row.flagged .doc-icon{background:var(--amber);color:#fff;}
    .doc-text{flex:1;display:flex;flex-direction:column;gap:3px;}
    .doc-name{font-size:14.5px;font-weight:500;color:var(--ink);display:flex;align-items:center;gap:8px;}
    .doc-optional{font-size:11px;font-weight:500;color:var(--ink-3);background:var(--surface-2);
      padding:2px 7px;border-radius:99px;}
    .doc-flag-msg{font-size:12.5px;color:var(--amber);}
    .doc-why{margin:12px 0 0;font-size:13px;line-height:1.5;color:var(--ink-2);
      padding:11px 13px;background:var(--surface-2);border-radius:9px;}
    .doc-later{margin-top:11px;background:none;border:none;color:var(--ink-2);font-size:12.5px;
      text-decoration:underline;padding:0;}
    .doc-later:hover{color:var(--ink);}
    .chip{font-size:12px;font-weight:500;padding:5px 11px;border-radius:99px;white-space:nowrap;}
    .chip-done{background:var(--brand-soft);color:var(--brand);}
    .chip-later{background:var(--surface-2);color:var(--ink-2);}
    .btn-upload{border:1px solid var(--border-strong);background:var(--surface);border-radius:9px;
      padding:8px 15px;font-size:13.5px;font-weight:500;color:var(--ink);transition:.15s;}
    .btn-upload:hover{border-color:var(--brand);color:var(--brand);}
    .save-note{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--ink-2);
      padding:2px;margin-top:2px;}
    .save-note svg{color:var(--ink-3);}

    /* Review */
    .review-groups{display:flex;flex-direction:column;gap:16px;}
    .review-group{border:1px solid var(--border);border-radius:12px;padding:16px 18px;background:var(--surface);}
    .review-group-title{font-size:12px;text-transform:uppercase;letter-spacing:.07em;
      color:var(--ink-3);font-weight:600;margin:0 0 12px;}
    .review-item{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:14px;}
    .review-k{color:var(--ink-2);}
    .review-v{color:var(--ink);font-weight:500;text-align:right;}
    .review-consent{display:flex;align-items:center;gap:11px;padding:14px 16px;
      background:var(--brand-soft);border-radius:11px;font-size:13.5px;color:var(--ink);}
    .consent-check{width:22px;height:22px;border-radius:6px;background:var(--brand);color:#fff;
      display:grid;place-items:center;flex-shrink:0;}

    /* Buttons */
    .btn-primary{background:var(--brand);color:#fff;border:none;border-radius:10px;
      padding:12px 22px;font-size:14.5px;font-weight:500;transition:.15s;letter-spacing:-0.01em;}
    .btn-primary:hover{background:var(--brand-hover);}
    .btn-lg{width:100%;padding:15px;font-size:15.5px;margin-top:6px;}
    .btn-ghost{background:none;border:1px solid var(--border-strong);border-radius:10px;
      padding:12px 20px;font-size:14.5px;font-weight:500;color:var(--ink-2);transition:.15s;}
    .btn-ghost:hover{border-color:var(--ink-2);color:var(--ink);}
    .nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:14px;}

    /* Outcome screens */
    .outcome{display:flex;justify-content:center;padding:60px 24px 90px;}
    .outcome-card{max-width:500px;width:100%;text-align:center;}
    .outcome-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;font-weight:600;
      color:var(--brand);margin:0 0 14px;}
    .outcome-kicker.amber{color:var(--amber);} .outcome-kicker.success{color:var(--success);}
    .outcome-title{font-family:var(--font-brand);font-weight:500;font-size:28px;line-height:1.22;
      letter-spacing:-0.02em;margin:0 0 14px;}
    .outcome-lede{font-size:15.5px;line-height:1.6;color:var(--ink-2);margin:0 0 30px;}
    .outcome-lede strong{color:var(--ink);font-weight:600;}

    .pending-orb{width:64px;height:64px;border-radius:99px;margin:0 auto 26px;
      background:var(--brand-soft);display:grid;place-items:center;position:relative;}
    .pending-orb::before{content:"";position:absolute;inset:0;border-radius:99px;
      border:2px solid var(--brand);opacity:.25;animation:ripple 2.4s ease-out infinite;}
    .pending-orb-core{width:20px;height:20px;border-radius:99px;background:var(--brand);
      animation:breathe 2.4s ease-in-out infinite;}
    @keyframes ripple{0%{transform:scale(.7);opacity:.4;}100%{transform:scale(1.5);opacity:0;}}
    @keyframes breathe{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(.7);opacity:.6;}}

    .timeline{display:flex;flex-direction:column;gap:0;text-align:left;
      border:1px solid var(--border);border-radius:13px;padding:6px 18px;margin-bottom:26px;background:var(--surface);}
    .tl-step{display:flex;gap:14px;align-items:center;padding:14px 0;position:relative;}
    .tl-step:not(:last-child)::after{content:"";position:absolute;left:9px;top:32px;bottom:-14px;
      width:1.5px;background:var(--border);}
    .tl-dot{width:20px;height:20px;border-radius:99px;flex-shrink:0;display:grid;place-items:center;
      border:1.5px solid var(--border-strong);color:#fff;z-index:1;background:var(--surface);}
    .tl-step.done .tl-dot{background:var(--brand);border-color:var(--brand);}
    .tl-step.active .tl-dot{border-color:var(--brand);background:var(--brand);
      box-shadow:0 0 0 4px var(--brand-ring);}
    .tl-body{display:flex;flex-direction:column;gap:1px;}
    .tl-title{font-size:14.5px;font-weight:500;color:var(--ink);}
    .tl-step.todo .tl-title{color:var(--ink-3);}
    .tl-note{font-size:12.5px;color:var(--ink-3);}

    .wait-do{text-align:left;background:var(--surface-2);border-radius:12px;padding:16px 18px;margin-bottom:20px;}
    .wait-do-title{font-size:13px;font-weight:600;color:var(--ink);margin:0 0 9px;}
    .wait-do-list{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;
      font-size:13.5px;color:var(--ink-2);line-height:1.4;}
    .notify-line{display:flex;gap:9px;align-items:center;justify-content:center;font-size:13px;
      color:var(--ink-2);margin:0 0 28px;}
    .notify-line svg{color:var(--brand);flex-shrink:0;}

    .proto-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;
      border-top:1px dashed var(--border-strong);padding-top:18px;}
    .proto-label{font-size:11.5px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em;font-weight:500;}
    .proto-actions{display:flex;gap:8px;}
    .proto-actions .btn-ghost{padding:8px 14px;font-size:13px;}

    .reject-mark{width:56px;height:56px;border-radius:99px;margin:0 auto 24px;background:var(--amber-soft);
      color:var(--amber);display:grid;place-items:center;}
    .reject-mark svg{width:22px;height:22px;}
    .reject-detail{display:flex;gap:13px;align-items:center;text-align:left;border:1px solid var(--amber);
      background:var(--amber-soft);border-radius:12px;padding:15px 16px;margin-bottom:26px;}
    .reject-detail-icon{width:34px;height:34px;border-radius:8px;background:#fff;color:var(--amber);
      display:grid;place-items:center;flex-shrink:0;}
    .reject-detail-body{display:flex;flex-direction:column;gap:2px;}
    .reject-detail-name{font-size:14.5px;font-weight:500;color:var(--ink);}
    .reject-detail-reason{font-size:12.5px;color:var(--amber);}
    .text-link-center{display:block;width:100%;text-align:center;background:none;border:none;
      color:var(--ink-2);font-size:13.5px;margin-top:14px;}
    .text-link-center:hover{color:var(--ink);text-decoration:underline;}

    .approve-mark{width:56px;height:56px;border-radius:99px;margin:0 auto 24px;background:var(--brand);
      color:#fff;display:grid;place-items:center;}
    .approve-mark svg{width:24px;height:24px;}

    /* Motion */
    .screen-anim{animation:fadeUp .45s cubic-bezier(.4,0,.2,1);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

    @media (max-width:760px){
      .shell{flex-direction:column;}
      .rail{width:100%;border-right:none;border-bottom:1px solid var(--border);padding:24px 22px;}
      .rail-steps{flex-direction:row;overflow-x:auto;gap:8px;}
      .rail-step-sub,.rail-foot{display:none;}
      .rail-step{white-space:nowrap;}
      .main{padding:36px 22px 70px;}
      .field-row{flex-direction:column;gap:20px;}
      .ov-title{font-size:28px;}
    }
    @media (prefers-reduced-motion:reduce){
      .screen-anim,.pending-orb::before,.pending-orb-core{animation:none;}
      .rail-progress-bar{transition:none;}
    }
    `}</style>
  );
}
