import * as sinon from "sinon";

export function mockPort() {
  return {
    postMessage: sinon.spy(),
  };
}

export type MockPort = ReturnType<typeof mockPort>;

export function clickElementWithClientPosition(el: HTMLElement) {
  const clientRect = el.getBoundingClientRect();
  const event = new CustomEvent("click", {});
  // @ts-ignore
  event.clientX = clientRect.x + 5;
  // @ts-ignore
  event.clientY = clientRect.y + 5;

  document.dispatchEvent(event);
}