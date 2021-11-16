import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { lumoStyles } from "../shared/lumo-imports";
import {
  formatSuggestionDescription,
  formatSuggestionTitle,
  SelectorSuggestion,
} from "../shared/suggestions";

@customElement("th-suggestion-item")
class SuggestionItem extends LitElement {
  static styles = [
    ...lumoStyles,
    css`
      :host {
        display: block;
        cursor: pointer;
        border-top: 1px solid var(--lumo-contrast-20pct);
      }
      :host(:last-child) {
        border-bottom: 1px solid var(--lumo-contrast-20pct);
      }
      :host(:hover) {
        background: var(--lumo-primary-color-10pct);
      }
      .title {
        text-transform: capitalize;
      }
    `,
  ];

  @property()
  suggestion!: SelectorSuggestion;

  render() {
    return html`
      <div class="p-xs text-s">
        <div class="title text-body font-bold">
          ${formatSuggestionTitle(this.suggestion)}
        </div>
        <div class="text-secondary">
          ${formatSuggestionDescription(this.suggestion)}
        </div>
      </div>
    `;
  }
}
