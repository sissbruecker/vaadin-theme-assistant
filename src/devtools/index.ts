import { getBrowser } from "../shared/browserApi";

export function setupPanel() {
  const browser = getBrowser();
  browser.devtools.panels.create(
    "Vaadin Theme Assistant",
    "assets/dev_tools_panel_icon.png",
    "devtools_panel.html"
  );
}

export { app } from "./app";
