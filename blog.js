async function loadBlogPosts() {
  try {
    const res = await fetch("/content/blog/posts.json");
    const posts = await res.json();

    const container = document.getElementById("blog-container");
    const emptyMsg = document.getElementById("blog-empty");

    if (!posts.length) {
      emptyMsg.classList.remove("hidden");
      return;
    }

    emptyMsg.classList.add("hidden");

    container.innerHTML = posts
      .reverse()
      .map((post) => {
        return `
          <article class="bg-white shadow-2xl overflow-hidden border-t-8 border-secondary flex flex-col">
            
            ${
              post.image
                ? `<img src="${post.image}" alt="${post.title}" class="w-full h-56 object-cover">`
                : ""
            }

            <div class="p-8 flex flex-col flex-grow">
              <h3 class="font-headline text-2xl font-bold mb-3 text-primary">
                ${post.title}
              </h3>

              <p class="text-neutral-700 mb-6 leading-relaxed">
                ${post.description}
              </p>

              <div class="mt-auto flex flex-col gap-3">
                <a href="/post.html?slug=${post.slug}"
                  class="bg-primary text-white px-6 py-4 font-bold uppercase tracking-widest hover:bg-secondary transition-all text-center">
                  Ver publicación
                </a>

                <button onclick="copyPostLink('${post.slug}')"
                  class="border-2 border-primary px-6 py-4 font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  Copiar link
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error cargando posts:", error);
  }
}

function copyPostLink(slug) {
  const url = `${window.location.origin}/post.html?slug=${slug}`;
  navigator.clipboard.writeText(url);
  alert("Link copiado correctamente.");
}

loadBlogPosts();
