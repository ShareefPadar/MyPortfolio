/**
 * ERA · 1995 — About. Matches live /about: heading, bio, "How I work" principles,
 * "Where I've worked" timeline, education line, lime-rule quote, Résumé + Get in touch.
 */
import { shell, esc, STYLES } from './layout.mjs';
export const meta = { id: '1995', title: '1995 — About', styles: STYLES };

export default function render(args) {
  const { content: c, icons } = args;
  const ic = n => `<span class="ic" aria-hidden="true">${icons.pixel[n]}</span>`;
  const A = c.about;

  const main = `<main id="main" class="wrap aboutpage">
  <h1 class="pagetitle">${esc(A.heading)}</h1>
  <p class="lead">${esc(A.lead)}</p>
  ${A.body.map(t => `<p class="para">${esc(t)}</p>`).join('\n  ')}

  <section class="aboutsec" aria-labelledby="hw">
    <div class="marker"><span class="t-numeral">01</span><h2 id="hw">${esc(A.principles.heading)}</h2><i></i></div>
    ${A.principles.items.map(i => `<div class="principle"><h3>${esc(i.title)}</h3><p class="para">${esc(i.text)}</p></div>`).join('\n    ')}
  </section>

  <section class="aboutsec" aria-labelledby="ww">
    <div class="marker"><span class="t-numeral">02</span><h2 id="ww">${esc(A.experience.heading)}</h2><i></i></div>
    <div class="roles">
      ${A.experience.items.map(i => `<div class="role">
        <div class="rolehead"><h3>${esc(i.role)}</h3><span class="mono dates">${esc(i.dates)}</span></div>
        <p class="mono company">${esc(i.company)}</p>
        <p class="para">${esc(i.text)}</p>
      </div>`).join('\n      ')}
    </div>
    <p class="edu">${esc(A.education)}</p>
  </section>

  <blockquote class="quote"><p>${esc(A.quote)}</p></blockquote>

  <div class="row ctas">
    <span class="focusable"><a class="btn frame-control" data-fill="action" data-size="lg" href="${esc(c.ctas.resume.href)}" target="_blank" rel="noopener">${esc(c.ctas.resume.label)} ${ic('arrowD')}</a></span>
    <span class="focusable"><a class="btn frame-control" data-fill="surface" data-size="lg" href="mailto:${esc(c.footer.email)}">${esc(A.contactLabel)} ${ic('mail')}</a></span>
  </div>
</main>`;

  return shell({ ...args, title: A.title, current: '/about', main });
}
