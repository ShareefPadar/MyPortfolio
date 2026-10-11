/**
 * ERA · 2014 — About, Material style.
 * 1995 → 2014: heading + lead → the blue hero band beside the flat circle portrait; bio → a white reading band;
 * "How I work" → three paper cards with lime number badges; "Where I've worked" → a vertical stepper;
 * quote → the lime colour band, with the two calls to action.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
export const meta = { id: '2014', title: '2014 — About' };

export default function render(args) {
  const { content: c, icons, portrait } = args;
  const ic = n => icons.line[n];
  const A = c.about;

  const main = `<main id="main" class="aboutpage">
  <section class="hero dark" aria-labelledby="a-title"><div class="wrap">
    <div>
      <h1 id="a-title">${esc(A.heading)}</h1>
      <p class="lead">${esc(A.lead)}</p>
    </div>
    <div class="avatar-col">${portraitMarkup(portrait)}</div>
  </div></section>

  <section class="band"><div class="wrap reading">
    ${A.body.map(t => `<p>${esc(t)}</p>`).join('\n    ')}
  </div></section>

  <section class="band grey" aria-labelledby="hw"><div class="wrap">
    <div class="band-head reveal"><span class="num" aria-hidden="true">01</span><h2 id="hw">${esc(A.principles.heading)}</h2></div>
    <div class="cards three">
      ${A.principles.items.map((i, n) => `<div class="card principle reveal"><div class="card-body"><span class="badge-n" aria-hidden="true">${n + 1}</span><h3>${esc(i.title)}</h3><p class="summary">${esc(i.text)}</p></div></div>`).join('\n      ')}
    </div>
  </div></section>

  <section class="band" aria-labelledby="ww"><div class="wrap">
    <div class="band-head reveal"><span class="num" aria-hidden="true">02</span><h2 id="ww">${esc(A.experience.heading)}</h2></div>
    <ol class="stepper">
      ${A.experience.items.map((i, n) => `<li class="step${n === 0 ? ' now' : ''} reveal">
        <span class="dot" aria-hidden="true"></span>
        <p class="when">${esc(i.dates)}</p>
        <h3>${esc(i.role)}</h3>
        <p class="where">${esc(i.company)}</p>
        <p class="what">${esc(i.text)}</p>
      </li>`).join('\n      ')}
    </ol>
    <p class="edu">${esc(A.education)}</p>
  </div></section>

  <section class="nda quoteband reveal"><div class="wrap">
    <blockquote><p>${esc(A.quote)}</p></blockquote>
    <div class="row">
      <a class="btn btn-ink" href="${esc(c.ctas.resume.href)}" target="_blank" rel="noopener">${esc(c.ctas.resume.label)} ${ic('download')}</a>
      <a class="btn btn-ghost-d" href="mailto:${esc(c.footer.email)}">${esc(A.contactLabel)} ${ic('mail')}</a>
    </div>
  </div></section>
</main>`;

  return shell({ ...args, current: '/about', main, pageScript: portraitScript });
}
