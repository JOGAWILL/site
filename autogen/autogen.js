/* AutoGen client-side script — VERSÃO FINAL CORRIGIDA PARA GITHUB PAGES */
const CONFIG = {
  owner: "JOGAWILL",
  repo: "site",
  branch: "main",
  perCategoryLimit: 200,
  useCommitsForDate: true,

  /* Caminhos das categorias NO SEU SITE /site/ */
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

/* Lista arquivos dentro da pasta */
async function listFilesInPath(path) {
  const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${encodeURIComponent(path)}?ref=${CONFIG.branch}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to list path ${path}: ${res.status}`);
  return res.json();
}

/* Baixa o conteúdo bruto de um arquivo */
async function getRawFileContent(fileObj) {
  if (!fileObj || !fileObj.download_url) return null;
  const res = await fetch(fileObj.download_url, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  return res.text();
}

/* Extrair título */
function extractTitleFromHTML(html) {
  const t = html.match(/<title>(.*?)<\/title>/i);
  if (t) return t[1].trim();
  const og = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)/i);
  if (og) return og[1].trim();
  const h1 = html.match(/<h1[^>]*>([^<]+)/i);
  if (h1) return h1[1].trim();
  return null;
}

/* Extrair imagem */
function extractImageFromHTML(html) {
  const og = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)/i);
  if (og) return og[1];
  const img = html.match(/<img[^>]*src=["']([^"']+)/i);
  if (img) return img[1];
  return null;
}

/* Extrair dados de Markdown */
function extractFromMarkdown(md) {
  const img = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
  const title =
    (md.match(/^#\s+(.+)$/m) ||
      md.match(/^---\s*[\s\S]*?title:\s*["']?(.+)["']?/mi));
  return {
    title: title ? title[1].trim() : null,
    image: img ? img[1].trim() : null
  };
}

/* Data via último commit */
async function getLastCommitDateForPath(filePath) {
  const url = `${API_BASE}/repos/${CONFIG.owner}/${CONFIG.repo}/commits?path=${encodeURIComponent(filePath)}&per_page=1`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return data[0].commit.committer.date;
}

/* Converte para ISO */
function asISO(str) {
  try {
    return new Date(str).toISOString();
  } catch {
    return null;
  }
}

/* Monta posts da categoria */
async function buildCategory(category) {
  try {
    const files = await listFilesInPath(category.path);
    const posts = [];

    for (let f of files) {
      if (f.type !== "file") continue;

      if (!/\.(html|htm|md|markdown|txt)$/i.test(f.name)) continue;

      const content = await getRawFileContent(f);

      let title = null,
        image = null;

      if (!content) {
        title = f.name.replace(/\.(html|htm|md|markdown|txt)$/i, "");
      } else if (/\.(md|markdown)$/i.test(f.name)) {
        const md = extractFromMarkdown(content);
        title = md.title || f.name.replace(/\.(md|markdown)$/i, "");
        image = md.image;
      } else {
        title = extractTitleFromHTML(content) || f.name;
        image = extractImageFromHTML(content);
      }

      /* Corrigir caminhos de imagem */
      if (image && image.startsWith("/")) {
        image = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}${image}`;
      }

      /* NOVO: link correto para o GitHub Pages */
      const postURL = `https://${CONFIG.owner}.github.io/${CONFIG.repo}/${category.path}/${f.name}`;

      let date = null;
      if (CONFIG.useCommitsForDate) {
        const commitDate = await getLastCommitDateForPath(f.path);
        date = asISO(commitDate);
      }

      posts.push({
        title,
        image,
        url: postURL,
        path: f.path,
        name: f.name,
        date
      });

      if (posts.length >= CONFIG.perCategoryLimit) break;
    }

    posts.sort((a, b) => {
      const da = a.date ? new Date(a.date) : 0;
      const db = b.date ? new Date(b.date) : 0;
      return db - da;
    });

    return posts;
  } catch (e) {
    console.error("Error in buildCategory:", category, e);
    return [];
  }
}

/* Build ALL */
async function buildAllCategories() {
  const result = {};

  for (let cat of CONFIG.categories) {
    const items = await buildCategory(cat);
    result[cat.name] = items;

    if (cat.container) renderListIntoContainer(cat.container, items);
  }

  return result;
}

/* Render cards */
function renderListIntoContainer(selector, items) {
  const el = document.querySelector(selector);
  if (!el) return;

  const list = document.createElement("div");
  list.className = "autogen-list";

  items.forEach(item => {
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
      img.loading = "lazy";
      card.appendChild(img);
    }

    if (item.date) {
      const d = document.createElement("time");
      d.textContent = new Date(item.date).toLocaleString();
      card.appendChild(d);
    }

    list.appendChild(card);
  });

  el.innerHTML = "";
  el.appendChild(list);
}

/* Start */
window.addEventListener("DOMContentLoaded", () => {
  buildAllCategories();
});
