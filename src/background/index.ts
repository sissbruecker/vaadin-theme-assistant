import { Bridge } from "./Bridge";
import { getBrowser } from "../shared/browserApi";

const bridge = new Bridge();

const init = () => {
  const browser = getBrowser();

  browser.runtime.onConnect.addListener((port) => {
    bridge.registerPort(port);
  });
};

init();
