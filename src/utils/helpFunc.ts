import { SingleElement } from '../types';

const is_empty_matrix = (matrix: number[][]) => {
  for (let idx_row = 0; idx_row < matrix.length; idx_row++) {
    for (let idx_col = 0; idx_col < matrix[idx_row].length; idx_col++) {
      if (matrix[idx_row][idx_col] > 0) return false;
    }
  }
  return true;
};

export const processData = (data: SingleElement[], threshold: number) => {
  if (data.length == 0) {
    return { matrix: null, keys: null };
  }

  const storesList = [...new Set(data.map(elm => elm.Source))];

  // const columnStoresLength = Object.keys(data[0]).length - 5;
  // if (storesList.length !== columnStoresLength) {
  //   return { matrix: null, keys: null };
  // }

  const indexStore: { [key: string]: number } = {};
  storesList.map(store => (indexStore[store] = storesList.indexOf(store)));

  const matrix: number[][] = [...Array(storesList.length)].map(e => Array(storesList.length).fill(0));

  data.map(elm => {
    const row = indexStore[elm.Source];
    storesList.map(store => {
      if (elm[store]) {
        matrix[row][indexStore[store]] += elm[store];
      }
    });
  });

  matrix.map((row, idx_row) => {
    row.map((col, idx_col) => {
      if (matrix[idx_row][idx_col] < threshold) {
        matrix[idx_row][idx_col] = 0;
      }
    });
  });

  const is_empty = is_empty_matrix(matrix);

  return { matrix, keys: storesList, is_empty };
};
