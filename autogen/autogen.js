/* AutoGen client-side script (see README for instructions) */
const CONFIG = {
  owner: "JOGAWILL",
  repo: "site",
  branch: "main",
  perCategoryLimit: 200,
  useCommitsForDate: true,
  categories: [
    { name: "jogos-mobile", path: "POSTS/jogos-mobile", container: "#jogos-mobile-list" },
    { name: "jogos-pc", path: "site/POSTS/jogos-pc", container: "#jogos-pc-list" },
    { name: "addons-minecraft", path: "site/POSTS/addons-minecraft", container: "#addons-minecraft-list" },
    { name: "produtos-compras", path: "site/POSTS/produtos-compras", container: "#produtos-compras-list" }
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
  if (!res.ok) {
    throw new Error(`Failed to list path ${path}: ${res.status} ${res.statusText}`);
  }
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
  const og = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (og) return og[1].trim();
  const h1 = html.match(/<(h1|H1)[^>]*>([^<]+)<\/h1>/);
  if (h1) return h1[2].trim();
  return null;
}
function extractImageFromHTML(html) {
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (og) return og[1];
  const img = html.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (img) return img[1];
  return null;
}
function extractFromMarkdown(md) {
  const img = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const title = (md.match(/^#\s+(.+)$/m) || md.match(/^---\s*[\s\S]*?title:\s*["']?(.+)["']?/mi));
  return {
    title: title ? title[1].trim() : null,
    image: img ? img[1].trim() : null
  };
}
async function getLastCommitDateForPath(filePath) {
  const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0].commit.committer.date;
}
function asISO(dateStr) {
  if (!dateStr) return null;
  try { return new Date(dateStr).toISOString(); } catch(e) { return null; }
}
async function buildCategory(category) {
  try {
    const files = await listFilesInPath(category.path);
    if (!Array.isArray(files)) return [];
    const posts = [];
    for (let f of files) {
      if (f.type !== "file") continue;
      const lower = f.name.toLowerCase();
      if (!(/\.(html|htm|md|markdown|txt)$/i).test(lower)) continue;
      const content = await getRawFileContent(f);
      let title = null, image = null;
      if (!content) {
        title = f.name.replace(/\.(html|md|markdown|txt)$/i, "");
      } else if (lower.endsWith(".md") || lower.endsWith(".markdown")) {
        const md = extractFromMarkdown(content);
        title = md.title || f.name.replace(/\.(md|markdown)$/i, "");
        image = md.image;
      } else {
        title = extractTitleFromHTML(content) || f.name.replace(/\.(html|htm)$/i, "");
        image = extractImageFromHTML(content);
      }
      if (image && image.startsWith("/")) {
        image = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}${image}`;
      } else if (image && image.startsWith("./")) {
        const baseDir = f.path.replace(/\/[^\/]+$/, "");
        image = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${baseDir}/${image.replace(/^\.\/+/,'')}`.replace(/\/+/g, "/").replace("https:/","https://");
      } else if (image && !/^https?:\/\//i.test(image)) {
        const baseDir = f.path.replace(/\/[^\/]+$/, "");
        image = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${baseDir}/${image}`.replace(/\/+/g, "/").replace("https:/","https://");
      }
      let date = null;
      if (CONFIG.useCommitsForDate) {
        const commitDate = await getLastCommitDateForPath(f.path);
        date = asISO(commitDate) || null;
      }
      const url = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${f.path}`;
      posts.push({ title, image, url, path: f.path, name: f.name, date });
      if (posts.length >= CONFIG.perCategoryLimit) break;
    }
    posts.sort((a,b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    return posts;
  } catch (err) {
    console.error("Error building category", category, err);
    return [];
  }
}
async function buildAllCategories() {
  const result = {};
  for (let cat of CONFIG.categories) {
    const items = await buildCategory(cat);
    result[cat.name] = items;
    if (cat.container) {
      renderListIntoContainer(cat.container, items);
    }
  }
  window.AUTOGEN_DATA = result;
  try { localStorage.setItem("AUTOGEN_DATA", JSON.stringify(result)); } catch(e){}
  return result;
}
function renderListIntoContainer(selector, items) {
  const el = document.querySelector(selector);
  if (!el) return;
  const list = document.createElement("div");
  list.className = "autogen-list";
  for (let item of items) {
    const card = document.createElement("article");
    card.className = "autogen-card";
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    const title = document.createElement("h3");
    title.textContent = item.title || item.name;
    a.appendChild(title);
    card.appendChild(a);
    if (item.image) {
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.title || "";
      img.loading = "lazy";
      card.appendChild(img);
    }
    if (item.date) {
      const d = document.createElement("time");
      d.textContent = new Date(item.date).toLocaleString();
      card.appendChild(d);
    }
    list.appendChild(card);
  }
  el.innerHTML = "";
  el.appendChild(list);
}
window.addEventListener("DOMContentLoaded", () => {
  if (window.AUTOGEN_CONFIG) {
    Object.assign(CONFIG, window.AUTOGEN_CONFIG);
    if (window.AUTOGEN_CONFIG.categories) {
      CONFIG.categories = window.AUTOGEN_CONFIG.categories;
    }
  }
  buildAllCategories().then(data => {
    console.info("AUTOGEN finished", data);
  }).catch(err => console.error("AUTOGEN fatal", err));
});
export { CONFIG, buildAllCategories };
