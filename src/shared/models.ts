export interface ElementDataAttributes {
  [key: string]: string
}

export interface ElementData {
  name: string
  attributes: ElementDataAttributes
}

export interface ElementPickData {
  pickRef: number
  element: ElementData
  composedPath: ElementData[]
}

export interface PartHierarchyItem {
  element: ElementData
  partNames: string[]
}