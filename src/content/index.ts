import { ElementPicker } from "./ElementPicker";
import { getBrowser } from "../shared/browserApi";
import {
  Message,
  MessageSource,
  MessageType,
  contentReadyMessage,
} from "../shared/messages";
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
  window.vaadin_theme_assistant.port.postMessage(contentReadyMessage());
}

function install() {
  const tabId = window.vaadin_theme_assistant.tabId;

  let elementPicker: ElementPicker;

  function handleContentMessage(message: Message) {
    switch (message.type) {
      case MessageType.StartPicking:
        elementPicker.start();
        break;
      case MessageType.CancelPicking:
        elementPicker.cancel();
        break;
      case MessageType.HighlightElement:
        elementPicker.highlight(message.payload.suggestion);
        break;
    }
  }

  const browser = getBrowser();
  const port = browser.runtime.connect({
    name: `${MessageSource.Content}/${tabId}`,
  });
  elementPicker = new ElementPicker(port);

  port.onMessage.addListener(handleContentMessage);

  window.vaadin_theme_assistant.port = port;
}
