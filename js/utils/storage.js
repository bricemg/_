// Storage and constants
const STORAGE_KEY = 'bricemg_site_content_v1';
const ADMIN_HASH_KEY = 'bricemg_admin_hash_v1';
const ADMIN_SALT_KEY = 'bricemg_admin_salt_v1';

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
  if (typeof str !== 'string') return str;
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Helpers for hashing
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  // store as hex
  return toHex(arr.buffer);
}

async function hashPassword(password, saltHex) {
  const encoder = new TextEncoder();
  const data = encoder.encode(saltHex + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return toHex(hashBuffer);
}

// Admin password management (client-side only)
async function setAdminPassword(password) {
  if (!password || password.length < 4) return false;
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  localStorage.setItem(ADMIN_SALT_KEY, salt);
  localStorage.setItem(ADMIN_HASH_KEY, hash);
  return true;
}

function hasAdminPassword() {
  return Boolean(localStorage.getItem(ADMIN_HASH_KEY) && localStorage.getItem(ADMIN_SALT_KEY));
}

async function verifyAdminPassword(password) {
  const salt = localStorage.getItem(ADMIN_SALT_KEY);
  const stored = localStorage.getItem(ADMIN_HASH_KEY);
  if (!salt || !stored) return false;
  const hash = await hashPassword(password, salt);
  return hash === stored;
}

// Expose utilities
window.storageUtils = {
  STORAGE_KEY,
  ADMIN_HASH_KEY,
  ADMIN_SALT_KEY,
  getContent,
  saveContent,
  sanitize,
  setAdminPassword,
  hasAdminPassword,
  verifyAdminPassword
};
