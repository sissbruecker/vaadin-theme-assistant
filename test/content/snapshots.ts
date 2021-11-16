import { fixture, html } from "@open-wc/testing";
import "@vaadin/date-picker";
import "@vaadin/vertical-layout";
import { ElementData, PartHierarchyItem } from "../../src/shared/models";
import { SelectorSuggestionType } from "../../src/shared/suggestions";

export interface SuggestionSnapshot {
  type: SelectorSuggestionType;
  element: ElementData;
  location: number;
  part?: { name: string };
  partHierarchy: PartHierarchyItem[];
}

export interface ElementPickerSnapshotTest {
  setupFixture(): Promise<unknown>
  elementToPick: HTMLElement
  composedPath: ElementData[]
  suggestions: SuggestionSnapshot[]
}

export class DatePickerToggleButtonSnapshotTest implements ElementPickerSnapshotTest{

  elementToPick!: HTMLElement;

  async setupFixture() {
    const datePicker = await fixture(
      html` <vaadin-date-picker></vaadin-date-picker> `
    );
    this.elementToPick = datePicker.shadowRoot!.querySelector(
      '[part="toggle-button"]'
    )!;
  }

  composedPath: ElementData[] = [
    {
      name: "div",
      attributes: {
        part: "toggle-button",
        slot: "suffix",
        role: "button",
      },
    },
    {
      name: "slot",
      attributes: {
        name: "suffix",
      },
    },
    {
      name: "vaadin-input-container",
      attributes: {
        part: "input-field",
      },
    },
    {
      name: "div",
      attributes: {
        class: "vaadin-date-picker-container",
      },
    },
    {
      name: "vaadin-date-picker",
      attributes: {},
    },
    {
      name: "div",
      attributes: {},
    },
    {
      name: "body",
      attributes: {},
    },
    {
      name: "html",
      attributes: {},
    },
  ];

  suggestions: SuggestionSnapshot[] = [
    {
      type: SelectorSuggestionType.VaadinElementPart,
      element: {
        name: "div",
        attributes: {
          part: "toggle-button",
          slot: "suffix",
          role: "button",
        },
      },
      location: 0,
      part: {
        name: "toggle-button",
      },
      partHierarchy: [
        {
          element: {
            name: "vaadin-date-picker",
            attributes: {},
          },
          partNames: [":host"],
        },
        {
          element: {
            name: "vaadin-input-container",
            attributes: {
              part: "input-field",
            },
          },
          partNames: ["input-field"],
        },
        {
          element: {
            name: "div",
            attributes: {
              part: "toggle-button",
              slot: "suffix",
              role: "button",
            },
          },
          partNames: ["toggle-button"],
        },
      ],
    },
    {
      type: SelectorSuggestionType.VaadinElementPart,
      element: {
        name: "vaadin-input-container",
        attributes: {
          part: "input-field",
        },
      },
      location: 2,
      part: {
        name: "input-field",
      },
      partHierarchy: [
        {
          element: {
            name: "vaadin-date-picker",
            attributes: {},
          },
          partNames: [":host"],
        },
        {
          element: {
            name: "vaadin-input-container",
            attributes: {
              part: "input-field",
            },
          },
          partNames: ["input-field"],
        },
      ],
    },
    {
      type: SelectorSuggestionType.VaadinElement,
      element: {
        name: "vaadin-date-picker",
        attributes: {},
      },
      location: 4,
      partHierarchy: [
        {
          element: {
            name: "vaadin-date-picker",
            attributes: {},
          },
          partNames: [":host"],
        },
      ],
    },
  ];
}
