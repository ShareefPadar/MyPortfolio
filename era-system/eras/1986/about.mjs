/**
 * ERA · 1986 — About as a CHARACTER PROFILE.
 * 1995 → 1986: heading + lead → a Player 1 status screen beside the dithered portrait; bio → a story box;
 * "How I work" → ABILITIES (three numbered boxes); "Where I've worked" → a QUEST LOG timeline; quote → a dialogue box.
 * Flavour ("Player 1", "Abilities", "Quest log", "Save data") is aria-hidden ornament.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
export const meta = { id: '1986', title: '1986 — About' };

export default function render(args) {
  const { content: c, icons, portrait } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const A = c.about;

  const main = `  <main id="main" class="aboutpage">
    <section class="profile" aria-labelledby="a-title">
      <div class="profile-grid">
        ${portraitMarkup(portrait)}
        <div>
          <h1 id="a-title">${esc(A.heading)}</h1>
          <p class="lead">${esc(A.lead)}</p>
        </div>
      </div>
    </section>

    <div class="box story">
      ${A.body.map(t => `<p>${esc(t)}</p>`).join('\n      ')}
    </div>

    <section class="section" aria-labelledby="hw">
      <div class="section-head"><h2 id="hw">${esc(A.principles.heading)}</h2></div>
      <div class="skills">
        ${A.principles.items.map((i, n) => `<div class="box skill reveal"><span class="lv" aria-hidden="true">${n + 1}</span><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join('\n        ')}
      </div>
    </section>

    <section class="section" aria-labelledby="ww">
      <div class="section-head"><h2 id="ww">${esc(A.experience.heading)}</h2></div>
      <ol class="quests">
        ${A.experience.items.map(i => `<li class="quest reveal">
          <span class="when">${esc(i.dates)}</span>
          <div class="box">
            <h3>${esc(i.role)}</h3>
            <p class="where">${esc(i.company)}</p>
            <p>${esc(i.text)}</p>
          </div>
        </li>`).join('\n        ')}
      </ol>
      <p class="savedata"><span aria-hidden="true">Save data · </span>${esc(A.education)}</p>
    </section>

    <figure class="box dialogue-quote reveal">
      <blockquote><p>${esc(A.quote)}</p></blockquote>
      <span class="more" aria-hidden="true">▼</span>
    </figure>

    <div class="cta-row about-ctas">
      <a class="btn primary cursor" href="${esc(c.ctas.resume.href)}" target="_blank" rel="noopener">${esc(c.ctas.resume.label)} ${ic('download')}</a>
      <a class="btn" href="mailto:${esc(c.footer.email)}">${esc(A.contactLabel)} ${ic('mail')}</a>
    </div>
  </main>`;

  return shell({ ...args, current: '/about', main, pageScript: portraitScript });
}
