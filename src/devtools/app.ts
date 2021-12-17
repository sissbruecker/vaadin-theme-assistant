import { html, render } from "lit";
import { ActionSource } from "../shared/actions";
import { getBrowser } from "../shared/browserApi";
import "./panel";

export function app() {
  const browser = getBrowser();
  const port = browser.runtime.connect({
    name: `${ActionSource.Devtools}/${browser.devtools.inspectedWindow.tabId}`,
  });

  // Render app
  render(
    html`<th-panel .port="${port}"></th-panel>`,
    document.getElementById("app")!
  );
}
