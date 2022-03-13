import { useTypedSelector } from './use-typed-selector';

// implicitly import React and ReactDOM
// downside: performance drag down
const predefinedFn = `
    import __React__ from 'react';
    import __ReactDOM__ from 'react-dom'

    var printf = val => {
      const root = document.querySelector('#root');
      if (typeof val === 'object') {
        root.innerHTML = JSON.stringify(val);
      } else {
        root.innerHTML = val;
      }
    }

    var render = val => {
      const root = document.querySelector('#root');
      if (val.$$typeof && val.props) {
        // if this is a JSXElement
        __ReactDOM__.render(val, root);
      }
    }
  `;

// overwrite the pre-defined functions
const predefinedFnVoid = `
    var printf = () => {}
    var render = () => {}
  `;

/**
 * This is a hook that collects all the code input in the code cells in front of (above)
 * the current code cell.
 * It also pre-defined the default printf() and render() in the code cell.
 *
 * @note - printf() prints the primitive values directly in the preview, and will prints
 * the stringify format of the reference values.
 * - render() implicitly imports the 'react' and 'react-dom' modules, so it will directly
 * renders any JSXElements.
 *
 * @param id the current code cell id
 * @return the raw aggregated input code string
 */
export const useAggregatedCode = (id: string) => {
  // fetch all the code cells before the current code cell
  return useTypedSelector((state) => {
    const { orgs, order } = state.cells;
    const orderedCells = order.map((id) => orgs[id]);

    let codeCells: string[] = [];
    for (const curCell of orderedCells) {
      if (curCell.cellType == 'CODE') {
        // the code cell is the current cell, show the printf()/render() result
        // to its correpsonding preview component
        if (curCell.id == id) {
          codeCells.push(predefinedFn);
          console.log(curCell.content, curCell.content === '');
          if (curCell.content === '') {
            codeCells = [predefinedFn];
          } else {
            codeCells.push(curCell.content);
          }
        } else {
          // the code cell is below the cell that calls the printf()/render()
          // avoid them also showing the result by overwriting these two functions
          codeCells.push(predefinedFnVoid, curCell.content);
        }
      }
      if (curCell.id == id) break;
    }
    return codeCells;
  }).join('\n');
};
