export type CellType = 'CODE' | 'MARKDOWN'
/**
 * Interface that describes an individual cell, either a code cell or a markdown cell.
 */
export interface Cell {
  id: string
  cellType: CellType
  content: string
}
