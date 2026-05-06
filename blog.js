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

              <details class="mt-auto">
                <summary class="cursor-pointer font-bold uppercase tracking-widest text-xs text-secondary hover:text-primary transition-all">
                  Leer más
                </summary>
                <div class="mt-4 text-neutral-800 leading-relaxed text-sm">
                  ${post.content.replace(/\n/g, "<br>")}
                </div>
              </details>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Error cargando posts:", error);
  }
}

loadBlogPosts();