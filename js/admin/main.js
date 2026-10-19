(function () {
  const { getContent, saveContent } = window.storageUtils;
  // form helpers
  const { collectFormData, fillForm } = window.adminForm || {};

  function showAdmin() {
    document.getElementById('authPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
  }

  function saveFromForm() {
    const content = getContent();
    const next = (typeof collectFormData === 'function') ? collectFormData(content) : content;

    if (saveContent(next)) {
      const message = document.getElementById('saveMessage');
      if (message) {
        message.classList.remove('hidden');
        setTimeout(() => {
          message.classList.add('hidden');
        }, 2000);
      }
      // update raw view if present
      const raw = document.getElementById('rawContent');
      if (raw) raw.value = JSON.stringify(next, null, 2);
    } else {
      alert('Erreur lors de la sauvegarde.');
    }
  }

  function resetContent() {
    if (!confirm('Êtes-vous sûr? Cela réinitialisera tout le contenu. Avez-vous exporté une sauvegarde?')) return;
    localStorage.removeItem(window.storageUtils.STORAGE_KEY);
    location.reload();
  }

  async function handleLoginClick() {
    const value = document.getElementById('secret').value.trim();
    const { hasAdminPassword, setAdminPassword, verifyAdminPassword } = window.storageUtils;

    if (!hasAdminPassword()) {
      if (!confirm('Aucun mot de passe administrateur n\'est configuré. Voulez-vous en créer un maintenant (stocké localement)?')) return;
      const pw = prompt('Choisissez un mot de passe administrateur (min 4 caractères)');
      if (!pw || pw.length < 4) { alert('Mot de passe trop court.'); return; }
      const pw2 = prompt('Confirmez le mot de passe');
      if (pw !== pw2) { alert('Les mots de passe ne correspondent pas.'); return; }
      await setAdminPassword(pw);
      alert('Mot de passe configuré. Connectez-vous avec celui-ci.');
      document.getElementById('secret').value = '';
      return;
    }

    const ok = await verifyAdminPassword(value);
    if (ok) {
      showAdmin();
      // fill form with current content
      const content = getContent();
      if (typeof fillForm === 'function') fillForm(content);
      const raw = document.getElementById('rawContent');
      if (raw) raw.value = JSON.stringify(content, null, 2);
    } else {
      alert('Clé incorrecte.');
    }
  }

  function triggerExport() {
    const content = getContent();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bricemg-content.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function triggerImportFileDialog() {
    const input = document.getElementById('importFile');
    if (input) input.click();
  }

  function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (saveContent(parsed)) {
          if (typeof fillForm === 'function') fillForm(parsed);
          const raw = document.getElementById('rawContent');
          if (raw) raw.value = JSON.stringify(parsed, null, 2);
          alert('Import réussi.');
        } else {
          alert('Erreur lors de la sauvegarde du contenu importé.');
        }
      } catch (err) {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  }

  // Event listeners
  document.getElementById('loginBtn').addEventListener('click', () => {
    handleLoginClick();
  });

  document.getElementById('saveBtn').addEventListener('click', saveFromForm);
  document.getElementById('resetBtn').addEventListener('click', resetContent);
  document.getElementById('exportBtn').addEventListener('click', triggerExport);
  document.getElementById('importBtn').addEventListener('click', triggerImportFileDialog);
  document.getElementById('importFile').addEventListener('change', handleImportFile);

  document.getElementById('secret').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('loginBtn').click();
    }
  });

})();
