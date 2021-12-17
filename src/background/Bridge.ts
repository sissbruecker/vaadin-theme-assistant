import Port = chrome.runtime.Port;
import {
  Action,
  ActionSource,
  ActionTarget,
  ActionType,
} from "../shared/actions";
import { getBrowser } from "../shared/browserApi";

interface Connection {
  devtoolsPort?: Port;
  contentPort?: Port;
  queuedContentActions: Action[];
}

interface ConnectionMap {
  [tabId: number]: Connection;
}

export class Bridge {
  private connectionMap: ConnectionMap = {};

  constructor() {}

  registerPort(port: Port) {
    const tabId = getTabId(port);

    if (!tabId) return;

    const connection = this.getOrCreateConnection(tabId);
    const portSource = getPortSource(port);

    if (!portSource) {
      throw new Error(
        "Bridge connection requests must come from either content script or devtools script"
      );
    }

    if (portSource === ActionSource.Content) {
      connection.contentPort = port;
      console.debug("Registered content port for tab: " + tabId);
    }
    if (portSource === ActionSource.Devtools) {
      connection.devtoolsPort = port;
      console.debug("Registered devtools port for tab: " + tabId);
    }

    port.onMessage.addListener(this.dispatchAction.bind(this));
    port.onDisconnect.addListener(() => {
      if (port === connection.contentPort) {
        connection.contentPort = undefined;
        console.debug("Unregistered content port for tab: " + tabId);
      }
      if (port === connection.devtoolsPort) {
        connection.devtoolsPort = undefined;
        console.debug("Unregistered devtools port for tab: " + tabId);
      }
      if (!connection.devtoolsPort && !connection.contentPort) {
        delete this.connectionMap[tabId];
      }
    });
  }

  private async dispatchAction(action: Action, port: Port) {
    const tabId = getTabId(port);

    if (!tabId) return;

    const connection = this.getOrCreateConnection(tabId);

    switch (action.target) {
      case ActionTarget.Content:
        ensureContentScript(tabId);
        if (connection.contentPort) {
          console.log("dispatch to content: ", action);
          connection.contentPort.postMessage(action);
        } else {
          connection.queuedContentActions.push(action);
        }
        break;
      case ActionTarget.Devtools:
        console.log("dispatch to devtools: ", action);
        if (connection.devtoolsPort) {
          connection.devtoolsPort.postMessage(action);
        } else {
          console.warn(
            "No devtools port registered in bridge for tab: " + tabId
          );
        }
        break;
      case ActionTarget.Background:
        if (action.type === ActionType.ContentReady) {
          console.log("content script ready");
          if (connection.queuedContentActions.length) {
            console.log(
              `dispatch ${connection.queuedContentActions.length} queued content actions`
            );
            if (connection.contentPort) {
              connection.queuedContentActions.forEach((queuedAction) => {
                connection.contentPort!.postMessage(queuedAction);
              });
              connection.queuedContentActions = [];
            } else {
              console.error("no content port for tab: " + tabId);
            }
          }
        }
        break;
    }
  }

  private getOrCreateConnection(tabId: number) {
    const existingConnection = this.connectionMap[tabId];
    if (existingConnection) return existingConnection;

    const connection: Connection = { queuedContentActions: [] };
    this.connectionMap[tabId] = connection;

    return connection;
  }
}

const getTabId = (port: Port): number => {
  const parts = port.name.split("/");
  return parseInt(parts[parts.length - 1]);
};

const getPortSource = (port: Port): ActionSource | null => {
  if (port.name.startsWith(ActionSource.Content)) return ActionSource.Content;
  if (port.name.startsWith(ActionSource.Devtools)) return ActionSource.Devtools;
  return null;
};

const ensureContentScript = (tabId: number) => {
  const browser = getBrowser();

  // store tab id for content script
  browser.tabs.executeScript(tabId, {
    code: `
      window.vaadin_theme_assistant = window.vaadin_theme_assistant || {};
      window.vaadin_theme_assistant.tabId = ${tabId};
    `,
  });
  // load content script
  browser.tabs.executeScript(tabId, {
    file: "build/content.js",
  });
};
