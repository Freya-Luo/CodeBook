import { ActionType } from '../action-types'
import { Action } from '../actions'
import { Cell } from '../cell'

interface CellState {
  loading: boolean
  error: string | null
  order: string[]
  orgs: {
    [id: string]: Cell
  }
}

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  orgs: {},
}

const reducer = (state: CellState = initialState, action: Action): CellState => {
  switch (action.type) {
    case ActionType.UPDATE_CELL:
    case ActionType.MOVE_CELL:
    case ActionType.DELETE_CELL:
    case ActionType.INSERT_CELL_BEFORE:
    default:
      return state
  }
}

export default reducer
