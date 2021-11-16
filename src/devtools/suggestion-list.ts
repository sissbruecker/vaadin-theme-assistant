import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SelectorSuggestion } from "../shared/suggestions";

export class SuggestionListEvent extends CustomEvent<SelectorSuggestion> {
  constructor(
    type: string,
    eventInitDict: CustomEventInit<SelectorSuggestion>
  ) {
    super(type, eventInitDict);
  }
}

@customElement("th-suggestion-list")
class SuggestionList extends LitElement {
  @property()
  suggestions: SelectorSuggestion[] = [];

  handleSuggestionMouseEnter(suggestion: SelectorSuggestion) {
    this.dispatchEvent(
      new SuggestionListEvent("suggestion-enter", { detail: suggestion })
    );
  }

  handleSuggestionMouseLeave() {
    this.dispatchEvent(new SuggestionListEvent("suggestion-leave", {}));
  }

  handleSuggestionClick(suggestion: SelectorSuggestion) {
    this.dispatchEvent(
      new SuggestionListEvent("suggestion-select", { detail: suggestion })
    );
  }

  render() {
    const items = this.suggestions.map(
      (suggestion) => html`
        <th-suggestion-item
          .suggestion="${suggestion}"
          @mouseenter="${() => this.handleSuggestionMouseEnter(suggestion)}"
          @mouseleave="${() => this.handleSuggestionMouseLeave()}"
          @click="${() => this.handleSuggestionClick(suggestion)}"
        ></th-suggestion-item>
      `
    );
    return html` <div>${items}</div>`;
  }
}
