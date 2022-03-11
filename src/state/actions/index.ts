import { ActionType } from '../action-types'
import { CellType } from '../cell'

interface UpdateCellAction {
  type: ActionType.UPDATE_CELL
  payload: {
    id: string
    content: string
  }
}

interface MoveCellAction {
  type: ActionType.MOVE_CELL
  payload: {
    id: string
    direction: 'UP' | 'DOWN'
  }
}

interface DeleteCellAction {
  type: ActionType.DELETE_CELL
  payload: string // cell id
}

interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE
  payload: {
    id: string // 'to' cell id
    cellType: CellType // 'to' cell type
  }
}

export type Action = UpdateCellAction | MoveCellAction | DeleteCellAction | InsertCellBeforeAction
