import "@vaadin/button";
import "@vaadin/icon";
import "@vaadin/icons";
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  Action,
  ActionType,
  cancelPickingAction,
  highlightElementAction,
  PickElementAction,
  startPickingAction,
} from "../shared/actions";
import { lumoStyles } from "../shared/lumo-imports";
import { ElementPickData } from "../shared/models";
import {
  getSelectorSuggestions,
  SelectorSuggestion,
} from "../shared/suggestions";
import "./configurator";
import "./suggestion-item";
import "./suggestion-list";
import "./snippet";
import { SuggestionListEvent } from "./suggestion-list";
import Port = chrome.runtime.Port;

@customElement("th-panel")
class Panel extends LitElement {
  static styles = lumoStyles;

  @property()
  port!: Port;

  @state()
  isPicking: boolean = false;
  @state()
  pickedElement?: ElementPickData;
  @state()
  suggestions: SelectorSuggestion[] = [];
  @state()
  selectedSuggestion?: SelectorSuggestion;

  protected firstUpdated() {
    this.port.onMessage.addListener((action: Action) => {
      switch (action.type) {
        case ActionType.PickElement:
          this.handlePickElement(action);
      }
    });
  }

  handlePickerClick() {
    if (this.isPicking) {
      this.port.postMessage(cancelPickingAction());
    } else {
      this.port.postMessage(startPickingAction());
    }
    this.isPicking = !this.isPicking;
  }

  handleSuggestionEnter(e: SuggestionListEvent) {
    this.highlightSuggestion(e.detail);
  }

  handleSuggestionLeave() {
    this.highlightSuggestion(this.selectedSuggestion);
  }

  handleSuggestionSelect(e: SuggestionListEvent) {
    this.selectSuggestion(e.detail);
  }

  handlePickElement(action: PickElementAction) {
    const pickedElement = action.payload.pickedElement;
    const suggestions = getSelectorSuggestions(pickedElement);

    this.isPicking = false;
    this.pickedElement = pickedElement;
    this.suggestions = suggestions;
    this.selectedSuggestion = undefined;
  }

  handleBack() {
    this.selectSuggestion();
  }

  highlightSuggestion(suggestion?: SelectorSuggestion) {
    this.port.postMessage(highlightElementAction(suggestion));
  }

  selectSuggestion(suggestion?: SelectorSuggestion) {
    this.selectedSuggestion = suggestion;
    this.highlightSuggestion(suggestion);
  }

  render() {
    return html`
      ${!this.selectedSuggestion
        ? html`
            <div class="mx-m my-s">
              <vaadin-button @click="${this.handlePickerClick}">
                <vaadin-icon icon="vaadin:magic" slot="prefix"></vaadin-icon>
                ${this.isPicking ? "Cancel picking" : "Pick element"}
              </vaadin-button>
              <div>${this.renderSuggestionsBlock()}</div>
            </div>
          `
        : null}
      ${this.selectedSuggestion
        ? html`
            <th-configurator
              .suggestion="${this.selectedSuggestion}"
              @configurator-back="${this.handleBack}"
            ></th-configurator>
          `
        : null}
    `;
  }

  renderSuggestionsBlock() {
    const hasSuggestions = this.suggestions.length > 0;
    if (hasSuggestions) {
      return html`
        <p>I found the following themeable elements:</p>
        <th-suggestion-list .suggestions="${this.suggestions}"
                            @suggestion-enter="${this.handleSuggestionEnter}"
                            @suggestion-leave="${this.handleSuggestionLeave}"
                            @suggestion-select="${this.handleSuggestionSelect}"
        </th-suggestion-list>
      `;
    }

    if (this.isPicking) {
      return html`
        <p>
          Hover the cursor over an element that you want to style. I'll keep
          looking for Vaadin elements that can be themed...
        </p>
      `;
    }

    return html`
      <p>
        This extension allows you to visually identify elements of Vaadin
        components that can be themed, and helps you with setting up the correct
        CSS. Click the button above to get started.
      </p>
    `;
  }
}
