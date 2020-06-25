import { Vector as VectorData } from '@grafana/data';

export interface PanelOptions {}

export const defaults: PanelOptions = {};

export interface SingleElement {
  Source: string;
  [key: string]: any;
}
export interface Buffer extends VectorData {
  buffer: SingleElement[];
}
