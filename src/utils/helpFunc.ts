import { SingleElement } from '../types';
export const processData = (data: SingleElement[]) => {
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
      if (elm[store] > 30) {
        matrix[row][indexStore[store]] += elm[store];
        matrix[indexStore[store]][row] += elm[store] - 1;
      }
      // matrix[row][indexStore[store]] += elm[store];
      // if (elm[store] > 0) {
      //   matrix[indexStore[store]][row] += elm[store] - 1;
      // }
    });
  });

  for (let i = 0; i < matrix.length; i++) {
    const max = Math.max(...matrix[i]);
    if (max == 0) {
      console.log('Turn ', i, 'max ', max);
      matrix.splice(i, 1);
      matrix.map((row, idx) => {
        matrix[idx].splice(i, 1);
      });
      storesList.splice(i, 1);
    }
    console.log('-Turn ', i, 'max ', max);
  }
  console.log('matrxxx ', matrix);
  console.log('stores ', storesList);

  return { matrix, keys: storesList };
};