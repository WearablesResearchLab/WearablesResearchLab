/**
 * Loads post summaries into a container from index.json
 *
 * @param {string} containerId - ID of the DOM element to inject into
 * @param {number} limit - Optional limit on number of posts to display
 */
export async function loadPostSummaries(containerId, limit = null) {
    const container = document.getElementById(containerId);

    try {
      const response = await fetch("posts/index.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const posts = await response.json();
      container.innerHTML = ""; // Clear existing content

      const displayedPosts = limit ? posts.slice(0, limit) : posts;

      displayedPosts.forEach(post => {
        const div = document.createElement("div");
        div.className = "summary-item";
        div.innerHTML = `
          <h3><a href="${post.path}">${post.title}</a></h3>
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

registerHTMLComponent('site-header', '/assets/html_components/header.html');
registerHTMLComponent('site-footer', '/assets/html_components/footer.html');
