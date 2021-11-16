import "@vaadin/checkbox-group";
import { CheckboxGroupValueChangedEvent } from "@vaadin/checkbox-group";
import "@vaadin/horizontal-layout";
import "@vaadin/radio-group";
import { RadioGroupValueChangedEvent } from "@vaadin/radio-group";
import "@vaadin/scroller";
import "@vaadin/split-layout";
import "@vaadin/tabs";
import { TabsSelectedChangedEvent } from "@vaadin/tabs";
import "@vaadin/text-field";
import { TextFieldValueChangedEvent } from "@vaadin/text-field";
import "@vaadin/vertical-layout";
import { html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import uniq from "lodash/uniq";
import { VaadinElementState } from "../metadata";
import { lumoStyles } from "../shared/lumo-imports";
import {
  formatSuggestionTitle,
  SelectorSuggestion,
  SelectorSuggestionType,
} from "../shared/suggestions";

interface SelectorConfiguration {
  useCustomTheme: boolean;
  customThemeVariant: string;
  selectedStates: VaadinElementState[];
}

const createDefaultConfiguration = (): SelectorConfiguration => {
  return {
    useCustomTheme: false,
    customThemeVariant: "my-theme",
    selectedStates: [],
  };
};

@customElement("th-configurator")
export class Configurator extends LitElement {
  static styles = lumoStyles;

  @property()
  suggestion!: SelectorSuggestion;

  @state()
  configuration: SelectorConfiguration = createDefaultConfiguration();
  @state()
  selectableStates: VaadinElementState[] = [];
  @state()
  selectedThemeNameCodeTab: number = 0;

  get scopeValue() {
    return this.configuration.useCustomTheme ? "specific" : "all";
  }

  protected updated(changedProperties: PropertyValues) {
    if (changedProperties.has("suggestion")) {
      this.configuration = createDefaultConfiguration();
      this.selectableStates = getApplicableStates(this.suggestion);
    }
  }

  handleBackClick() {
    this.dispatchEvent(new CustomEvent("configurator-back", {}));
  }

  handleScopeChange(e: RadioGroupValueChangedEvent) {
    this.configuration = {
      ...this.configuration,
      useCustomTheme: e.detail.value === "specific",
    };
  }

  handleCustomThemeNameChange(e: TextFieldValueChangedEvent) {
    this.configuration = {
      ...this.configuration,
      customThemeVariant: e.detail.value,
    };
  }

  handleThemeNameCodeTabChange(e: TabsSelectedChangedEvent) {
    this.selectedThemeNameCodeTab = e.detail.value;
  }

  handleSelectedStatesChange(e: CheckboxGroupValueChangedEvent) {
    const selectedStates = e.detail.value.map((value) => {
      const keyParts = parseStateAttributeKey(value);

      return this.selectableStates.find(
        (state) =>
          state.partName === keyParts.partName &&
          state.attribute === keyParts.attribute
      )!;
    });
    this.configuration = {
      ...this.configuration,
      selectedStates,
    };
  }

  render() {
    const showStateAttributesSection = this.selectableStates.length > 0;

    return html`
      <vaadin-vertical-layout class="h-screen items-stretch">
        <vaadin-horizontal-layout
          theme="spacing"
          class="items-baseline border-b border-contrast-20 p-s px-m"
        >
          <vaadin-button @click="${this.handleBackClick}">
            <vaadin-icon
              icon="vaadin:chevron-left-small"
              slot="prefix"
            ></vaadin-icon>
            Back
          </vaadin-button>
          <span class="font-bold capitalize">
            Theming: ${formatSuggestionTitle(this.suggestion)}
          </span>
        </vaadin-horizontal-layout>
        <vaadin-split-layout class="flex-grow flex-shrink">
          <vaadin-scroller
            scoll-direction="vertical"
            class="h-full p-s px-m"
            style="width: 30%"
          >
            <h3 class="m-0 mt-s">Configuration</h3>
            <vaadin-radio-group
              label="I want to theme:"
              theme="vertical"
              .value="${this.scopeValue}"
              @value-changed="${this.handleScopeChange}"
            >
              <vaadin-radio-button value="all"
                >All instances of ${this.suggestion.metaData.displayName}
              </vaadin-radio-button>
              <vaadin-radio-button value="specific"
                >Specific instances of ${this.suggestion.metaData.displayName}
              </vaadin-radio-button>
            </vaadin-radio-group>
            ${this.configuration.useCustomTheme
              ? html` <div>
                  <vaadin-text-field
                    label="With the theme variant:"
                    .value="${this.configuration.customThemeVariant}"
                    @value-changed="${this.handleCustomThemeNameChange}"
                  ></vaadin-text-field>
                </div>`
              : null}
            ${showStateAttributesSection
              ? html`
                  <div>
                    <vaadin-checkbox-group
                      label="When:"
                      theme="vertical"
                      @value-changed="${this.handleSelectedStatesChange}"
                    >
                      ${this.selectableStates.map(
                        (state) => html`
                          <vaadin-checkbox
                            value="${createStateAttributeKey(state)}"
                          >
                            <span
                              >${formatStateTitle(this.suggestion, state)}</span
                            >
                            <br />
                            <span class="text-s text-secondary"
                              >${state.description}</span
                            >
                          </vaadin-checkbox>
                        `
                      )}
                    </vaadin-checkbox-group>
                  </div>
                `
              : null}
          </vaadin-scroller>
          <vaadin-scroller
            scoll-direction="vertical"
            class="h-full p-s px-m"
            style="width: 70%"
          >
            <vaadin-horizontal-layout>
              <h3 class="m-0 mt-s flex-auto">Instructions</h3>
              <vaadin-tabs
                theme="minimal small"
                .selected="${this.selectedThemeNameCodeTab}"
                @selected-changed="${this.handleThemeNameCodeTabChange}"
              >
                <vaadin-tab>Flow</vaadin-tab>
                <vaadin-tab>Fusion</vaadin-tab>
              </vaadin-tabs>
            </vaadin-horizontal-layout>
            <ol>
              ${this.configuration.useCustomTheme
                ? html` <li class="mb-m">
                    <span class="font-bold">Apply theme variant</span>
                    <p class="m-0">
                      Apply the
                      <code>${this.configuration.customThemeVariant}</code>
                      theme variant to the relevant
                      ${this.suggestion.metaData.displayName} instances:
                    </p>
                    <div class="relative">
                      <th-snippet
                        class="mt-s"
                        .code="${this.selectedThemeNameCodeTab === 0
                          ? renderJavaThemeNameExample(
                              this.suggestion,
                              this.configuration.customThemeVariant
                            )
                          : renderWebThemeNameExample(
                              this.suggestion,
                              this.configuration.customThemeVariant
                            )}"
                      >
                      </th-snippet>
                    </div>
                  </li>`
                : null}
              <li class="mb-m">
                <span class="font-bold">Create a component theme file</span>
                <p class="m-0">
                  In your project folder, create a new file:
                  <th-snippet
                    class="mt-s"
                    .code="frontend/themes/&lt;your-application-theme&gt;/components/${this
                      .suggestion.metaData.elementName}.css"
                  ></th-snippet>
                </p>
              </li>
              <li class="mb-m">
                <span class="font-bold">Add CSS rule</span>
                <p class="m-0">
                  Add the following CSS to the file created above:
                </p>
                <th-snippet
                  class="mt-s"
                  .code="${renderCssCode(this.suggestion, this.configuration)}"
                ></th-snippet>
              </li>
            </ol>
          </vaadin-scroller>
        </vaadin-split-layout>
      </vaadin-vertical-layout>
    `;
  }
}

const getApplicableStates = (
  suggestion: SelectorSuggestion
): VaadinElementState[] => {
  const allPartNames = suggestion.partHierarchy.reduce(
    (acc: string[], current) => {
      return [...acc, ...current.partNames];
    },
    []
  );
  return suggestion.metaData.states.filter((state) =>
    allPartNames.includes(state.partName)
  );
};

const formatStateTitle = (
  suggestion: SelectorSuggestion,
  state: VaadinElementState
) => {
  const subject =
    state.partName === ":host"
      ? suggestion.metaData.displayName
      : capitalize(state.partName);

  const formattedState = state.attribute.replace(/-/g, " ");

  return `${subject} has the ${formattedState} state`;
};

const renderWebThemeNameExample = (
  suggestion: SelectorSuggestion,
  themeName: string
) => {
  const elementName = suggestion.metaData.elementName;
  return `<${elementName} theme="${themeName}">...</${elementName}>`;
};

const renderJavaThemeNameExample = (
  suggestion: SelectorSuggestion,
  themeName: string
) => {
  const elementName = suggestion.metaData.elementName;
  const variableName = toCamel(elementName.replace("vaadin-", ""));
  return `${variableName}.getElement().setAttribute("theme", "${themeName}");`;
};

const renderCssCode = (
  suggestion: SelectorSuggestion,
  configuration: SelectorConfiguration
) => {
  const selectors: string[] = [];
  const partNamesWithSelectedStates = uniq(
    configuration.selectedStates.map((state) => state.partName)
  );

  suggestion.partHierarchy.forEach((partItem) => {
    // Determine if the element should be included in the selector at all
    const isHost = partItem.partNames.includes(":host");
    const referencedPartNames = partItem.partNames.filter((partName) => {
      const isSelectedPart =
        suggestion.type === SelectorSuggestionType.VaadinElementPart &&
        partName === suggestion.part!.name;
      const hasSelectedState = partNamesWithSelectedStates.includes(partName);

      return isSelectedPart || hasSelectedState;
    });
    const hasReferencedPartNames = referencedPartNames.length > 0;
    const includeInSelector = isHost || hasReferencedPartNames;

    if (!includeInSelector) return;

    const selectorSequence: string[] = [];

    // Add selector root
    if (!isHost) {
      referencedPartNames.forEach((partName) => {
        selectorSequence.push(`[part~='${partName}']`);
      });
    }

    // Add theme name if its the host element and we use a custom theme
    if (isHost && configuration.useCustomTheme) {
      selectorSequence.push(`[theme~='${configuration.customThemeVariant}']`);
    }

    // Add states
    const partItemStates = configuration.selectedStates.filter((state) =>
      partItem.partNames.includes(state.partName)
    );

    partItemStates.forEach((state) => {
      selectorSequence.push(`[${state.attribute}]`);
    });

    // Wrap in host selector, if host
    if (isHost) {
      if (selectorSequence.length > 0) {
        selectorSequence.unshift(":host(");
        selectorSequence.push(")");
      } else {
        selectorSequence.push(":host");
      }
    }

    // Finalize selector
    const combinedSequence = selectorSequence.join("");
    selectors.push(combinedSequence);
  });

  const combinedSelector = selectors.join(" ");

  return `
${combinedSelector} {
  /* Add your CSS styles here, for example: */
  /* background: var(--lumo-primary-color); */
}
    `.trim();
};

const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const capitalize = (value: string) => {
  return value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

const createStateAttributeKey = (state: VaadinElementState) => {
  return `${state.partName}|${state.attribute}`;
};

const parseStateAttributeKey = (key: string) => {
  const parts = key.split("|");

  return {
    partName: parts[0],
    attribute: parts[1],
  };
};
