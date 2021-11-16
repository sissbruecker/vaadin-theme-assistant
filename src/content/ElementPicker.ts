import {
  ElementData,
  ElementDataAttributes,
  ElementPickData,
} from "../shared/models";
import { pickElementAction } from "../shared/actions";
import { ElementOverlay } from "./ElementOverlay";
import {
  formatSuggestionTitle,
  getSelectorSuggestions,
  SelectorSuggestion,
} from "../shared/suggestions";
import Port = chrome.runtime.Port;

interface HasElementFromPoint {
  elementFromPoint(x: number, y: number): Element | null;
}

interface PickedElementReference {
  pickRef: number;
  element: Element;
  composedPath: Element[];
}

const CAPTURE_EVENT_TYPE = "themeassistantcomposedpathcapture";

export class ElementPicker {
  private overlay = new ElementOverlay();
  private lastPickedElement?: PickedElementReference;
  private nextPickRef = 0;

  constructor(private port: Port) {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.debouncedMouseMoveHandler = this.debouncedMouseMoveHandler.bind(this);
    /* TODO: consider debounce
    this.debouncedMouseMoveHandler = debounce(
      this.debouncedMouseMoveHandler.bind(this),
      10
    );
     */
    this.handleClick = this.handleClick.bind(this);
  }

  start() {
    this.lastPickedElement = undefined;
    this.overlay.setElement(null, "");
    this.registerListeners();
  }

  cancel() {
    this.unregisterListeners();
    this.highlight();
  }

  highlight(suggestion?: SelectorSuggestion) {
    // Clear highlight if no suggestion is provided
    if (!suggestion) {
      this.overlay.setElement(null, "");
      return;
    }

    // Ignore if the suggestion is from a previous pick
    if (this.lastPickedElement?.pickRef !== suggestion.pickRef) return;

    this.overlay.setElement(
      this.lastPickedElement.composedPath[suggestion.location],
      formatSuggestionTitle(suggestion)
    );
  }

  private handleMouseMove(event: MouseEvent) {
    this.debouncedMouseMoveHandler(event);
  }

  private debouncedMouseMoveHandler(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    const elementPointedAt = getElementAtPoint(document, x, y);

    if (!elementPointedAt) return;

    this.pickElement(elementPointedAt, true);
  }

  private handleClick(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    const elementPointedAt = getElementAtPoint(document, x, y);

    if (!elementPointedAt) return;

    this.pickElement(elementPointedAt, false);
    this.cancel();
    event.stopPropagation();
  }

  private registerListeners() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("click", this.handleClick, true);
  }

  private unregisterListeners() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("click", this.handleClick, true);
  }

  private pickElement(element: Element, isPreview: boolean) {
    if (this.lastPickedElement?.element === element && isPreview) return;

    const composedPath = getComposedPath(element).filter(
      (el) => el instanceof Element
    ) as Element[];

    this.lastPickedElement = {
      pickRef: ++this.nextPickRef,
      element,
      composedPath,
    };

    const data: ElementPickData = {
      pickRef: this.lastPickedElement.pickRef,
      element: toElementInfo(this.lastPickedElement.element),
      composedPath: this.lastPickedElement.composedPath.map(toElementInfo),
    };

    const suggestions = getSelectorSuggestions(data);

    if (isPreview) {
      // If we are still picking, then only highlight first suggestion
      const firstSuggestionOrUndefined =
        suggestions.length > 0 ? suggestions[0] : undefined;
      this.highlight(firstSuggestionOrUndefined);
    } else {
      // Otherwise notify dev tools panel about pick and suggestions
      this.port.postMessage(pickElementAction(data, suggestions));
    }
  }
}

function getElementAtPoint(
  root: HasElementFromPoint,
  x: number,
  y: number
): Element | null {
  const element = root.elementFromPoint(x, y);

  if (!element) return null;

  if (element.shadowRoot) {
    return getElementAtPoint(
      element.shadowRoot as unknown as HasElementFromPoint,
      x,
      y
    );
  }

  return element;
}

function getComposedPath(element: Element): EventTarget[] {
  const path = captureComposedPath(element);
  const last = path[path.length - 1];

  if (last instanceof ShadowRoot) {
    const hostElement = last.host;
    const hostPath = getComposedPath(hostElement);

    return [...path, ...hostPath];
  }

  return path;
}

function captureComposedPath(element: Element) {
  let composedPath: EventTarget[] = [];
  const handler = (e: Event) => {
    composedPath = e.composedPath();
  };

  element.addEventListener(CAPTURE_EVENT_TYPE, handler);
  element.dispatchEvent(new CustomEvent(CAPTURE_EVENT_TYPE));
  element.removeEventListener(CAPTURE_EVENT_TYPE, handler);

  return composedPath;
}

function toElementInfo(element: Element): ElementData {
  const attributeNames = element.getAttributeNames();
  const attributes = attributeNames.reduce((result, attributeName) => {
    result[attributeName] = element.getAttribute(attributeName) || "";
    return result;
  }, {} as ElementDataAttributes);

  return {
    name: element.nodeName.toLowerCase(),
    attributes,
  };
}
