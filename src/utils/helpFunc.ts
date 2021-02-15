import { SingleElement } from '../types';

const isNotransitions = (matrix: number[][]) => {
  if (matrix.length <= 1) return true;

  let noTransition = true;
  for (let i = 0; i < matrix.length; i++) {
    if (Math.max(...matrix[i]) > 0) {
      noTransition = false;
      break;
    }
  }
  return noTransition;
};

export const processData = (data: SingleElement[], threshold: number[]) => {
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

  let sum = 0;
  matrix.map(row => {
    const rowSum = row.reduce((total, num) => total + num, 0);
    sum += rowSum;
  });

  for (let irow = 0; irow < matrix.length; irow++) {
    for (let icol = 0; icol < matrix[irow].length; icol++) {
      matrix[irow][icol] = Math.round((matrix[irow][icol] / sum) * 100000) / 1000;
    }
  }

  const eliminateByRow: number[] = [];

  for (let idx_row = 0; idx_row < matrix.length; idx_row++) {
    if (Math.max(...matrix[idx_row]) < threshold[0]) {
      eliminateByRow.push(idx_row);
      continue;
    }

    if (Math.max(...matrix[idx_row]) > threshold[1]) {
      const clone_row = matrix[idx_row].slice(0);
      clone_row.sort((a, b) => b - a);
      let shouldRemove = true;
      for (let iter = 1; iter < clone_row.length; iter++) {
        if (clone_row[iter] >= threshold[0] && clone_row[iter] <= threshold[1]) {
          shouldRemove = false;
          clone_row.splice(iter);
          break;
        }
      }

      if (!shouldRemove) {
        clone_row.map(item => {
          const clear_idx = matrix[idx_row].indexOf(item);
          matrix[idx_row][clear_idx] = 0;
        });
      } else {
        eliminateByRow.push(idx_row);
      }
    }
  }

  eliminateByRow.sort((a, b) => b - a);
  eliminateByRow.map(elm => {
    storesList.splice(elm, 1);
    matrix.splice(elm, 1);
  });

  for (let row = 0; row < matrix.length; row++) {
    eliminateByRow.map(elm => {
      matrix[row].splice(elm, 1);
    });
  }

  // const is_empty = matrix.length <= 1;
  const is_empty = isNotransitions(matrix);

  // if (!is_empty) {
  //   let sum = 0;
  //   matrix.map(row => {
  //     const rowSum = row.reduce((total, num) => total + num, 0);
  //     sum += rowSum;
  //   });

  //   for (let irow = 0; irow < matrix.length; irow++) {
  //     for (let icol = 0; icol < matrix[irow].length; icol++) {
  //       matrix[irow][icol] /= sum;
  //     }
  //   }
  // }

  return { matrix, keys: storesList, is_empty };
};
