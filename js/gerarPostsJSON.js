async function gerarPostsJSON() {

    const categorias = ["jogos-mobile", "jogos-pc", "addons-minecraft", "produtos"];
    const resultado = {};

    for (let categoria of categorias) {
        resultado[categoria] = [];

        const caminho = `/POSTS/${categoria}/index.json`;

        try {
            const req = await fetch(caminho);
            const lista = await req.json();

            resultado[categoria] = lista;
        } catch (e) {
            console.warn(`Categoria ${categoria}: index.json não encontrado`);
        }
    }

    console.log("posts.json gerado para uso:", resultado);
    return resultado;
}
