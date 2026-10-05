// Storage and constants
const STORAGE_KEY = 'bricemg_site_content_v1';
const ADMIN_SECRET = 'bricemg';

// Get content from localStorage or return default
function getContent() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return window.defaultContent;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...window.defaultContent,
      ...parsed,
      cards: parsed.cards || window.defaultContent.cards,
      projects: parsed.projects || window.defaultContent.projects
    };
  } catch (error) {
    console.error('Error parsing content:', error);
    return window.defaultContent;
  }
}

// Save content to localStorage
function saveContent(content) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    return false;
  }
}

// Sanitize HTML string (basic XSS prevention)
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.storageUtils = {
  STORAGE_KEY,
  ADMIN_SECRET,
  getContent,
  saveContent,
  sanitize
};
