import { Bridge } from "./Bridge";
import { getBrowser } from "../shared/browserApi";
import {
  Action,
  ActionType,
  InjectContentScriptAction,
} from "../shared/actions";

const bridge = new Bridge(backgroundActionHandler);

const init = () => {
  const browser = getBrowser();

  browser.runtime.onConnect.addListener((port) => {
    bridge.registerPort(port);
  });
};

function backgroundActionHandler(action: Action) {
  switch (action.type) {
    case ActionType.InjectContentScript:
      handleInjectContentScript(action);
      break;
  }
}

function handleInjectContentScript(action: InjectContentScriptAction) {
  const browser = getBrowser();
  const tabId = action.payload.tabId;

  // store tab id for content script
  browser.tabs.executeScript(tabId, {
    code: `
      window.Vaadin = window.Vaadin || {};
      window.Vaadin.themeassistant = window.Vaadin.themeassistant || {};
      window.Vaadin.themeassistant.tabId = ${tabId};
    `,
  });
  browser.tabs.executeScript(tabId, {
    file: "build/content.js",
  });
}

init();
