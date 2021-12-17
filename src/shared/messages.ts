import { ElementPickData } from "./models";
import { SelectorSuggestion } from "./suggestions";

export enum MessageTarget {
  Content = "content",
  Background = "background",
  Devtools = "devtools",
}

export enum MessageSource {
  Content = "vaadin-theme-helper/content",
  Devtools = "vaadin-theme-helper/devtools",
}

export enum MessageType {
  ContentReady = "contentReady",
  StartPicking = "startPicking",
  CancelPicking = "cancelPicking",
  PickElement = "pickElement",
  HighlightElement = "highlightElement",
}

interface MessageBase<TPayload = {}> {
  type: MessageType;
  target: MessageTarget;
  payload: TPayload;
}

export interface ContentReadyMessage extends MessageBase {
  type: MessageType.ContentReady;
}

export function contentReadyMessage(): ContentReadyMessage {
  return {
    type: MessageType.ContentReady,
    target: MessageTarget.Background,
    payload: {}
  }
}

export interface StartPickingMessage extends MessageBase {
  type: MessageType.StartPicking;
}

export function startPickingMessage(): StartPickingMessage {
  return {
    type: MessageType.StartPicking,
    target: MessageTarget.Content,
    payload: {},
  };
}

export interface CancelPickingMessage extends MessageBase {
  type: MessageType.CancelPicking;
}

export function cancelPickingMessage(): CancelPickingMessage {
  return {
    type: MessageType.CancelPicking,
    target: MessageTarget.Content,
    payload: {},
  };
}

export interface PickElementMessage
  extends MessageBase<{
    pickedElement: ElementPickData;
    suggestions: SelectorSuggestion[];
  }> {
  type: MessageType.PickElement;
}

export function pickElementMessage(
  elementPick: ElementPickData,
  suggestions: SelectorSuggestion[]
): PickElementMessage {
  return {
    type: MessageType.PickElement,
    target: MessageTarget.Devtools,
    payload: {
      pickedElement: elementPick,
      suggestions,
    },
  };
}

export interface HighlightElementMessage
  extends MessageBase<{
    suggestion?: SelectorSuggestion;
  }> {
  type: MessageType.HighlightElement;
}

export function highlightElementMessage(
  suggestion?: SelectorSuggestion
): HighlightElementMessage {
  return {
    type: MessageType.HighlightElement,
    target: MessageTarget.Content,
    payload: {
      suggestion,
    },
  };
}

export type Message =
  | ContentReadyMessage
  | StartPickingMessage
  | CancelPickingMessage
  | PickElementMessage
  | HighlightElementMessage;

export type MessageHandler = (message: Message) => void;
