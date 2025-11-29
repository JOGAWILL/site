
async function loadPosts(jsonPath){
  const res = await fetch(jsonPath);
  const posts = await res.json();
  const container = document.getElementById("lista");
  const perPage = 7;
  let page = 1;
  function render(){
    container.innerHTML="";
    const start = (page-1)*perPage;
    const end = start+perPage;
    posts.slice(start,end).forEach(p=>{
      const div=document.createElement("div");
      div.innerHTML = `<a href="../${p.path}" class="post-card"><h3>${p.title}</h3></a>`;
      container.appendChild(div);
    });
    renderPagination();
  }
  function renderPagination(){
    let pag=document.getElementById("pagination");
    if(!pag){
      pag=document.createElement("div");
      pag.id="pagination";
      container.after(pag);
    }
    pag.innerHTML="";
    const total=Math.ceil(posts.length/perPage);
    for(let i=1;i<=total;i++){
      const btn=document.createElement("button");
      btn.textContent=i;
      if(i===page) btn.disabled=true;
      btn.onclick=()=>{ page=i; render(); };
      pag.appendChild(btn);
    }
  }
  render();
}
