
function loadPosts(jsonPath){
 fetch(jsonPath).then(r=>r.json()).then(data=>{
  let c=document.getElementById('lista'); 
  data.posts.forEach(p=>{
   c.innerHTML += `<div class="card"><h3>${p.title}</h3><a href="${p.url}">Ler mais</a></div>`;
  });
 });
}
