import { ElementPickData } from "./models";
import { SelectorSuggestion } from "./suggestions";

export enum ActionTarget {
  Content = "content",
  Background = "background",
  Devtools = "devtools",
}

export enum ActionSource {
  Content = "vaadin-theme-helper/content",
  Devtools = "vaadin-theme-helper/devtools",
}

export enum ActionType {
  ContentReady = "contentReady",
  StartPicking = "startPicking",
  CancelPicking = "cancelPicking",
  PickElement = "pickElement",
  HighlightElement = "highlightElement",
}

interface ActionBase<TPayload = {}> {
  type: ActionType;
  target: ActionTarget;
  payload: TPayload;
}

export interface ContentReadyAction extends ActionBase {
  type: ActionType.ContentReady;
}

export function contentReadyAction(): ContentReadyAction {
  return {
    type: ActionType.ContentReady,
    target: ActionTarget.Background,
    payload: {}
  }
}

export interface StartPickingAction extends ActionBase {
  type: ActionType.StartPicking;
}

export function startPickingAction(): StartPickingAction {
  return {
    type: ActionType.StartPicking,
    target: ActionTarget.Content,
    payload: {},
  };
}

export interface CancelPickingAction extends ActionBase {
  type: ActionType.CancelPicking;
}

export function cancelPickingAction(): CancelPickingAction {
  return {
    type: ActionType.CancelPicking,
    target: ActionTarget.Content,
    payload: {},
  };
}

export interface PickElementAction
  extends ActionBase<{
    pickedElement: ElementPickData;
    suggestions: SelectorSuggestion[];
  }> {
  type: ActionType.PickElement;
}

export function pickElementAction(
  elementPick: ElementPickData,
  suggestions: SelectorSuggestion[]
): PickElementAction {
  return {
    type: ActionType.PickElement,
    target: ActionTarget.Devtools,
    payload: {
      pickedElement: elementPick,
      suggestions,
    },
  };
}

export interface HighlightElementAction
  extends ActionBase<{
    suggestion?: SelectorSuggestion;
  }> {
  type: ActionType.HighlightElement;
}

export function highlightElementAction(
  suggestion?: SelectorSuggestion
): HighlightElementAction {
  return {
    type: ActionType.HighlightElement,
    target: ActionTarget.Content,
    payload: {
      suggestion,
    },
  };
}

export type Action =
  | ContentReadyAction
  | StartPickingAction
  | CancelPickingAction
  | PickElementAction
  | HighlightElementAction;

export type ActionHandler = (action: Action) => void;
