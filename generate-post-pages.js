const fs = require("fs");
const path = require("path");

const POSTS_JSON = path.join(__dirname, "content/blog/posts.json");
const OUTPUT_DIR = path.join(__dirname, "posts");

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownToHtml(md = "") {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*)\*/gim, "<em>$1</em>")
    .replace(/\n/gim, "<br>");
}

function generateHtml(post) {
  const title = escapeHtml(post.title || "Publicación");
  const description = escapeHtml(post.description || "");
  const image = post.image ? post.image : "";
  const content = markdownToHtml(post.content || "");

  const url = `https://olmancalvogonzalez.com/posts/${post.slug}.html`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  <title>${title} | Defensa Penal Técnica</title>
  <meta name="description" content="${description}"/>

  <!-- Open Graph para Facebook -->
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:type" content="article"/>
  ${image ? `<meta property="og:image" content="https://olmancalvogonzalez.com${image.startsWith("/") ? image : "/" + image}"/>` : ""}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  ${image ? `<meta name="twitter:image" content="https://olmancalvogonzalez.com${image.startsWith("/") ? image : "/" + image}"/>` : ""}

  <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Work+Sans:wght@300;400;600&display=swap" rel="stylesheet"/>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: "#0a0a0a",
            secondary: "#856404",
            surface: "#fcf9f8",
          },
          fontFamily: {
            headline: ["Noto Serif"],
            body: ["Work Sans"],
          }
        }
      }
    }
  </script>
</head>

<body class="bg-surface font-body text-neutral-900 overflow-x-hidden">

  <nav class="w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
      <a href="/index.html" class="font-bold tracking-widest uppercase text-sm hover:text-secondary transition-all">
        Inicio
      </a>
      <a href="/index.html" class="font-bold tracking-widest uppercase text-sm hover:text-secondary transition-all">
        Blog
      </a>
    </div>
  </nav>

  <main class="max-w-4xl mx-auto px-6 py-16">

    <h1 class="font-headline text-5xl font-bold mb-6 text-primary">${title}</h1>
    <p class="text-neutral-700 text-lg mb-10 leading-relaxed">${description}</p>

    <img src="${image}" class="w-full h-[500px] object-cover mb-10 shadow-xl border-t-8 border-secondary"/>

    <div class="text-neutral-800 leading-relaxed text-base space-y-4">
      ${content}
    </div>

    <div class="mt-14">
      <a href="/index.html" class="bg-primary text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-secondary transition-all inline-block">
        Volver
      </a>
    </div>

  </main>

</body>
</html>`;
}

function main() {
  if (!fs.existsSync(POSTS_JSON)) {
    console.log("No existe posts.json, primero genera posts.json");
    return;
  }

  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, "utf-8"));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  posts.forEach((post) => {
    const html = generateHtml(post);
    const filePath = path.join(OUTPUT_DIR, `${post.slug}.html`);
    fs.writeFileSync(filePath, html, "utf-8");
    console.log("Generado:", filePath);
  });

  console.log("Todas las páginas fueron generadas en /posts");
}

main();
