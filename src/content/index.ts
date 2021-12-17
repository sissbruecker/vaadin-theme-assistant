import { ElementPicker } from "./ElementPicker";
import { getBrowser } from "../shared/browserApi";
import {
  Action,
  ActionSource,
  ActionType,
  contentReadyAction,
} from "../shared/actions";
import Port = chrome.runtime.Port;

declare global {
  interface Window {
    vaadin_theme_assistant: {
      installed: boolean;
      tabId: number;
      port: Port;
    };
  }
}

const isInstalled = window.vaadin_theme_assistant.installed;

if (!isInstalled) {
  install();
  window.vaadin_theme_assistant.installed = true;
  window.vaadin_theme_assistant.port.postMessage(contentReadyAction());
}

function install() {
  const tabId = window.vaadin_theme_assistant.tabId;

  let elementPicker: ElementPicker;

  function handleContentAction(action: Action) {
    switch (action.type) {
      case ActionType.StartPicking:
        elementPicker.start();
        break;
      case ActionType.CancelPicking:
        elementPicker.cancel();
        break;
      case ActionType.HighlightElement:
        elementPicker.highlight(action.payload.suggestion);
        break;
    }
  }

  const browser = getBrowser();
  const port = browser.runtime.connect({
    name: `${ActionSource.Content}/${tabId}`,
  });
  elementPicker = new ElementPicker(port);

  port.onMessage.addListener(handleContentAction);

  window.vaadin_theme_assistant.port = port;
}
