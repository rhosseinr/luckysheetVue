# luckysheetVue

> LuckySheet Wrapper for vue 2

![](https://raw.githubusercontent.com/rhosseinr/luckysheetVue/master/screen.png)

## Features

- Open Form File
- Open From Url

## Tested in (desktop)

- Edge
- Chrome
- Firefox

## Installation

```
npm i luckysheetvue --save
```

## props

| Prop        | Type    | Description                 |
| ----------- | ------- | --------------------------- |
| url         | String  | Excel Url                   |
| file        | String  | Excel File                  |
| lang        | String  | set Ui Language             |
| showInfoBar | Boolean | Show/Hide Info Bar          |
| backUrl     | String  | Url Address For Back Button |

## Method

[LuckySheet Method Documents](https://dream-num.github.io/LuckysheetDocs/guide/api.html)

| Method Name                      | Description                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| downloadExcel                    | Download Excel File                                                                                |
| getCellValue                     | Get the value of the cell                                                                          |
| setCellValue                     | Set the value of a cell                                                                            |
| clearCell                        | Clear the contents of the specified cell of the specified worksheet                                |
| deleteCell                       | Delete the specified cell of the specified worksheet                                               |
| setCellFormat                    | Set the properties of a cell                                                                       |
| find                             | Find the specified content in a worksheet                                                          |
| replace                          | Find the specified content in a worksheet and replace it with new content                          |
| exitEditMode                     | Exit edit mode. After double-clicking the cell with the mouse, it will enter the cell editing mode |
| setHorizontalFrozen              | Freeze row operation                                                                               |
| setVerticalFrozen                | Freeze column operation                                                                            |
| setBothFrozen                    | Freeze rank operation                                                                              |
| cancelFrozen                     | Cancel freeze operation                                                                            |
| insertRow                        | Insert a blank line in the number line at the position of the row line                             |
| insertColumn                     | Insert a blank column in column number at the position of column column                            |
| deleteRow                        | Delete the specified row                                                                           |
| deleteColumn                     | Delete the specified column                                                                        |
| hideRow                          | Hide the specified row                                                                             |
| hideColumn                       | Hide the specified column                                                                          |
| showRow                          | Show the specified row                                                                             |
| showColumn                       | Show the specified column                                                                          |
| getRange                         | Returns an array of current selection objects, there may be multiple selections                    |
| getRangeWithFlatten              | Returns an array representing the positions of all cells in the specified area                     |
| getRangeValuesWithFlatte         | Returns an array of objects representing the contents of all cells in a specified range            |
| getRangeAxis                     | Returns an array of coordinate strings corresponding to the current selection                      |
| getRangeValue                    | Returns the data of a two-dimensional array of cells in the specified range of                     |
| getRangeJson                     | Copy the data in the specified cell area and return the data in json format                        |
| getRangeDiagonal                 | Copy the data in the specified cell area                                                           |
| getRangeBoolean                  | Copy the data in the specified cell area                                                           |
| setRangeShow                     | Specify selection areas to be selected and choose whether to highlight or not                      |
| setRangeValue                    | Assign a cell array data to the specified area                                                     |
| setRangeFormat                   | Set the cell format of the specified range, generally used as a processing format                  |
| setRangeMerge                    | Set the merged cells for the worksheet with the specified subscript and the selected range         |
| cancelRangeMerge                 | Unmerge cells in the selected range for the worksheet with the specified subscript                 |
| setRangeSort                     | For the worksheet of the specified subscript                                                       |
| setRangeSortMulti                | For the worksheet of the specified subscript                                                       |
| setRangeConditionalFormatDefault | Conditional format                                                                                 |
| setRangeConditionalFormat        | Conditional formatting rule                                                                        |
| deleteRangeConditionalFormat     | For the worksheet of the specified subscript                                                       |
| getAllSheets                     | Return all worksheet configurations                                                                |
| getLuckysheetfile                | Returns a one-dimensional array luckysheetfile of all table data structures                        |
| setSheetAdd                      | Add a sheet and return the newly added worksheet object                                            |
| setSheetMove                     | Specify the worksheet to move one position to the left or right, or specify subscript              |
| showGridLines                    | Show the grid lines of the specified subscript worksheet                                           |
| hideGridLines                    | Hide the grid lines of the specified subscript worksheet                                           |
| setWorkbookName                  | Set workbook name                                                                                  |
| getWorkbookName                  | get workbook name                                                                                  |
| refreshFormula                   | Force refresh formula                                                                              |
| refreshMenuButtonFocus           | Refreshes the top status bar status of the specified cell                                          |
| transToCellData                  | data => celldata, data two-dimensional array data is converted into a one-dimensional array        |
| toJson                           | The exported json string can be directly                                                           |

## Event

[LuckySheet Event Documents](https://dream-num.github.io/LuckysheetDocs/guide/config.html)

| Event Name                  | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| updated                     | The method executed after each operation is updated                             |
| cellEditBefore              | Triggered before entering the cell editing mode                                 |
| cellUpdateBefore            | Triggered before updating this cell value                                       |
| cellUpdated                 | Triggered after updating this cell                                              |
| cellRenderBefore            | Triggered before the cell is rendered                                           |
| cellRenderAfter             | Triggered after the cell rendering ends                                         |
| cellAllRenderBefore         | The method executed before all cells are rendered                               |
| rowTitleCellRenderBefore    | Triggered before the row header cell is rendered                                |
| rowTitleCellRenderAfter     | Triggered after the row header cell is rendered                                 |
| columnTitleCellRenderBefore | Triggered before the column header cell is rendered                             |
| columnTitleCellRenderAfter  | Triggered after the column header cell is rendered                              |
| rangeSelect                 | Frame selection or trigger after setting selection                              |
| rangeMoveBefore             | Before moving the selection                                                     |
| rangeMoveAfter              | After moving the selection                                                      |
| rangeEditBefore             | Before the selection is modified                                                |
| rangeEditAfter              | After the selection is modified                                                 |
| rangeCopyBefore             | Before copying selection                                                        |
| rangeCopyAfter              | After copying selection                                                         |
| rangePasteBefore            | Before pasting the selection                                                    |
| rangePasteAfter             | After pasting the selection                                                     |
| rangeCutBefore              | Before selection cut                                                            |
| rangeCutAfter               | After selection cut                                                             |
| rangeDeleteBefore           | Before the selection is deleted                                                 |
| rangeDeleteAfter            | After the selection is deleted                                                  |
| rangeClearBefore            | Before the selection is cleared                                                 |
| rangeClearAfter             | After the selection is cleared                                                  |
| rangePullBefore             | Before selection drop down                                                      |
| rangePullAfter              | After selection drop down                                                       |
| workbookCreateBefore        | Triggered before the worksheet is created                                       |
| workbookCreateAfter         | Triggered after the worksheet is created                                        |
| workbookDestroyBefore       | Triggered before the workbook is destroyed                                      |
| workbookDestroyAfter        | Triggered after the workbook is destroyed                                       |
| resized                     | After resize is executed                                                        |
| imageInsertBefore           | Before the picture is inserted                                                  |
| imageInsertAfter            | After the picture is inserted                                                   |
| imageUpdateBefore           | Before the picture is modified                                                  |
| imageUpdateAfter            | After the picture is modified                                                   |
| imageDeleteBefore           | Before the picture is deleted                                                   |
| imageDeleteAfter            | After the picture is deleted                                                    |
| commentInsertBefore         | Before inserting comments                                                       |
| commentInsertAfter          | After inserting comments                                                        |
| commentDeleteBefore         | Before deleting comments                                                        |
| commentDeleteAfter          | After deleting comments                                                         |
| commentUpdateBefore         | Before modifying comments                                                       |
| commentUpdateAfter          | After modifying comments                                                        |
| pivotTableEditBefore        | Before modifying the PivotTable, operations such as dragging fields, etc        |
| pivotTableEditAfter         | After modifying the PivotTable, operations such as dragging fields, etc         |
| frozenCreateBefore          | Before setting freeze                                                           |
| frozenCreateAfter           | After setting freeze                                                            |
| frozenCancelBefore          | Before unfreezing                                                               |
| frozenCancelAfter           | After unfreezing                                                                |
| onTogglePager               | Click the page button to call back the function, return the current page number |

## Usage

```js
import LuckySheet from "luckysheetVue";
```

```html
<lucky-sheet
  url=""
  show-info-bar
  backUrl="/"
  lang="en"
  @updated="onUpdateData"
/>
```

## More information

[LuckySheet Documents](https://dream-num.github.io/LuckysheetDocs)
