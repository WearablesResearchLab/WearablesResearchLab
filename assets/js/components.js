function registerHTMLComponent(tagName, filePath) {
  if (customElements.get(tagName)) return; // Prevent redefining

  customElements.define(tagName, class extends HTMLElement {
    async connectedCallback() {
      const res = await fetch(filePath);
      if (res.ok) {
        this.innerHTML = await res.text();
        this.dispatchEvent(new CustomEvent('content-loaded', { bubbles: true }));
        // alert('Header content loaded and event dispatched!');
      } else {
        this.innerHTML = `<div style="color:red;">Failed to load ${filePath}</div>`;
      }
    }
  });
}

registerHTMLComponent('site-header', '/assets/html_components/header.html');
registerHTMLComponent('site-footer', '/assets/html_components/footer.html');

// ... rest of your CSS loading and DOMContentLoaded code ...


function loadCSSFiles(files) {
  if (!Array.isArray(files)) files = [files];

  files.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
  });
}

// Usage example:
loadCSSFiles([
  '/assets/css/header.css',
  '/assets/css/footer.css',
  '/assets/css/index.css',
  '/assets/css/blog.css',
  '/assets/css/person.css',
  '/assets/css/pygments.css',
  '/assets/css/post.css',
  '/assets/css/contact.css',
  '/assets/css/template.css',
  // '/assets/css/test.css',
  // Markdown higlighting
"https://cdn.jsdelivr.net/npm/github-markdown-css/github-markdown.min.css",
"https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css"
]);




document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.querySelector('site-header');

  if (!siteHeader) {
    console.error("site-header element not found in DOM");
    return;
  }

  // Listen for content-loaded event from site-header
  siteHeader.addEventListener('content-loaded', () => {
    const toggleBtn = siteHeader.querySelector('.menu-toggle');
    const navLinks = siteHeader.querySelector('.nav-links');

    if (!toggleBtn || !navLinks) {
      console.error('Menu toggle button or nav-links not found');
      return;
    }

    toggleBtn.innerHTML = '&#9776;'; // Hamburger icon

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      toggleBtn.innerHTML = navLinks.classList.contains('show') ? '&times;' : '&#9776;';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        toggleBtn.innerHTML = '&#9776;';
      });
    });
  });
});

