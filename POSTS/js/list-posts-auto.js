/* ===========================================================
   AUTO LIST POSTS – SISTEMA AUTOMÁTICO PARA TODAS CATEGORIAS
   Desenvolvido especialmente para github.com/JOGAWILL/site
   =========================================================== */

async function loadPostsAuto(folderPath) {
    const container = document.getElementById("lista");
    container.innerHTML = "<p style='color:white'>Carregando posts...</p>";

    // API pública do GitHub
    const apiURL = `https://api.github.com/repos/JOGAWILL/site/contents/${folderPath}`;

    try {
        const res = await fetch(apiURL);
        const files = await res.json();

        // Filtra somente HTML
        let htmlFiles = files.filter(f => f.name.endsWith(".html"));

        let posts = [];

        for (let file of htmlFiles) {
            const rawURL = file.download_url;

            // lê o conteúdo do post
            const html = await fetch(rawURL).then(r => r.text());

            // pega <title>
            let title = html.match(/<title>(.*?)<\/title>/i);
            title = title ? title[1] : file.name.replace(".html", "");

            // salva
            posts.push({
                title: title,
                url: `../${folderPath}/${file.name}`
            });
        }

        // Ordena — mais novos primeiro
        posts.reverse();

        // Renderiza
        container.innerHTML = "";
        posts.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.innerHTML = `
                <a href="${p.url}" style="text-decoration:none;color:#fff;">
                    <h3>${p.title}</h3>
                </a>
            `;
            container.appendChild(div);
        });

    } catch (err) {
        container.innerHTML = `<p style="color:red;">Erro ao carregar posts.</p>`;
        console.error(err);
    }
}
