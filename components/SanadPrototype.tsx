"use client";

import { useState } from "react";

// ── Sanad · KYB onboarding prototype · v2 ────────────────────────
// Post-audit build. Fixes over v1:
// 1. Consent is a real, unchecked checkbox; submit disabled until checked.
// 2. "Add later" escape hatch on REQUIRED docs too (matches Decision #4).
// 3. App-level state — going back no longer wipes data ("saved automatically" is now true).
// 4. Entity type is a select, not free text.
// 5. Uploads show uploading state → filename + size + remove.
// 6. A11y: label/input association, keyboard-reachable rail, focus-visible rings.
// 7. Ownership total has guidance + error only when >100%.

const STEPS = [
  { id: "business", label: "Business", sub: "Company details" },
  { id: "owners", label: "Owners", sub: "Who controls it" },
  { id: "documents", label: "Documents", sub: "Proof & IDs" },
  { id: "review", label: "Review", sub: "Confirm & submit" },
];

const DOC_META = [
  {
    id: "incorporation",
    name: "Certificate of incorporation",
    why: "Confirms your company is officially registered. Must match the legal name above.",
    required: true,
    file: "meridian-incorporation.pdf · 1.2 MB",
  },
  {
    id: "address",
    name: "Proof of business address",
    why: "A utility bill or bank letter issued in the last 3 months, showing your business address.",
    required: true,
    file: "dewa-bill-jan.pdf · 640 KB",
  },
  {
    id: "bank",
    name: "Recent bank statement",
    why: "Helps us confirm your business is active.",
    required: false,
    file: "statement-q2.pdf · 890 KB",
  },
];

export default function SanadPrototype() {
  const [screen, setScreen] = useState("overview");

  // Lifted state — survives navigation, so "saved automatically" is true.
  const [business, setBusiness] = useState<any>({
    reg: "",
    entity: "",
    date: "",
    address: "",
  });
  const [owners, setOwners] = useState<any[]>([
    { name: "You (Shareef Padar)", role: "Primary applicant", pct: 60, you: true },
  ]);
  const [docs, setDocs] = useState<any>({
    incorporation: "todo",
    address: "todo",
    bank: "todo",
  });
  const [consented, setConsented] = useState(false);

  const flagAddress = () =>
    setDocs((d: any) => ({ ...d, address: "flagged" }));

  const resetAll = () => {
    setBusiness({ reg: "", entity: "", date: "", address: "" });
    setOwners([
      { name: "You (Shareef Padar)", role: "Primary applicant", pct: 60, you: true },
    ]);
    setDocs({ incorporation: "todo", address: "todo", bank: "todo" });
    setConsented(false);
    setScreen("overview");
  };

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
                <Business
                  data={business}
                  setData={setBusiness}
                  onNext={() => setScreen("owners")}
                />
              )}
              {screen === "owners" && (
                <Owners
                  owners={owners}
                  setOwners={setOwners}
                  onNext={() => setScreen("documents")}
                  onBack={() => setScreen("business")}
                />
              )}
              {screen === "documents" && (
                <Documents
                  docs={docs}
                  setDocs={setDocs}
                  onNext={() => setScreen("review")}
                  onBack={() => setScreen("owners")}
                />
              )}
              {screen === "review" && (
                <Review
                  business={business}
                  owners={owners}
                  docs={docs}
                  consented={consented}
                  setConsented={setConsented}
                  onSubmit={() => setScreen("pending")}
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
            flagAddress();
            setScreen("rejected");
          }}
        />
      )}

      {screen === "approved" && <Approved onRestart={resetAll} />}

      {screen === "rejected" && <Rejected onFix={() => setScreen("documents")} />}
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
  // Progress reflects the step you're IN, not only completed steps.
  const pct = Math.round(((curIdx + 0.5) / order.length) * 100);
  return (
    <aside className="rail">
      <div className="rail-head">
        <p className="rail-kicker">Getting Sanad ready</p>
        <p className="rail-title">A few steps to verify your business</p>
      </div>
      <div
        className="rail-progress"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Verification progress"
      >
        <div className="rail-progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <ol className="rail-steps">
        {STEPS.map((s, i) => {
          const state = i < curIdx ? "done" : i === curIdx ? "active" : "todo";
          const reachable = i <= curIdx;
          return (
            <li key={s.id} className={`rail-step ${state}`}>
              <button
                className="rail-step-btn"
                disabled={!reachable}
                onClick={() => reachable && onJump(s.id)}
                aria-current={state === "active" ? "step" : undefined}
              >
                <span className="rail-node">
                  {state === "done" ? <Check /> : <span className="rail-num">{i + 1}</span>}
                </span>
                <span className="rail-step-text">
                  <span className="rail-step-label">{s.label}</span>
                  <span className="rail-step-sub">{s.sub}</span>
                </span>
              </button>
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

/* ── Screen 1 · Overview ────────────────────────────────── */

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

function Business({ data, setData, onNext }: any) {
  const [why, setWhy] = useState<string | null>(null);
  const set = (k: string) => (v: string) => setData({ ...data, [k]: v });
  return (
    <FormShell
      step={1}
      total={4}
      title="Tell us about your business"
      lede="This is what regulators call the “business identity.” We only ask what we’re required to verify."
    >
      <Prefilled
        label="Legal business name"
        value="Meridian Trading FZ-LLC"
        note="Pulled from your sign-up"
      />
      <Field
        id="reg-number"
        label="Registration number"
        placeholder="e.g. 2039481"
        hint="As shown on your trade licence."
        value={data.reg}
        onChange={set("reg")}
        why="This is checked against the official business registry to confirm your company legally exists."
        active={why === "reg"}
        onWhy={() => setWhy(why === "reg" ? null : "reg")}
      />
      <div className="field-row">
        <SelectField
          id="entity-type"
          label="Entity type"
          value={data.entity}
          onChange={set("entity")}
          options={[
            "Free Zone LLC",
            "Mainland LLC",
            "Sole establishment",
            "Branch of foreign company",
            "Other",
          ]}
        />
        <Field
          id="inc-date"
          label="Date incorporated"
          placeholder="MM / YYYY"
          hint="Month and year, e.g. 06 / 2021."
          small
          value={data.date}
          onChange={set("date")}
        />
      </div>
      <Field
        id="reg-address"
        label="Registered address"
        placeholder="Street, city, country"
        value={data.address}
        onChange={set("address")}
        why="We confirm your business operates from a real, verifiable address. A PO box won’t pass."
        active={why === "addr"}
        onWhy={() => setWhy(why === "addr" ? null : "addr")}
      />

      <NavRow next="Continue to owners" onNext={onNext} />
    </FormShell>
  );
}

/* ── Screen 3 · Beneficial owners ───────────────────────── */

function Owners({ owners, setOwners, onNext, onBack }: any) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", pct: "" });
  const total = owners.reduce((s: any, o: any) => s + (Number(o.pct) || 0), 0);
  const over = total > 100;

  return (
    <FormShell
      step={2}
      total={4}
      title="Who owns or controls the business?"
      lede="Add anyone who owns 25% or more, plus anyone who controls it (like a director). We verify each person’s identity."
    >
      <div className="owner-list">
        {owners.map((o: any, i: number) => (
          <div key={i} className={`owner-card ${o.you ? "you" : ""}`}>
            <span className="owner-avatar" aria-hidden>{o.name.trim()[0]}</span>
            <span className="owner-info">
              <span className="owner-name">{o.name}</span>
              <span className="owner-role">{o.role || "Beneficial owner"}</span>
            </span>
            <span className="owner-pct">{o.pct}%</span>
            {!o.you && (
              <button
                className="owner-remove"
                onClick={() => setOwners(owners.filter((_: any, j: number) => j !== i))}
                aria-label={`Remove ${o.name}`}
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
              id="new-owner-name"
              label="Full legal name"
              placeholder="As on their ID"
              small
              value={draft.name}
              onChange={(v: string) => setDraft({ ...draft, name: v })}
            />
            <Field
              id="new-owner-pct"
              label="Ownership %"
              placeholder="25"
              small
              value={draft.pct}
              onChange={(v: string) => setDraft({ ...draft, pct: v.replace(/[^0-9]/g, "") })}
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
              disabled={!draft.name}
              onClick={() => {
                setOwners([...owners, { ...draft, pct: Number(draft.pct) || 0 }]);
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
          <span className="add-plus" aria-hidden>+</span> Add another owner
        </button>
      )}

      <div className={`owner-total ${over ? "over" : ""}`}>
        <span className="owner-total-line">
          <span>Ownership accounted for</span>
          <span className="owner-total-val">{total}%</span>
        </span>
        <span className="owner-total-help">
          {over
            ? "Total can’t exceed 100% — check the percentages above."
            : "List everyone with 25% or more. The total doesn’t need to reach 100%."}
        </span>
      </div>

      <NavRow next="Continue to documents" onNext={onNext} onBack={onBack} nextDisabled={over} />
    </FormShell>
  );
}

/* ── Screen 4 · Documents ───────────────────────────────── */

function Documents({ docs, setDocs, onNext, onBack }: any) {
  const [why, setWhy] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const startUpload = (id: string) => {
    setUploading(id);
    setTimeout(() => {
      setUploading(null);
      setDocs((d: any) => ({ ...d, [id]: "uploaded" }));
    }, 900);
  };

  return (
    <FormShell
      step={3}
      total={4}
      title="Upload your documents"
      lede="Clear photos or PDFs work fine. Missing one? Mark it “add later” and keep moving — we’ll hold your place."
    >
      <div className="doc-list">
        {DOC_META.map((r) => (
          <DocRow
            key={r.id}
            row={r}
            status={uploading === r.id ? "uploading" : docs[r.id]}
            whyOpen={why === r.id}
            onWhy={() => setWhy(why === r.id ? null : r.id)}
            onUpload={() => startUpload(r.id)}
            onLater={() => setDocs({ ...docs, [r.id]: "later" })}
            onRemove={() => setDocs({ ...docs, [r.id]: "todo" })}
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

function DocRow({ row, status, whyOpen, onWhy, onUpload, onLater, onRemove }: any) {
  return (
    <div className={`doc-row ${status}`}>
      <div className="doc-main">
        <span className="doc-icon" aria-hidden>
          {status === "uploaded" ? (
            <Check />
          ) : status === "flagged" ? (
            <Alert />
          ) : (
            <DocIcon />
          )}
        </span>

        <div className="doc-text">
          <span className="doc-name">
            {row.name}
            {!row.required && <span className="doc-optional">Optional</span>}
          </span>

          {status === "uploaded" ? (
            <span className="doc-meta">
              <span className="doc-file">{row.file}</span>
              <button className="doc-link" onClick={onRemove}>Remove</button>
            </span>
          ) : status === "flagged" ? (
            <span className="doc-flag-msg">
              Date is older than 3 months — please replace with a recent one.
            </span>
          ) : status === "later" ? (
            <span className="doc-later-msg">
              We’ll remind you by email. Review starts once we receive it.
            </span>
          ) : status === "uploading" ? null : (
            <span className="doc-meta">
              <button className="doc-link" onClick={onWhy} aria-expanded={whyOpen}>
                {whyOpen ? "Hide reason" : "Why we ask"}
              </button>
              <span className="doc-meta-sep" aria-hidden>·</span>
              <button className="doc-link" onClick={onLater}>
                I don&rsquo;t have this
              </button>
            </span>
          )}
        </div>

        <div className="doc-action">
          {status === "uploading" && <span className="chip chip-wait">Uploading…</span>}
          {status === "later" && (
            <button className="btn-upload" onClick={onUpload}>Upload now</button>
          )}
          {(status === "todo" || status === "flagged") && (
            <button className="btn-upload" onClick={onUpload}>
              {status === "flagged" ? "Replace" : "Upload"}
            </button>
          )}
        </div>
      </div>

      {whyOpen && status === "todo" && <p className="doc-why">{row.why}</p>}
    </div>
  );
}

/* ── Review ─────────────────────────────────────────────── */

function Review({ business, owners, docs, consented, setConsented, onSubmit, onBack }: any) {
  const docLabel = (s: any) =>
    s === "uploaded" ? "Uploaded" : s === "later" ? "Adding later" : "Still needed";
  const anyLater = Object.values(docs).some((s: any) => s !== "uploaded");
  return (
    <FormShell
      step={4}
      total={4}
      title="Quick review before we verify"
      lede="Check the essentials. You can still edit any step from the list on the left."
    >
      <div className="review-groups">
        <ReviewGroup
          title="Business"
          items={[
            ["Legal name", "Meridian Trading FZ-LLC"],
            ["Registration", business.reg || "2039481"],
            ["Entity type", business.entity || "Free Zone LLC"],
            ["Address", business.address || "Dubai, United Arab Emirates"],
          ]}
        />
        <ReviewGroup
          title="Owners"
          items={owners.map((o: any) => [o.name, `${o.pct}%${o.you ? " · Primary" : ""}`])}
        />
        <ReviewGroup
          title="Documents"
          items={DOC_META.map((r) => [r.name, docLabel(docs[r.id])])}
        />
      </div>

      {anyLater && (
        <p className="review-note">
          You can submit now — we’ll begin with what you’ve provided and email you
          about anything still to come.
        </p>
      )}

      <label className="review-consent">
        <input
          type="checkbox"
          className="consent-input"
          checked={consented}
          onChange={(e: any) => setConsented(e.target.checked)}
        />
        <span className="consent-box" aria-hidden>
          {consented && <Check />}
        </span>
        <span>I confirm this information is accurate to the best of my knowledge.</span>
      </label>

      <NavRow
        next="Submit for verification"
        onNext={onSubmit}
        onBack={onBack}
        nextDisabled={!consented}
      />
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

/* ── Screen 5 · Pending ─────────────────────────────────── */

function Pending({ onApprove, onReject }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="pending-orb" aria-hidden>
          <span className="pending-orb-core" />
        </div>
        <p className="outcome-kicker">Submitted &middot; under review</p>
        <h1 className="outcome-title">We&rsquo;re verifying Meridian Trading.</h1>
        <p className="outcome-lede">
          A specialist reviews your documents against official registries. This
          normally takes <strong>1&ndash;2 business days</strong> — most come back sooner.
        </p>

        <div className="timeline">
          <TimelineStep state="done" title="Received" note="Today, 2:14 PM" />
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
        <p className="ref-line">Reference: SND-2941-8837</p>

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
      <span className="tl-dot" aria-hidden>{state === "done" && <Check />}</span>
      <span className="tl-body">
        <span className="tl-title">{title}</span>
        <span className="tl-note">{note}</span>
      </span>
    </div>
  );
}

/* ── Screen 6 · Rejection ───────────────────────────────── */

function Rejected({ onFix }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="reject-mark" aria-hidden><Alert /></div>
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
          <span className="reject-detail-icon" aria-hidden><DocIcon /></span>
          <div className="reject-detail-body">
            <span className="reject-detail-name">Proof of business address</span>
            <span className="reject-detail-reason">
              Issued 14 Jan 2026 — needs to be within 3 months
            </span>
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

/* ── Approved ───────────────────────────────────────────── */

function Approved({ onRestart }: any) {
  return (
    <div className="outcome screen-anim">
      <div className="outcome-card">
        <div className="approve-mark" aria-hidden><Check /></div>
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

function FormShell({ step, total, title, lede, children }: any) {
  return (
    <div className="form-shell">
      <div className="form-stepnum" aria-label={`Step ${step} of ${total}`}>
        <span className="form-stepnum-big">{String(step).padStart(2, "0")}</span>
        <span className="form-stepnum-total">/ {String(total).padStart(2, "0")}</span>
      </div>
      <h1 className="form-title">{title}</h1>
      <p className="form-lede">{lede}</p>
      <div className="form-body">{children}</div>
    </div>
  );
}

function Field({ id, label, placeholder, why, active, onWhy, small, value, onChange, hint }: any) {
  const filled = value != null && String(value).trim().length > 0;
  return (
    <div className={`field ${small ? "small" : ""}`}>
      <div className="field-top">
        <label className="field-label" htmlFor={id}>{label}</label>
        {why && (
          <button className="why-link" onClick={onWhy} aria-expanded={active}>
            {active ? "Hide" : "Why we ask"}
          </button>
        )}
      </div>
      <div className="input-wrap">
        <input
          id={id}
          className="field-input"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange ? (e: any) => onChange(e.target.value) : undefined}
        />
        {filled && (
          <span className="input-valid" aria-hidden>
            <Check />
          </span>
        )}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
      {why && active && <p className="field-why">{why}</p>}
    </div>
  );
}

function SelectField({ id, label, value, onChange, options }: any) {
  return (
    <div className="field small">
      <div className="field-top">
        <label className="field-label" htmlFor={id}>{label}</label>
      </div>
      <div className="select-wrap">
        <select
          id={id}
          className="field-input select-input"
          value={value}
          required
          onChange={(e: any) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((o: any) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="select-chev" aria-hidden>▾</span>
      </div>
    </div>
  );
}

function Prefilled({ label, value, note }: any) {
  return (
    <div className="field prefilled">
      <span className="field-label">{label}</span>
      <div className="prefilled-box">
        <span>{value}</span>
        <span className="prefilled-note">
          <Check /> {note}
        </span>
      </div>
    </div>
  );
}

function NavRow({ next, onNext, onBack, nextDisabled }: any) {
  return (
    <div className="nav-row">
      {onBack ? (
        <button className="btn-ghost" onClick={onBack}>Back</button>
      ) : (
        <span />
      )}
      <button className="btn-primary" onClick={onNext} disabled={nextDisabled}>
        {next}
      </button>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────── */
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
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Geist+Mono:wght@400;500&display=swap');

    .sanad-root {
      --bg:#E9EAF3; --surface:#FFFFFF; --surface-2:#F4F5FA;
      --border:#E4E6F0; --border-strong:#D3D6E6;
      --ink:#1E2029; --ink-2:#5A5E6E; --ink-3:#9A9EB0;
      --brand:#4F5BE8; --brand-hover:#3F4BD6; --brand-soft:#EDEFFD; --brand-ring:rgba(79,91,232,.18);
      --amber:#D9494F; --amber-soft:#FDEEEF;
      --success:#27AE60;
      --font-ui:'DM Sans',system-ui,-apple-system,sans-serif;
      --font-brand:'DM Sans',system-ui,-apple-system,sans-serif;
      --font-mono:'Geist Mono',ui-monospace,monospace;
      font-family:var(--font-ui);
      color:var(--ink); background:var(--bg);
      min-height:100%; width:100%;
      -webkit-font-smoothing:antialiased;
      letter-spacing:-0.005em;
    }
    .sanad-root *{box-sizing:border-box;}
    .sanad-root button{font-family:inherit;cursor:pointer;}
    .sanad-root button:disabled{cursor:not-allowed;opacity:.45;}
    .sanad-root :is(button,input,select,a):focus-visible{
      outline:2px solid var(--brand);outline-offset:2px;border-radius:8px;}

    .topbar{display:flex;align-items:center;justify-content:space-between;
      padding:22px 28px;max-width:1080px;margin:0 auto;background:transparent;}
    .wordmark{font-family:var(--font-brand);font-size:15px;font-weight:700;
      color:var(--ink);background:none;border:none;letter-spacing:.16em;
      text-transform:uppercase;padding:0;}
    .wordmark-dot{color:var(--brand);}
    .ghost-link{background:none;border:none;color:var(--ink-2);font-size:14px;font-weight:500;}
    .ghost-link:hover{color:var(--ink);}
    .topbar-tag{font-size:13px;color:var(--ink-3);font-weight:500;}

    .shell{display:flex;gap:0;max-width:1040px;margin:6px auto 48px;
      background:var(--surface);border-radius:20px;overflow:hidden;
      box-shadow:0 10px 34px rgba(30,32,70,.08);}
    .main{flex:1;display:flex;justify-content:center;padding:52px 40px 72px;}

    .rail{width:280px;flex-shrink:0;padding:52px 30px;border-right:1px solid var(--border);
      background:var(--surface);}
    .rail-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;
      color:var(--ink-3);font-weight:600;margin:0 0 6px;}
    .rail-title{font-size:16px;line-height:1.35;color:var(--ink);margin:0 0 22px;font-weight:500;}
    .rail-progress{height:4px;background:var(--surface-2);border-radius:99px;overflow:hidden;margin-bottom:26px;}
    .rail-progress-bar{height:100%;background:var(--brand);border-radius:99px;transition:width .5s cubic-bezier(.4,0,.2,1);}
    .rail-steps{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:2px;}
    .rail-step-btn{display:flex;gap:13px;align-items:center;width:100%;text-align:left;
      padding:11px 10px;border-radius:10px;background:none;border:none;transition:background .15s;}
    .rail-step.done .rail-step-btn:hover{background:var(--surface-2);}
    .rail-step-btn:disabled{opacity:1;}
    .rail-node{width:26px;height:26px;border-radius:99px;display:grid;place-items:center;flex-shrink:0;
      border:1.5px solid var(--border-strong);color:var(--ink-3);font-size:12px;font-weight:600;transition:.2s;}
    .rail-step.done .rail-node{background:var(--brand);border-color:var(--brand);color:#fff;}
    .rail-step.active .rail-node{border-color:var(--brand);color:var(--brand);background:var(--brand-soft);}
    .rail-step-text{display:flex;flex-direction:column;gap:1px;}
    .rail-step-label{font-size:12px;font-weight:600;letter-spacing:.07em;
      text-transform:uppercase;color:var(--ink-3);}
    .rail-step.active .rail-step-label,.rail-step.done .rail-step-label{color:var(--ink);}
    .rail-step-sub{display:none;}
    .rail-foot{display:flex;gap:7px;align-items:flex-start;margin-top:34px;font-size:12px;
      line-height:1.5;color:var(--ink-3);}
    .rail-foot svg{margin-top:2px;flex-shrink:0;}

    .overview{padding:20px 24px 80px;display:flex;justify-content:center;}
    .ov-card{max-width:600px;width:100%;background:var(--surface);border-radius:20px;
      padding:46px 48px;box-shadow:0 10px 34px rgba(30,32,70,.08);}
    .ov-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;
      color:var(--brand);font-weight:600;margin:0 0 14px;}
    .ov-title{font-family:var(--font-brand);font-weight:600;font-size:33px;line-height:1.18;
      letter-spacing:-0.02em;margin:0 0 16px;color:var(--ink);}
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

    .form-shell{max-width:520px;width:100%;}
    .form-stepnum{display:flex;align-items:baseline;gap:8px;margin:0 0 12px;}
    .form-stepnum-big{font-family:var(--font-brand);font-size:56px;font-weight:500;
      line-height:1;color:var(--brand);letter-spacing:-0.03em;}
    .form-stepnum-total{font-family:var(--font-ui);font-size:15px;font-weight:500;color:var(--ink-3);}
    .form-title{font-family:var(--font-brand);font-weight:600;font-size:27px;line-height:1.22;
      letter-spacing:-0.015em;margin:0 0 10px;}
    .form-lede{font-size:15px;line-height:1.55;color:var(--ink-2);margin:0 0 32px;max-width:50ch;}
    .form-body{display:flex;flex-direction:column;gap:20px;}

    .field{display:flex;flex-direction:column;gap:7px;}
    .field-row{display:flex;gap:14px;}
    .field.small{flex:1;}
    .field-top{display:flex;justify-content:space-between;align-items:baseline;}
    .field-label{font-size:13.5px;font-weight:500;color:var(--ink);transition:color .15s;}
    .field:focus-within .field-label{color:var(--brand);}
    .input-wrap{position:relative;}
    .input-valid{position:absolute;right:12px;top:50%;transform:translateY(-50%);
      width:18px;height:18px;border-radius:99px;background:var(--success);color:#fff;
      display:grid;place-items:center;pointer-events:none;}
    .input-valid svg{width:10px;height:10px;}
    .field-hint{margin:0;font-size:12.5px;color:var(--ink-3);line-height:1.4;}
    .field-input{border:1px solid var(--border-strong);border-radius:10px;padding:12px 38px 12px 14px;
      font-size:15px;font-family:inherit;color:var(--ink);background:var(--surface);transition:.15s;width:100%;}
    .field-input::placeholder{color:var(--ink-3);}
    .field-input:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-ring);}
    .select-wrap{position:relative;}
    .select-input{appearance:none;-webkit-appearance:none;padding-right:36px;}
    .select-input:invalid{color:var(--ink-3);}
    .select-chev{position:absolute;right:14px;top:50%;transform:translateY(-50%);
      color:var(--ink-3);font-size:12px;pointer-events:none;}
    .why-link{background:none;border:none;color:var(--brand);font-size:12.5px;font-weight:500;padding:0;}
    .why-link:hover{text-decoration:underline;}
    .field-why{margin:2px 0 0;font-size:13px;line-height:1.5;color:var(--ink-2);
      background:var(--brand-soft);padding:11px 13px;border-radius:9px;}
    .prefilled-box{display:flex;align-items:center;justify-content:space-between;gap:10px;
      border:1px solid var(--border);border-radius:10px;padding:12px 14px;background:var(--surface-2);font-size:15px;}
    .prefilled-note{display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--success);font-weight:500;flex-shrink:0;}

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
    .owner-total{display:flex;flex-direction:column;gap:5px;padding:13px 16px;
      background:var(--surface-2);border-radius:10px;font-size:13.5px;color:var(--ink-2);}
    .owner-total.over{background:var(--amber-soft);}
    .owner-total-line{display:flex;justify-content:space-between;align-items:center;}
    .owner-total.over .owner-total-line{color:var(--amber);}
    .owner-total-val{font-family:var(--font-mono);font-weight:500;}
    .owner-total-help{font-size:12px;color:var(--ink-3);line-height:1.45;}
    .owner-total.over .owner-total-help{color:var(--amber);}

    .doc-list{display:flex;flex-direction:column;gap:12px;}
    .doc-row{border:1px solid var(--border);border-radius:12px;padding:15px 16px;background:var(--surface);transition:.15s;}
    .doc-row.uploaded{background:var(--surface-2);}
    .doc-row.flagged{border-color:#F2C8CB;background:var(--surface);}
    .doc-main{display:flex;align-items:flex-start;gap:13px;}
    .doc-icon{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;flex-shrink:0;
      margin-top:1px;background:var(--surface-2);color:var(--ink-3);}
    .doc-row.uploaded .doc-icon{background:var(--brand);color:#fff;}
    .doc-row.flagged .doc-icon{background:var(--amber-soft);color:var(--amber);}
    .doc-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;padding-top:1px;}
    .doc-name{font-size:14.5px;font-weight:500;color:var(--ink);display:flex;align-items:center;gap:8px;}
    .doc-optional{font-size:11px;font-weight:500;color:var(--ink-3);background:var(--surface-2);
      padding:2px 7px;border-radius:99px;}
    /* one quiet, left-aligned metadata line — holds both secondary links */
    .doc-meta{display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
    .doc-meta-sep{color:var(--ink-3);font-size:12px;}
    .doc-link{background:none;border:none;padding:0;font-family:var(--font-ui);
      font-size:12.5px;font-weight:500;color:var(--brand);}
    .doc-link:hover{text-decoration:underline;}
    .doc-file{font-family:var(--font-mono);font-size:12px;color:var(--ink-2);}
    .doc-flag-msg{font-size:12.5px;color:var(--amber);line-height:1.4;}
    .doc-later-msg{font-size:12.5px;color:var(--ink-2);line-height:1.4;}
    .doc-action{flex-shrink:0;display:flex;align-items:center;}
    .doc-why{margin:13px 0 0;font-size:13px;line-height:1.5;color:var(--ink-2);
      padding:11px 13px;background:var(--surface-2);border-radius:9px;}
    .chip{font-size:12px;font-weight:500;padding:5px 11px;border-radius:99px;white-space:nowrap;}
    .chip-wait{background:var(--surface-2);color:var(--ink-2);}
    .btn-upload{border:1px solid var(--border-strong);background:var(--surface);border-radius:99px;
      padding:8px 15px;font-size:13.5px;font-weight:500;color:var(--ink);transition:.15s;}
    .btn-upload:hover{border-color:var(--brand);color:var(--brand);}
    .save-note{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--ink-2);
      padding:2px;margin-top:2px;}
    .save-note svg{color:var(--ink-3);}

    .review-groups{display:flex;flex-direction:column;gap:16px;}
    .review-group{border:1px solid var(--border);border-radius:12px;padding:16px 18px;background:var(--surface);}
    .review-group-title{font-size:12px;text-transform:uppercase;letter-spacing:.07em;
      color:var(--ink-3);font-weight:600;margin:0 0 12px;}
    .review-item{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:14px;}
    .review-k{color:var(--ink-2);}
    .review-v{color:var(--ink);font-weight:500;text-align:right;}
    .review-note{font-size:13px;line-height:1.55;color:var(--ink-2);margin:0;
      padding:12px 15px;background:var(--surface-2);border-radius:10px;}
    .review-consent{display:flex;align-items:center;gap:11px;padding:14px 16px;
      background:var(--brand-soft);border-radius:11px;font-size:13.5px;color:var(--ink);cursor:pointer;}
    .consent-input{position:absolute;opacity:0;width:1px;height:1px;}
    .consent-box{width:22px;height:22px;border-radius:6px;border:1.5px solid var(--brand);
      background:var(--surface);color:#fff;display:grid;place-items:center;flex-shrink:0;transition:.15s;}
    .consent-input:checked + .consent-box{background:var(--brand);}
    .consent-input:focus-visible + .consent-box{outline:2px solid var(--brand);outline-offset:2px;}

    .btn-primary{background:var(--brand);color:#fff;border:none;border-radius:99px;
      padding:12px 22px;font-size:14.5px;font-weight:500;transition:.15s;letter-spacing:-0.01em;}
    .btn-primary:hover:not(:disabled){background:var(--brand-hover);}
    .btn-lg{width:100%;padding:15px;font-size:15.5px;margin-top:6px;}
    .btn-ghost{background:none;border:1px solid var(--border-strong);border-radius:99px;
      padding:12px 20px;font-size:14.5px;font-weight:500;color:var(--ink-2);transition:.15s;}
    .btn-ghost:hover{border-color:var(--ink-2);color:var(--ink);}
    .nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:14px;}

    .outcome{display:flex;justify-content:center;padding:24px 24px 80px;}
    .outcome-card{max-width:540px;width:100%;text-align:center;background:var(--surface);
      border-radius:20px;padding:46px 44px;box-shadow:0 10px 34px rgba(30,32,70,.08);}
    .outcome-kicker{font-size:12px;text-transform:uppercase;letter-spacing:.09em;font-weight:600;
      color:var(--brand);margin:0 0 14px;}
    .outcome-kicker.amber{color:var(--amber);} .outcome-kicker.success{color:var(--success);}
    .outcome-title{font-family:var(--font-brand);font-weight:600;font-size:28px;line-height:1.24;
      letter-spacing:-0.015em;margin:0 0 14px;}
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
      color:var(--ink-2);margin:0 0 10px;}
    .notify-line svg{color:var(--brand);flex-shrink:0;}
    .ref-line{font-family:var(--font-mono);font-size:12px;color:var(--ink-3);margin:0 0 28px;}

    .proto-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;
      border-top:1px dashed var(--border-strong);padding-top:18px;}
    .proto-label{font-size:11.5px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.06em;font-weight:500;}
    .proto-actions{display:flex;gap:8px;}
    .proto-actions .btn-ghost{padding:8px 14px;font-size:13px;}

    .reject-mark{width:56px;height:56px;border-radius:99px;margin:0 auto 24px;background:var(--amber-soft);
      color:var(--amber);display:grid;place-items:center;}
    .reject-mark svg{width:22px;height:22px;}
    .reject-detail{display:flex;gap:13px;align-items:center;text-align:left;border:1px solid #F2C8CB;
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

    .screen-anim{animation:fadeUp .45s cubic-bezier(.4,0,.2,1);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

    @media (max-width:760px){
      .shell{flex-direction:column;margin:4px 12px 32px;border-radius:16px;}
      .rail{width:100%;border-right:none;border-bottom:1px solid var(--border);padding:22px 20px;}
      .rail-steps{flex-direction:row;overflow-x:auto;gap:8px;}
      .rail-foot{display:none;}
      .rail-step-btn{white-space:nowrap;padding:9px 10px;}
      .main{padding:32px 22px 60px;}
      .field-row{flex-direction:column;gap:20px;}
      .ov-card{padding:32px 24px;}
      .outcome-card{padding:34px 24px;}
      .ov-title{font-size:27px;}
    }
    @media (prefers-reduced-motion:reduce){
      .screen-anim,.pending-orb::before,.pending-orb-core{animation:none;}
      .rail-progress-bar{transition:none;}
    }
    `}</style>
  );
}
