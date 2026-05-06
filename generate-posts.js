const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "content/blog");
const OUTPUT_FILE = path.join(__dirname, "content/blog/posts.json");

function extractFrontMatter(content) {
  const match = content.match(/---([\s\S]*?)---/);
  if (!match) return {};

  const frontMatter = match[1].trim();
  const lines = frontMatter.split("\n");

  const data = {};
  lines.forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) return;

    data[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  });

  return data;
}

function stripFrontMatter(content) {
  return content.replace(/---([\s\S]*?)---/, "").trim();
}

function generate() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log("No existe content/blog");
    return;
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");

    const meta = extractFrontMatter(raw);
    const body = stripFrontMatter(raw);

    return {
      slug: file.replace(".md", ""),
      title: meta.title || "Sin título",
      description: meta.description || "",
      image: meta.image || "",
      content: body,
    };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
  console.log("posts.json generado correctamente");
}

generate();