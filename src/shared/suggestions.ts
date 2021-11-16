import { ElementData, ElementPickData, PartHierarchyItem } from "./models";
import {
  getMetaData,
  VaadinElementMetaData,
  VaadinElementPart,
} from "../metadata";
import { html } from "lit";

export enum SelectorSuggestionType {
  VaadinElement = "vaadinElement",
  VaadinElementPart = "vaadinElementPart",
  VaadinElementSlottedChild = "vaadinElementSlottedChild",
}

export interface SelectorSuggestion {
  pickRef: number;
  type: SelectorSuggestionType;
  element: ElementData;
  path: ElementData[];
  location: number;
  metaData: VaadinElementMetaData;
  part?: VaadinElementPart;
  partHierarchy: PartHierarchyItem[];
  slotName?: string;
}

const suggestionStrategies = [
  vaadinElementPartStrategy,
  vaadinElementStrategy,
  // vaadinElementSlottedChildStrategy,
];

export function getSelectorSuggestions(elementPick: ElementPickData, max = 5) {
  let suggestions: SelectorSuggestion[] = [];
  const path = elementPick.composedPath;

  path.forEach((element, location) => {
    suggestionStrategies.forEach((strategy) => {
      let suggestionsFromStrategy = strategy(
        elementPick.pickRef,
        element,
        path,
        location
      );
      suggestions = [...suggestions, ...suggestionsFromStrategy];
    });
  });

  return suggestions.slice(0, max);
}

function vaadinElementStrategy(
  pickRef: number,
  element: ElementData,
  path: ElementData[],
  location: number
): SelectorSuggestion[] {
  const metaData = getMetaData(element.name);

  if (!metaData) {
    // Not a vaadin element
    return [];
  }

  const partHierarchy = getPartHierarchy(path, location, location);

  return [
    {
      pickRef,
      type: SelectorSuggestionType.VaadinElement,
      element,
      path,
      location,
      metaData: metaData,
      partHierarchy,
    },
  ];
}

function vaadinElementPartStrategy(
  pickRef: number,
  element: ElementData,
  path: ElementData[],
  location: number
): SelectorSuggestion[] {
  const partNames = getElementPartNames(element);

  if (!partNames.length) {
    // Element is not a part
    return [];
  }

  const owningVaadinElement = findAncestorVaadinElement(path, location + 1);

  if (!owningVaadinElement) {
    // Owning Vaadin element could not be found
    return [];
  }

  const partHierarchy = getPartHierarchy(
    path,
    location,
    owningVaadinElement.location
  );

  // Experimental: increase rating for parts with longer names
  partNames.sort((left, right) => left.length - right.length);

  return partNames
    .map((partName) => {
      const part = owningVaadinElement.metaData.parts.find(
        (part) => part.name === partName
      );

      // Part is not documented
      if (!part) return null;

      const suggestion: SelectorSuggestion = {
        pickRef,
        type: SelectorSuggestionType.VaadinElementPart,
        element,
        path,
        location,
        metaData: owningVaadinElement.metaData,
        part,
        partHierarchy,
      };

      return suggestion;
    })
    .filter((suggestion) => !!suggestion) as SelectorSuggestion[];
}

/*
function vaadinElementSlottedChildStrategy(
  element: ElementData,
  path: ElementData[],
  location: number
): SelectorSuggestion[] {
  const slotName = element.attributes.slot;

  if (!slotName) {
    // Element is not slotted
    return [];
  }

  const owningVaadinElement = findAncestorVaadinElement(path, location + 1);

  if (!owningVaadinElement) {
    // Owning Vaadin element could not be found
    return [];
  }

  const rating =
    VAADIN_ELEMENT_SLOTTED_CHILD_BASE_RATING + rateLocation(path, location);

  return [
    {
      type: SelectorSuggestionType.VaadinElementSlottedChild,
      rating,
      element,
      path,
      location,
      metaData: owningVaadinElement.metaData,
      slotName,
    },
  ];
}
 */

function findAncestorVaadinElement(path: ElementData[], fromIndex: number) {
  for (let i = fromIndex; i < path.length; i++) {
    const element = path[i];
    const metaData = getMetaData(element.name);

    if (metaData) {
      return {
        element,
        location: i,
        metaData,
      };
    }
  }
  return null;
}

function getElementPartNames(element: ElementData): string[] {
  const part = element.attributes.part;

  if (!part) return [];

  return part
    .trim()
    .split(" ")
    .filter((part) => !!part);
}

function getPartHierarchy(
  path: ElementData[],
  elementIndex: number,
  owningVaadinElementIndex: number
): PartHierarchyItem[] {
  if (elementIndex > owningVaadinElementIndex) {
    throw new Error("Element must be within the owning Vaadin element");
  }

  const hierarchySlice = path.slice(elementIndex, owningVaadinElementIndex + 1);
  return hierarchySlice
    .map((element, i) => {
      const isOwningElement = i === hierarchySlice.length - 1;
      const partNames = isOwningElement
        ? [":host"]
        : getElementPartNames(element);

      return {
        element,
        partNames,
      };
    })
    .filter((item) => item.partNames.length > 0)
    .reverse();
}

export function formatSuggestionTitle(suggestion: SelectorSuggestion) {
  switch (suggestion.type) {
    case SelectorSuggestionType.VaadinElement:
      return suggestion.metaData.displayName;
    case SelectorSuggestionType.VaadinElementPart:
      return formatPartName(
        suggestion.metaData.displayName,
        suggestion.part!.name
      );
    case SelectorSuggestionType.VaadinElementSlottedChild:
      return `${suggestion.metaData.displayName} > Slotted child: ${suggestion.slotName}`;
  }
}

export function formatPartName(elementName: string, partName: string) {
  return `${elementName} > ${partName.replace(/-/g, " ")}`;
}

export function formatSuggestionDescription(suggestion: SelectorSuggestion) {
  switch (suggestion.type) {
    case SelectorSuggestionType.VaadinElement:
      return "The host component itself";
    case SelectorSuggestionType.VaadinElementPart:
      return `${suggestion.part?.description}`;
    case SelectorSuggestionType.VaadinElementSlottedChild:
      return html`The <code>${suggestion.element.name}</code> element in the
        <code>${suggestion.slotName}</code> slot`;
  }
}
