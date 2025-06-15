const fs = require("fs-extra");
const path = require("path");
const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).enable('table');

// Paths
const POSTS_DIR = "posts";
const OUTPUT_DIR = "public/posts";
const TEMPLATE_PATH = "template.html";
const INDEX_JSON = "public/posts/index.json";
const PUBLIC_MEDIA_DIR = "public/media";
const SOURCE_MEDIA_DIR = path.join(POSTS_DIR, "media");

// Format date as "12 June 2025"
function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

async function clean() {
  if (await fs.pathExists(INDEX_JSON)) {
    await fs.remove(INDEX_JSON);
    console.log("Removed existing index.json");
  }

  if (await fs.pathExists(PUBLIC_MEDIA_DIR)) {
    await fs.remove(PUBLIC_MEDIA_DIR);
    console.log("Removed existing media directory");
  }

  await fs.ensureDir(PUBLIC_MEDIA_DIR);
  console.log("Created media directory");
}

function extractMediaPaths(markdown) {
  const regex = /!\[[^\]]*\]\((.*?)\)/g;
  const matches = [...markdown.matchAll(regex)];
  return matches.map(m => m[1]).filter(Boolean);
}

async function buildPost(file, templateRaw) {
  const filePath = path.join(POSTS_DIR, file);
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  // Copy media
  const mediaPaths = extractMediaPaths(content);
  for (const mediaPath of mediaPaths) {
    const srcPath = path.join(SOURCE_MEDIA_DIR, mediaPath);
    const destPath = path.join(PUBLIC_MEDIA_DIR, mediaPath);
    await fs.copy(srcPath, destPath);
  }

  const htmlContent = md.render(content);
  const formattedDate = formatDate(data.date);

  const outputHtml = templateRaw
    .replace(/{{\s*title\s*}}/g, data.title || "Untitled")
    .replace(/{{\s*date\s*}}/g, formattedDate)
    .replace(/{{\s*content\s*}}/g, htmlContent);

  const outputFilename = file.replace(/\.md$/, ".html");
  const outFile = path.join(OUTPUT_DIR, outputFilename);
  await fs.writeFile(outFile, outputHtml, "utf8");

  console.log(`Built: ${outFile}`);

  return {
    title: data.title || "Untitled",
    date: formattedDate,
    description: data.description || "",
    path: `posts/${outputFilename}`
  };
}

async function build() {
  await clean();
  await fs.ensureDir(OUTPUT_DIR);

  const templateRaw = await fs.readFile(TEMPLATE_PATH, "utf8");
  const files = (await fs.readdir(POSTS_DIR)).filter(f => f.endsWith(".md"));

  const posts = [];
  for (const file of files) {
    const post = await buildPost(file, templateRaw);
    posts.push(post);
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  await fs.writeJson(INDEX_JSON, posts, { spaces: 2 });
  console.log(`Generated index.json with ${posts.length} posts.`);
}

build();
