import { Vector as VectorData } from '@grafana/data';

export interface PanelOptions {
  threshold: number;
}

export const defaults: PanelOptions = {
  threshold: 0,
};

export interface SingleElement {
  Source: string;
  [key: string]: any;
}
export interface Buffer extends VectorData {
  buffer: SingleElement[];
}
