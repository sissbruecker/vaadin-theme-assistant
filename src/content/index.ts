import { ElementPicker } from "./ElementPicker";
import { getBrowser } from "../shared/browserApi";
import { Action, ActionSource, ActionType } from "../shared/actions";

// @ts-ignore
const isInstalled = window.Vaadin.themeassistant.installed;

if (!isInstalled) {
  install();
  // @ts-ignore
  window.Vaadin.themeassistant.installed = true;
}

function install() {
  // @ts-ignore
  const tabId = window.Vaadin.themeassistant.tabId;

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
}
