/* AutoGen client-side script */
const CONFIG = {
  owner: "JOGAWILL",
  repo: "site",
  branch: "main",
  perCategoryLimit: 200,
  useCommitsForDate: true,

  // Caminhos FINAL E CORRETOS
  categories: [
    { name: "jogos-mobile", path: "POSTS/jogos-mobile", container: "#jogos-mobile-list" },
    { name: "jogos-pc", path: "POSTS/jogos-pc", container: "#jogos-pc-list" },
    { name: "addons-minecraft", path: "POSTS/addons-minecraft", container: "#addons-minecraft-list" },
    { name: "produtos-compras", path: "POSTS/produtos-compras", container: "#produtos-compras-list" }
  ]
};

const API_BASE = "https://api.github.com";

function getAuthHeaders() {
  const headers = { Accept: "application/vnd.github.v3+json" };
  if (window.AUTOGEN_GITHUB_TOKEN) {
    headers.Authorization = `token ${window.AUTOGEN_GITHUB_TOKEN}`;
  }
  return headers;
}

async function listFilesInPath(path) {
  const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${encodeURIComponent(path)}?ref=${CONFIG.branch}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to list path ${path}: ${res.status}`);
  return res.json();
}

async function getRawFileContent(fileObj) {
  if (!fileObj || !fileObj.download_url) return null;
  const res = await fetch(fileObj.download_url, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  return res.text();
}

function extractTitleFromHTML(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  if (match) return match[1].trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1) return h1[1].trim();
  return null;
}

function extractImageFromHTML(html) {
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (og) return og[1];
  const img = html.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (img) return img[1];
  return null;
}

async function getLastCommitDateForPath(filePath) {
  const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return data[0].commit.committer.date;
}

function asISO(dateStr) {
  try { return new Date(dateStr).toISOString(); }
  catch { return null; }
}

async function buildCategory(category) {
  try {
    const files = await listFilesInPath(category.path);
    if (!Array.isArray(files)) return [];

    const posts = [];

    for (let f of files) {
      if (f.type !== "file") continue;
      const lower = f.name.toLowerCase();
      if (!(/\.(html|htm|md|markdown)$/i).test(lower)) continue;

      const content = await getRawFileContent(f);

      let title = extractTitleFromHTML(content) || f.name;
      let image = extractImageFromHTML(content);

      if (image && image.startsWith("/")) {
        image = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}${image}`;
      }

      let date = null;
      if (CONFIG.useCommitsForDate) {
        date = await getLastCommitDateForPath(f.path);
        date = asISO(date);
      }

      const postURL = `https://jogawill.github.io/site/${f.path}`;

      posts.push({
        title,
        image,
        url: postURL,
        path: f.path,
        name: f.name,
        date
      });
    }

    posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return posts;

  } catch (err) {
    console.error("Error building category", category, err);
    return [];
  }
}

function renderListIntoContainer(selector, items) {
  const el = document.querySelector(selector);
  if (!el) return;

  let html = `<div class="autogen-list">`;

  items.forEach(item => {
    html += `
      <article class="autogen-card">
        <a href="${item.url}">
          <h3>${item.title}</h3>
          ${item.image ? `<img src="${item.image}" loading="lazy">` : ""}
        </a>
        ${item.date ? `<time>${new Date(item.date).toLocaleString()}</time>` : ""}
      </article>
    `;
  });

  html += `</div>`;
  el.innerHTML = html;
}

async function buildAllCategories() {
  const result = {};
  for (let cat of CONFIG.categories) {
    const items = await buildCategory(cat);
    result[cat.name] = items;
    if (cat.container) renderListIntoContainer(cat.container, items);
  }
  return result;
}

window.addEventListener("DOMContentLoaded", buildAllCategories);

export { CONFIG, buildAllCategories };
