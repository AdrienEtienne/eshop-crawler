export interface MetaPagination {
  /**
   * Current page returned
   */
  current: number;
  /**
   * Number of items returned per page
   */
  items: number;
  /**
   * Total number of items
   */
  itemsTotal: number;
}

export interface SuccessBodyDto<T> {
  meta?: {
    pagination?: MetaPagination;
  };
  result: T;
}
