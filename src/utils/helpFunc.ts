import { SingleElement } from '../types';
export const processData = (data: SingleElement[], threshold: number) => {
  if (data.length == 0) {
    return { matrix: null, keys: null };
  }

  const storesList = [...new Set(data.map(elm => elm.Source))];

  const columnStoresLength = Object.keys(data[0]).length - 5;
  if (storesList.length !== columnStoresLength) {
    return { matrix: null, keys: null };
  }

  const indexStore: { [key: string]: number } = {};
  storesList.map(store => (indexStore[store] = storesList.indexOf(store)));

  const matrix = [...Array(storesList.length)].map(e => Array(storesList.length).fill(0));

  data.map(elm => {
    const row = indexStore[elm.Source];
    storesList.map(store => {
      if (elm[store] > threshold) {
        matrix[row][indexStore[store]] += elm[store];
      }
    });
  });

  return { matrix, keys: storesList };
};
