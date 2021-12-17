const OBSERVE_INTERVAL = 100;

export class ElementOverlay {
  private element?: Element;

  private overlay!: HTMLElement;
  private label!: HTMLElement;
  private observeInterval?: number;

  constructor() {
    this.initializeDom();
  }

  private initializeDom() {
    const overlay = document.createElement("div");
    overlay.style.border = "dashed 2px hsl(214, 90%, 52%)";
    overlay.style.position = "absolute";
    overlay.style.boxSizing = "border-box";
    overlay.style.zIndex = "99999";
    overlay.style.pointerEvents = "none";

    const label = document.createElement("label");
    label.style.position = "absolute";
    label.style.minHeight = "20px";
    label.style.lineHeight = "20px";
    label.style.left = "0";
    label.style.borderTopLeftRadius = "2px";
    label.style.borderTopRightRadius = "2px";
    label.style.background = "hsl(214, 90%, 52%)";
    label.style.color = "#fff";
    label.style.fontWeight = "bold";
    label.style.fontSize = "12px";
    label.style.textTransform = "capitalize";
    label.style.padding = "0 4px";
    label.textContent = "Label";
    overlay.append(label);

    this.overlay = overlay;
    this.label = label;
  }

  setElement(element: Element, labelText: string) {
    if (this.element == element && labelText === this.label.textContent) return;

    this.element = element;
    document.body.append(this.overlay);
    this.positionOverlay();
    this.label.textContent = labelText;
    this.startObservingTargetElement();
  }

  clearElement() {
    this.element = undefined;
    this.overlay.remove();
    this.stopObservingTargetElement();
  }

  private positionOverlay() {
    if (!this.element) return;
    const clientRect = this.element.getBoundingClientRect();

    this.overlay.style.top = window.scrollY + clientRect.top + "px";
    this.overlay.style.left = window.scrollX + clientRect.left + "px";
    this.overlay.style.width = clientRect.width + "px";
    this.overlay.style.height = clientRect.height + "px";

    this.label.style.bottom = clientRect.height - 2 + "px";
  }

  private startObservingTargetElement() {
    // There is no easy solution for observing the connectedness of an element
    // at the moment: https://github.com/whatwg/dom/issues/533
    // For now simply use a brute-force approach of checking the connectedness
    // in an interval
    this.stopObservingTargetElement();
    this.observeInterval = window.setInterval(() => {
      if(this.element && !this.element.isConnected) {
        this.clearElement();
      }
    }, OBSERVE_INTERVAL);
  }

  private stopObservingTargetElement() {
    window.clearInterval(this.observeInterval);
  }
}
