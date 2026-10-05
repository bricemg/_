// Template builders for HTML generation

function buildCardHTML(card, index) {
  return `
    <a class="cell tool" data-tool="${sanitize(card.id)}" data-released="2026-10-05" href="#" target="_self">
      <div class="cell-top"><span class="dot idx">${String(index + 1).padStart(2, '0')}</span><span class="cue"></span></div>
      <div class="name">${sanitize(card.title)}</div>
      <div class="cell-body">
        <div class="meta">
          <span class="code">${sanitize(card.code)}</span>
          <span class="desc">${sanitize(card.desc)}</span>
        </div>
        <dl class="dates">
          <div><dt>TYPE</dt><dd>${sanitize(card.type)}</dd></div>
          <div><dt>STATUT</dt><dd>${sanitize(card.status)}</dd></div>
        </dl>
        <div class="go">VOIR<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 8.5 8.5 3.5M4.5 3.5H8.5V7.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></div>
      </div>
    </a>
  `;
}

function buildProjectHTML(project, index) {
  return `
    <a class="cell tool" data-tool="${sanitize(project.id)}" data-released="2026-10-05" href="#" target="_self">
      <div class="cell-top"><span class="dot idx">${String(index + 5).padStart(2, '0')}</span><span class="cue"></span></div>
      <div class="name">${sanitize(project.title)}</div>
      <div class="cell-body">
        <div class="meta">
          <span class="code">${sanitize(project.code)}</span>
          <span class="desc">${sanitize(project.desc)}</span>
        </div>
        <dl class="dates">
          <div><dt>TYPE</dt><dd>${sanitize(project.type)}</dd></div>
          <div><dt>PHASE</dt><dd>${sanitize(project.phase)}</dd></div>
        </dl>
        <div class="go">VOIR<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 8.5 8.5 3.5M4.5 3.5H8.5V7.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></div>
      </div>
    </a>
  `;
}

function buildPageHTML(content) {
  const siteTitleParts = content.site.title.split(' / ');
  const siteNamespace = siteTitleParts[0];
  const siteType = siteTitleParts[1] || 'STUDIO';

  return `
    <div class="sheet">
      <div class="row row--three">
        <div class="cell">
          <div class="cell-top"><span class="dot title">${sanitize(siteNamespace)}</span></div>
          <div class="cell-body">
            <div class="meta">
              <b>${sanitize(siteType)}</b>
              ${sanitize(content.site.subtitle)}<br />
              INDEX V0.1<br />
              LANGUAGE : FR
            </div>
          </div>
        </div>

        <div class="cell">
          <div class="cell-top"><span class="dot title">NOUS</span></div>
          <div class="cell-body">
            <div class="meta">
              <b>CRÉER</b>
              ${sanitize(content.site.intro)}
            </div>
            <div class="meta">
              <b>RÉFLEXION</b>
              PENSER, CONCEVOIR ET DÉVELOPPER DE A À Z.
            </div>
            <div class="meta">
              <b>OBJECTIF</b>
              ${sanitize(content.site.about)}
            </div>
          </div>
        </div>

        <div class="cell cell--play" id="field">
          <div class="play" aria-hidden="true"><canvas></canvas></div>
          <div class="cell-body">
            <p class="claim">${sanitize(content.site.heroClaim)}</p>
          </div>
        </div>
      </div>

      <div class="bar">
        <span class="dot">A</span>
        <h2>ATELIER</h2>
        <span class="count">/ ${content.cards.length}</span>
      </div>
      <div class="row">
        ${content.cards.map((card, idx) => buildCardHTML(card, idx)).join('')}
      </div>

      <div class="bar">
        <span class="dot">B</span>
        <h2>PROJETS</h2>
        <span class="count">/ ${content.projects.length}</span>
      </div>
      <div class="row">
        ${content.projects.map((project, idx) => buildProjectHTML(project, idx)).join('')}
      </div>

      <div class="row row--three">
        <div class="cell plate">
          <div class="cell-top"><span class="dot idx">F</span></div>
          <div class="label">INFO</div>
          <div class="cell-body">
            <div class="meta">
              <b>ÉTAT</b>
              CRÉATION D'UNE BASE VISUELLE ET D'UNE PREMIÈRE VERSION D'EXPOSITION.
            </div>
            <div class="meta">
              <b>FOCUS</b>
              DESIGN, DÉVELOPPEMENT, EXPÉRIMENTATION ET STORYTELLING.
            </div>
          </div>
        </div>

        <div class="cell plate">
          <div class="cell-top"><span class="dot idx">G</span></div>
          <div class="label">APPROCHE</div>
          <div class="cell-body">
            <div class="meta">
              <b>PRINCIPE</b>
              CLARTÉ, RÉPÉTITION, RYTHME, STRUCTURE ET PLAINES DE COULEUR.
            </div>
            <div class="meta">
              <b>MOOD</b>
              MINIMAL, CALME, MODERNE, UN PEU TECHNIQUE ET CURIEUX.
            </div>
          </div>
        </div>

        <div class="cell plate">
          <div class="cell-top"><span class="dot idx">H</span><span class="rdot"></span></div>
          <div class="label">CONTACT</div>
          <div class="cell-body">
            <div class="meta">
              POUR UN PROJET, UNE COLLABORATION, OU UNE DISCUSSION.<br />
              ÉCRIS À <a class="mailto" href="mailto:${sanitize(content.site.email)}">${sanitize(content.site.email)}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="foot">
        <span>${sanitize(siteNamespace)}</span>
        <span>${sanitize(content.site.subtitle)}</span>
        <span>DESIGN / CODE / VISION</span>
        <span>${sanitize(content.site.email)}</span>
        <span>&copy; 2026</span>
      </div>
    </div>

    <a href="admin.html" class="cms-link">CMS</a>
  `;
}

window.templates = {
  buildCardHTML,
  buildProjectHTML,
  buildPageHTML
};
