import { Question } from "survey-core";

export interface ITableOptions {
  [index: string]: any;

  /**
   * Specifies whether to use question names instead of question titles as column headings.
   *
   * Default value: `false`
   * @since 3.0.0
   */
  useNamesAsTitles?: boolean;
  /**
   * Specifies the delimiter used to separate multiple choice items in a list.
   *
   * Default value: `", "`
   * @since 3.0.0
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
   * @since 3.0.0
   */
  onGetQuestionValue?: (options: {
    question: Question,
    displayValue: any,
  }) => void;

  /**
   * Specifies the number of data items to load and display per page. Applies only if `paginationEnabled` is `true`.
   *
   * Default value: 10
   * @since 3.0.0
   * @see paginationEnabled
   */
  pageSize?: number;
  /**
   * Specifies whether the dataset is split into pages.
   *
   * Default value: `true`
   *
   * > Pagination cannot be disabled if the dataset is loaded from a server (that is, if the second parameter passed to the `Tabulator` constructor is a function).
   * @since 3.0.0
   * @see pageSize
   */
  paginationEnabled?: boolean;
  /**
   * Specifies whether to split responses to multi-select questions (Checkboxes and Multi-Select Dropdown) into separate columns.
   *
   * When enabled, each choice is represented as an individual column. Cell values indicate whether the choice was selected or the selection order, depending on the `multiSelectColumnValueFormat` setting. Empty cells indicate that the choice was not selected.
   *
   * Default value: `false`
   *
   * @since 3.0.0
   */
  splitMultiSelectIntoColumns?: boolean;
  /**
   * Specifies how selected values are represented in columns generated from multi-select questions. Applies only when `splitMultiSelectIntoColumns` is `true`.
   *
   * Accepted values:
   *
   * - `"checkmark"` &ndash; Displays a checkmark symbol for selected choices.
   * - `"selectionOrder"` &ndash; Displays the order in which choices were selected (1, 2, 3, ...).
   *
   * Default value: `"checkmark"`
   * @since 3.0.0
   */
  multiSelectColumnValueFormat?: "checkmark" | "selectionOrder";
  /**
   * Specifies whether to prepend the title of a select question to the titles of questions [nested within its choices](https://surveyjs.io/form-library/examples/nest-follow-up-questions-within-choice-options/).
   *
   * This property applies to nested questions defined in the `elements` property of Checkboxes, Radio Button Group, Dropdown, and Multi-Select Dropdown (Tag Box) choices.
   *
   * Default value: `true`
   * @since 3.0.3
   */
  showChoiceNestedQuestionParentTitle?: boolean;
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
