import { Question } from "survey-core";

export interface ITableOptions {
  [index: string]: any;

  /**
   * Specifies whether to use question names instead of question titles as column headings.
   *
   * Default value: `false`
   */
  useNamesAsTitles?: boolean;
  /**
   * Specifies the delimiter used to separate multiple choice items in a list.
   *
   * Default value: `", "`
   */
  itemsDelimiter?: string;
  /**
   * A callback function that allows you to customize a question's display value in the table.
   *
   * Parameters:
   *
   * - `options.question`: `Question`\
   * The question for which the callback is executed.
   * - `options.displayValue`: `any`\
   * The question's display value. You can modify this parameter to change the output.
   */
  onGetQuestionValue?: (options: {
    question: Question,
    displayValue: any,
  }) => void;

  /**
   * Specifies the number of data items to load and display per page. Applies only if `paginationEnabled` is `true`.
   *
   * Default value: 10
   * @see paginationEnabled
   */
  pageSize?: number;
  /**
   * Specifies whether the dataset is split into pages.
   *
   * Default value: `true`
   *
   * > Pagination cannot be disabled if the dataset is loaded from a server (that is, if the second parameter passed to the `Tabulator` constructor is a function).
   * @see pageSize
   */
  paginationEnabled?: boolean;
}

export interface ITable {
  useNamesAsTitles: boolean;
  itemsDelimiter: string;
  options: ITableOptions;
  isInitTableDataProcessing: boolean;
  lockStateChanged(): void;
  unlockStateChanged(): void;
  refresh(hard: boolean): void;
  getShowFilesAsImages(): boolean;
  isInitialized: boolean;
}