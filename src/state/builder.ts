/**
 * Interface that describes an individual builder associated with a cell.
 */
export default interface Builder {
  loading: boolean;
  code: string;
  err: string;
}
