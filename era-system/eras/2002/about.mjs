/**
 * ERA · 2002 — About as a Web 2.0 profile page.
 * 1995 → 2002: heading + lead → the intro panel; bio → a plain panel; "How I work" → numbered gel beads;
 * "Where I've worked" → a striped CV list with gel date pills; education → the yellow info box;
 * quote → a glossy pull quote. Sidebar: the portrait (top), then the contact widget.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
export const meta = { id: '2002', title: '2002 — About' };

export default function render(args) {
  const { content: c, icons, portrait } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.line[n]}</span>`;
  const A = c.about;
  const home = c.nav.find(n => n.href === '/'), here = c.nav.find(n => n.href === '/about');

  const main = `    <main class="main aboutpage" id="main">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${esc(home.href)}">${esc(home.label)}</a><span aria-hidden="true"> » </span><span aria-current="page">${esc(here.label)}</span></nav>
      <section class="b-intro" aria-labelledby="a-title">
        <h1 id="a-title">${esc(A.heading)}</h1>
        <p class="lead">${esc(A.lead)}</p>
      </section>

      <section class="panel reveal"><div class="panel-body prose">
        ${A.body.map(t => `<p>${esc(t)}</p>`).join('\n        ')}
      </div></section>

      <section class="panel reveal" aria-labelledby="hw">
        <h2 class="panel-head" id="hw">${esc(A.principles.heading)}</h2>
        <ol class="beads">
          ${A.principles.items.map((i, n) => `<li><span class="bead" aria-hidden="true">${n + 1}</span><div><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div></li>`).join('\n          ')}
        </ol>
      </section>

      <section class="panel reveal" aria-labelledby="ww">
        <h2 class="panel-head" id="ww">${esc(A.experience.heading)}</h2>
        <ul class="cv">
          ${A.experience.items.map(i => `<li>
            <span class="when">${esc(i.dates)}</span>
            <div><h3>${esc(i.role)}</h3><p class="meta">${esc(i.company)}</p><p>${esc(i.text)}</p></div>
          </li>`).join('\n          ')}
        </ul>
        <div class="panel-body"><div class="note edu"><span class="note-i" aria-hidden="true">i</span><p>${esc(A.education)}</p></div></div>
      </section>

      <figure class="pull reveal"><blockquote><p>${esc(A.quote)}</p></blockquote></figure>

      <div class="row">
        <a class="gel gel-blue" href="${esc(c.ctas.resume.href)}" target="_blank" rel="noopener">${esc(c.ctas.resume.label)} ${ic('download')}</a>
        <a class="gel gel-silver" href="mailto:${esc(c.footer.email)}">${esc(A.contactLabel)} ${ic('mail')}</a>
      </div>
    </main>`;

  const side = `
      <div class="b-about">${portraitMarkup(portrait)}</div>`;
  return shell({ ...args, current: '/about', main, side, pageScript: portraitScript });
}
