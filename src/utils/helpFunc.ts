import { SingleElement } from '../types';

// const is_empty_matrix = (matrix: number[][]) => {
//   for (let idx_row = 0; idx_row < matrix.length; idx_row++) {
//     for (let idx_col = 0; idx_col < matrix[idx_row].length; idx_col++) {
//       if (matrix[idx_row][idx_col] > 0) return false;
//     }
//   }
//   return true;
// };

export const processData = (data: SingleElement[], threshold: number) => {
  if (data.length == 0) {
    return { matrix: null, keys: null };
  }

  const storesList = [...new Set(data.map(elm => elm.Source))];

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

  const eliminateByRow: number[] = [];
  const nonEliminateByColObj: { [key: number]: boolean } = {};

  for (let idx_row = 0; idx_row < matrix.length; idx_row++) {
    if (Math.max(...matrix[idx_row]) <= threshold) {
      eliminateByRow.push(idx_row);
      continue;
    }
    for (let idx_col = 0; idx_col < matrix[idx_row].length; idx_col++) {
      if (matrix[idx_row][idx_col] > threshold && !nonEliminateByColObj[idx_col]) {
        nonEliminateByColObj[idx_col] = true;
      }
    }
  }

  const nonELiminateArray = Object.keys(nonEliminateByColObj).map(Number);
  const eliminateArray = eliminateByRow.filter(value => !nonELiminateArray.includes(value));
  eliminateArray.sort((a, b) => b - a);
  eliminateArray.map(elm => {
    storesList.splice(elm, 1);
    matrix.splice(elm, 1);
  });

  for (let row = 0; row < matrix.length; row++) {
    eliminateArray.map(elm => {
      matrix[row].splice(elm, 1);
    });
  }

  const is_empty = matrix.length == 0;

  return { matrix, keys: storesList, is_empty };
};
