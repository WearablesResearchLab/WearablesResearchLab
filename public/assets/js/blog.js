const container = document.getElementById("post-list");

async function loadSummaries() {
  try {
    const response = await fetch("index.json"); // JSON in same folder as HTML
    const posts = await response.json();

    container.innerHTML = ""; // Clear previous content

    posts.forEach(post => {
      const div = document.createElement("div");
      div.className = "summary-item";
      div.innerHTML = `
        <h3><a href="posts/${post.url}">${post.title}</a></h3>
        <p class="post-meta">${post.date}</p>
        <p>${post.description}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = "<p>Error loading summaries.</p>";
    console.error(err);
  }
}

loadSummaries();
