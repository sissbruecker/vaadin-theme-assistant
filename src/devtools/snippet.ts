import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { lumoStyles } from "../shared/lumo-imports";

@customElement("th-snippet")
export class Snippet extends LitElement {
  static styles = [
    ...lumoStyles,
    css`
      :host {
        display: block;
        position: relative;
      }

      .copy-button {
        position: absolute;
        top: -2px;
        right: 4px;
      }
    `,
  ];

  @property()
  code?: string;

  handleCopy() {
    navigator.clipboard.writeText(this.code || "");
  }

  render() {
    return html`
      <pre
        class="m-0 p-xs"
      ><code class="bg-transparent">${this.code?.trim()}</code></pre>
      <vaadin-button
        theme="tertiary small"
        class="copy-button"
        @click="${this.handleCopy}"
        >Copy
      </vaadin-button>
    `;
  }
}
