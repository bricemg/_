// Form utilities for admin panel

function collectFormData(content) {
  const next = JSON.parse(JSON.stringify(content));

  // Site info
  next.site.title = document.getElementById('siteTitle').value.trim() || 'BRICEMG / STUDIO';
  next.site.subtitle = document.getElementById('siteSubtitle').value.trim() || 'DESIGN / CODE / VISION';
  next.site.heroClaim = document.getElementById('heroClaim').value.trim();
  next.site.intro = document.getElementById('intro').value.trim();
  next.site.about = document.getElementById('about').value.trim();
  next.site.email = document.getElementById('email').value.trim();

  // Collect all card fields
  const cardFields = ['title', 'code', 'desc', 'type', 'status'];
  cardFields.forEach(field => {
    document.querySelectorAll(`.card-${field}`).forEach(el => {
      const index = parseInt(el.getAttribute('data-index'));
      next.cards[index][field] = el.value.trim();
    });
  });

  // Collect all project fields
  const projectFields = ['title', 'code', 'desc', 'type', 'phase'];
  projectFields.forEach(field => {
    document.querySelectorAll(`.project-${field}`).forEach(el => {
      const index = parseInt(el.getAttribute('data-index'));
      next.projects[index][field] = el.value.trim();
    });
  });

  return next;
}

function buildCardFieldsHTML(content) {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';

  content.cards.forEach((card, index) => {
    const section = document.createElement('div');
    section.className = 'card-section';

    section.innerHTML = `
      <div class="field-group-label">CARTE ${index + 1}</div>
      <div class="field">
        <label>Titre</label>
        <input class="card-title" data-index="${index}" type="text" value="${card.title}" />
      </div>
      <div class="field">
        <label>Code</label>
        <input class="card-code" data-index="${index}" type="text" value="${card.code}" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea class="card-desc" data-index="${index}">${card.desc}</textarea>
      </div>
      <div class="field">
        <label>Type</label>
        <input class="card-type" data-index="${index}" type="text" value="${card.type}" />
      </div>
      <div class="field">
        <label>Statut</label>
        <input class="card-status" data-index="${index}" type="text" value="${card.status}" />
      </div>
    `;
    container.appendChild(section);
  });
}

function buildProjectFieldsHTML(content) {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = '';

  content.projects.forEach((project, index) => {
    const section = document.createElement('div');
    section.className = 'project-section';

    section.innerHTML = `
      <div class="field-group-label">PROJET ${index + 1}</div>
      <div class="field">
        <label>Titre</label>
        <input class="project-title" data-index="${index}" type="text" value="${project.title}" />
      </div>
      <div class="field">
        <label>Code</label>
        <input class="project-code" data-index="${index}" type="text" value="${project.code}" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea class="project-desc" data-index="${index}">${project.desc}</textarea>
      </div>
      <div class="field">
        <label>Type</label>
        <input class="project-type" data-index="${index}" type="text" value="${project.type}" />
      </div>
      <div class="field">
        <label>Phase</label>
        <input class="project-phase" data-index="${index}" type="text" value="${project.phase}" />
      </div>
    `;
    container.appendChild(section);
  });
}

function fillForm(content) {
  document.getElementById('siteTitle').value = content.site.title;
  document.getElementById('siteSubtitle').value = content.site.subtitle;
  document.getElementById('heroClaim').value = content.site.heroClaim;
  document.getElementById('intro').value = content.site.intro;
  document.getElementById('about').value = content.site.about;
  document.getElementById('email').value = content.site.email;

  buildCardFieldsHTML(content);
  buildProjectFieldsHTML(content);
}

window.adminForm = {
  collectFormData,
  buildCardFieldsHTML,
  buildProjectFieldsHTML,
  fillForm
};
