import { Vector as VectorData } from '@grafana/data';

export interface PanelOptions {
  threshold: number[];
  domain: number[];
}

export const defaults: PanelOptions = {
  threshold: [0, 300],
  domain: [0, 300],
};

export interface SingleElement {
  Source: string;
  [key: string]: any;
}
export interface Buffer extends VectorData {
  buffer: SingleElement[];
}
