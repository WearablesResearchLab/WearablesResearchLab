const container = document.getElementById("summary-container");

async function loadSummaries() {
  try {
    const response = await fetch("index.json"); // JSON in same folder as HTML
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const posts = await response.json();

    console.log("Loaded posts:", posts);
    container.innerHTML = ""; // Clear previous content

    posts.slice(0, 2).forEach(post => {
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
