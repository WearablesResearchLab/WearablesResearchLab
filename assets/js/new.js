/**
 * Registers a web component from a folder.
 * Expects folder to have:
 * - component.html
 * - component.css
 * - component.js  (optional, defines a class that extends HTMLElement)
 *
 * @param {string} tagName - Custom element tag name to register, e.g. 'site-header'
 * @param {string} folderPath - Folder path to the component, e.g. '/assets/html_components/header'
 */
async function registerComponent(tagName, folderPath) {
  if (customElements.get(tagName)) return; // Already defined

  // Load HTML and CSS
  const [htmlRes, cssRes] = await Promise.all([
    fetch(`${folderPath}.html`),
    fetch(`${folderPath}.css`),
  ]);

  if (!htmlRes.ok || !cssRes.ok) {
    console.error(`Failed to load HTML or CSS for ${tagName}`);
    return;
  }

  const html = await htmlRes.text();
  const css = await cssRes.text();

  // Dynamically import JS if exists
  let ComponentClass;

  try {
    // Try to load JS module, it must export default class extending HTMLElement
    const module = await import(`${folderPath}.js`);
    ComponentClass = module.default;

    if (!ComponentClass) {
      console.warn(`No default export found in ${folderPath}.js, using base HTMLElement.`);
      ComponentClass = class extends HTMLElement {};
    }
  } catch (e) {
    // JS module not found or failed — fallback to base HTMLElement
    ComponentClass = class extends HTMLElement {};
  }

  // Extend to create a new class that loads html+css into Shadow DOM
  class WebComponentWithShadow extends ComponentClass {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      // Insert style + html inside Shadow DOM
      this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;

      // Call any lifecycle hook in original component
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
  }

  // Define the custom element
  customElements.define(tagName, WebComponentWithShadow);
}