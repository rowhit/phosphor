/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2017, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
import {
  ISignal, Signal
} from '@phosphor/signaling';


/**
 * The abstract data model class for a data grid.
 *
 * #### Notes
 * If the predefined data models are insufficient for a particular use
 * case, a custom model can be defined which derives from this class.
 */
export
abstract class DataModel {
  /**
   * A signal emitted when the data model has changed.
   */
  get changed(): ISignal<this, DataModel.ChangedArgs> {
    return this._changed;
  }

  /**
   * The number of data rows in the data model.
   *
   * #### Notes
   * This property is accessed often, and so should be efficient.
   */
  abstract readonly rowCount: number;

  /**
   * The number of data columns in the data model.
   *
   * #### Notes
   * This property is accessed often, and so should be efficient.
   */
  abstract readonly colCount: number;

  /**
   * The number of row header columns in the data model.
   *
   * #### Notes
   * This property is accessed often, and so should be efficient.
   */
  abstract readonly rowHeaderCount: number;

  /**
   * The number of colum header rows in the data model.
   *
   * #### Notes
   * This property is accessed often, and so should be efficient.
   */
  abstract readonly colHeaderCount: number;

  /**
   * Get the data for a particular cell in the data model.
   *
   * @param row - The row index of the cell of interest.
   *
   * @param col - The column index of the cell of interest.
   *
   * @param returns - The data for the specified cell, or `null`
   *   if the cell is empty.
   *
   * #### Notes
   * A negative `row` index indicates a column header row.
   *
   * A negative `col` index indicates a row header column.
   *
   * This method is called often, and so should be efficient.
   */
  abstract data(row: number, col: number): DataModel.ICellData | null;

  /**
   * Emit the `changed` signal for the data model.
   *
   * #### Notes
   * Subclass should call this method whenever the data model has
   * changed so that attached data grids can update themselves.
   */
  protected emitChanged(args: DataModel.ChangedArgs): void {
    this._changed.emit(args);
  }

  private _changed = new Signal<this, DataModel.ChangedArgs>(this);
}


/**
 * The namespace for the `DataModel` class statics.
 */
export
namespace DataModel {
  /**
   * An object which represents the data for a particular cell.
   */
  export
  interface ICellData {
    /**
     * The descriptive type of the data value.
     *
     * #### Notes
     * This is used by a data grid to select a renderer which knows how
     * to render the cell data `value`.
     *
     * The `type` can be any string, but should be descriptive of the
     * actual type of the data value.
     */
    readonly type: string;

    /**
     * The data value for the cell.
     *
     * #### Notes
     * This may be any value, including complex object types.
     *
     * The `type` parameter of the cell data is used by a data grid to
     * select a cell renderer which knows how to render the data value.
     */
    readonly value: any;
  }

  /**
   * An arguments object for the `changed` signal.
   *
   * #### Notes
   * Data models should emit the `changed` signal with this args object
   * type when new rows or columns are inserted.
   */
  export
  interface ISectionsInsertedArgs {
    /**
     * The discriminated type of the args object.
     */
    readonly type: 'rows-inserted' | 'cols-inserted';

    /**
     * The index of the first inserted row or column.
     */
    readonly index: number;

    /**
     * The number of inserted rows or columns.
     */
    readonly span: number;
  }

  /**
   * An arguments object for the `changed` signal.
   *
   * #### Notes
   * Data models should emit the `changed` signal with this args object
   * type when existing rows or columns are removed.
   */
  export
  interface ISectionsRemovedArgs {
    /**
     * The discriminated type of the args object.
     */
    readonly type: 'rows-removed' | 'cols-removed';

    /**
     * The index of the first removed row or column.
     */
    readonly index: number;

    /**
     * The number of removed rows or columns.
     */
    readonly span: number;
  }

  /**
   * An arguments object for the `changed` signal.
   *
   * #### Notes
   * Data models should emit the `changed` signal with this args object
   * type when existing rows or columns are moved.
   */
  export
  interface ISectionsMovedArgs {
    /**
     * The discriminated type of the args object.
     */
    readonly type: 'rows-moved' | 'cols-moved';

    /**
     * The starting index of the first moved row or column.
     */
    readonly fromIndex: number;

    /**
     * The ending index of the first moved row or column.
     */
    readonly toIndex: number;

    /**
     * The number of moved rows or columns.
     */
    readonly span: number;
  }

  /**
   * An arguments object for the `changed` signal.
   *
   * #### Notes
   * Data models should emit the `changed` signal with this args object
   * type when existing cells are changed in-place.
   */
  export
  interface ICellsChangedArgs {
    /**
     * The discriminated type of the args object.
     */
    readonly type: 'cells-changed';

    /**
     * The row index of the first changed cell.
     */
    readonly rowIndex: number;

    /**
     * The column index of the first changed cell.
     */
    readonly colIndex: number;

    /**
     * The number of rows in the changed cell range.
     */
    readonly rowSpan: number;

    /**
     * The number of columns in the changed cell range.
     */
    readonly colSpan: number;
  }

  /**
   * An arguments object for the `changed` signal.
   *
   * #### Notes
   * Data models should emit the `changed` signal with this args object
   * type when the model has changed in a fashion that cannot be easily
   * expressed by the other args object types.
   *
   * This will cause any listening data grid to perform a full refresh,
   * so the other changed args types should be used when possible.
   */
  export
  interface IModelChangedArgs {
    /**
     * The discriminated type of the args object.
     */
    readonly type: 'model-changed';
  }

  /**
   * A type alias for the args objects of the `changed` signal.
   */
  export
  type ChangedArgs = (
    ISectionsInsertedArgs |
    ISectionsRemovedArgs |
    ISectionsMovedArgs |
    ICellsChangedArgs |
    IModelChangedArgs
  );
}
