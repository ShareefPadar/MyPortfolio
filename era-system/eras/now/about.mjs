/**
 * ERA · now — About, Liquid Glass the way Apple ships it.
 * Large title and lead beside the portrait well; the bio as plain prose; "How I work" and "Where I've worked" as
 * Settings-style grouped panels; the quote large, with the two calls to action under it.
 */
import { shell, esc } from './layout.mjs';
import { portraitMarkup, portraitScript } from './portrait.mjs';
export const meta = { id: 'now', title: 'Now · About' };

export default function render(args) {
  const { content: c, portrait } = args;
  const A = c.about;

  const main = `  <section class="hero" aria-labelledby="a-title">
    <div>
      <h1 class="large" id="a-title">${esc(A.heading)}</h1>
      <p class="lead">${esc(A.lead)}</p>
    </div>
    ${portraitMarkup(portrait)}
  </section>

  <div class="prose">
    ${A.body.map(t => `<p>${esc(t)}</p>`).join('\n    ')}
  </div>

  <section aria-labelledby="hw">
    <h2 class="title2" id="hw">${esc(A.principles.heading)}</h2>
    <div class="group">
      ${A.principles.items.map(i => `<div class="row"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section aria-labelledby="ww">
    <h2 class="title2" id="ww">${esc(A.experience.heading)}</h2>
    <div class="group timeline">
      ${A.experience.items.map(i => `<div class="row">
        <p class="when">${esc(i.dates)}</p>
        <div><h3>${esc(i.role)}</h3><p class="where">${esc(i.company)}</p><p class="what">${esc(i.text)}</p></div>
      </div>`).join('\n      ')}
      <p class="edu">${esc(A.education)}</p>
    </div>
  </section>

  <figure class="pull">
    <blockquote><p>${esc(A.quote)}</p></blockquote>
    <div class="actions">
      <a class="btn prominent" href="${esc(c.ctas.resume.href)}" target="_blank" rel="noopener">${esc(c.ctas.resume.label)}</a>
      <a class="btn bordered" href="mailto:${esc(c.footer.email)}">${esc(A.contactLabel)}</a>
    </div>
  </figure>`;

  return shell({ ...args, current: '/about', main, pageScript: portraitScript });
}
