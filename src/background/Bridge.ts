import Port = chrome.runtime.Port;
import {
  cancelPickingMessage,
  highlightElementMessage,
  Message,
  MessageSource,
  MessageTarget,
  MessageType,
} from "../shared/messages";
import { getBrowser } from "../shared/browserApi";

interface Connection {
  devtoolsPort?: Port;
  contentPort?: Port;
  queuedContentMessages: Message[];
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

    if (portSource === MessageSource.Content) {
      connection.contentPort = port;
      console.debug("Registered content port for tab: " + tabId);
    }
    if (portSource === MessageSource.Devtools) {
      connection.devtoolsPort = port;
      console.debug("Registered devtools port for tab: " + tabId);
    }

    port.onMessage.addListener(this.dispatchMessage.bind(this));
    port.onDisconnect.addListener(() => {
      if (port === connection.contentPort) {
        connection.contentPort = undefined;
        console.debug("Unregistered content port for tab: " + tabId);
      }
      if (port === connection.devtoolsPort) {
        connection.devtoolsPort = undefined;
        console.debug("Unregistered devtools port for tab: " + tabId);
        // Reset element picker and overlay when closing dev tools - this
        // should probably live somewhere else
        if (connection.contentPort) {
          connection.contentPort.postMessage(cancelPickingMessage());
          connection.contentPort.postMessage(highlightElementMessage());
        }
      }
      if (!connection.devtoolsPort && !connection.contentPort) {
        delete this.connectionMap[tabId];
      }
    });
  }

  private async dispatchMessage(message: Message, port: Port) {
    const tabId = getTabId(port);

    if (!tabId) return;

    const connection = this.getOrCreateConnection(tabId);

    switch (message.target) {
      case MessageTarget.Content:
        ensureContentScript(tabId);
        if (connection.contentPort) {
          console.log("dispatch to content: ", message);
          connection.contentPort.postMessage(message);
        } else {
          connection.queuedContentMessages.push(message);
        }
        break;
      case MessageTarget.Devtools:
        console.log("dispatch to devtools: ", message);
        if (connection.devtoolsPort) {
          connection.devtoolsPort.postMessage(message);
        } else {
          console.warn(
            "No devtools port registered in bridge for tab: " + tabId
          );
        }
        break;
      case MessageTarget.Background:
        if (message.type === MessageType.ContentReady) {
          console.log("content script ready");
          if (connection.queuedContentMessages.length) {
            console.log(
              `dispatch ${connection.queuedContentMessages.length} queued content messages`
            );
            if (connection.contentPort) {
              connection.queuedContentMessages.forEach((queuedMessage) => {
                connection.contentPort!.postMessage(queuedMessage);
              });
              connection.queuedContentMessages = [];
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

    const connection: Connection = { queuedContentMessages: [] };
    this.connectionMap[tabId] = connection;

    return connection;
  }
}

const getTabId = (port: Port): number => {
  const parts = port.name.split("/");
  return parseInt(parts[parts.length - 1]);
};

const getPortSource = (port: Port): MessageSource | null => {
  if (port.name.startsWith(MessageSource.Content)) return MessageSource.Content;
  if (port.name.startsWith(MessageSource.Devtools))
    return MessageSource.Devtools;
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
