import { getBrowser } from "../shared/browserApi";
import { ActionSource, injectContentScriptAction } from "../shared/actions";
import { html, render } from "lit";
import './panel';

export function app() {
  const browser = getBrowser();
  const port = browser.runtime.connect({
    name: `${ActionSource.Devtools}/${browser.devtools.inspectedWindow.tabId}`,
  });

  port.postMessage(
    injectContentScriptAction(browser.devtools.inspectedWindow.tabId)
  );

  // Render app
  render(html`<th-panel .port="${port}"></th-panel>`, document.getElementById("app")!);
}
