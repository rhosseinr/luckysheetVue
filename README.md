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

| Prop                        | Type    | Description                                                                     |
| --------------------------- | ------- | ------------------------------------------------------------------------------- |
| url                         | String  | Excel Url                                                                       |
| file                        | String  | Excel File                                                                      |
| lang                        | String  | set Ui Language                                                                 |
| showInfoBar                 | Boolean | Show/Hide Info Bar                                                              |
| backUrl                     | String  | Url Address For Back Button                                                     |
| downloadExcel               | Method  | Download Excel File                                                             |
| updated                     | Event   | The method executed after each operation is updated                             |
| cellEditBefore              | Event   | Triggered before entering the cell editing mode                                 |
| cellUpdateBefore            | Event   | Triggered before updating this cell value                                       |
| cellUpdated                 | Event   | Triggered after updating this cell                                              |
| cellRenderBefore            | Event   | Triggered before the cell is rendered                                           |
| cellRenderAfter             | Event   | Triggered after the cell rendering ends                                         |
| cellAllRenderBefore         | Event   | The method executed before all cells are rendered                               |
| rowTitleCellRenderBefore    | Event   | Triggered before the row header cell is rendered                                |
| rowTitleCellRenderAfter     | Event   | Triggered after the row header cell is rendered                                 |
| columnTitleCellRenderBefore | Event   | Triggered before the column header cell is rendered                             |
| columnTitleCellRenderAfter  | Event   | Triggered after the column header cell is rendered                              |
| rangeSelect                 | Event   | Frame selection or trigger after setting selection                              |
| rangeMoveBefore             | Event   | Before moving the selection                                                     |
| rangeMoveAfter              | Event   | After moving the selection                                                      |
| rangeEditBefore             | Event   | Before the selection is modified                                                |
| rangeEditAfter              | Event   | After the selection is modified                                                 |
| rangeCopyBefore             | Event   | Before copying selection                                                        |
| rangeCopyAfter              | Event   | After copying selection                                                         |
| rangePasteBefore            | Event   | Before pasting the selection                                                    |
| rangePasteAfter             | Event   | After pasting the selection                                                     |
| rangeCutBefore              | Event   | Before selection cut                                                            |
| rangeCutAfter               | Event   | After selection cut                                                             |
| rangeDeleteBefore           | Event   | Before the selection is deleted                                                 |
| rangeDeleteAfter            | Event   | After the selection is deleted                                                  |
| rangeClearBefore            | Event   | Before the selection is cleared                                                 |
| rangeClearAfter             | Event   | After the selection is cleared                                                  |
| rangePullBefore             | Event   | Before selection drop down                                                      |
| rangePullAfter              | Event   | After selection drop down                                                       |
| workbookCreateBefore        | Event   | Triggered before the worksheet is created                                       |
| workbookCreateAfter         | Event   | Triggered after the worksheet is created                                        |
| workbookDestroyBefore       | Event   | Triggered before the workbook is destroyed                                      |
| workbookDestroyAfter        | Event   | Triggered after the workbook is destroyed                                       |
| resized                     | Event   | After resize is executed                                                        |
| imageInsertBefore           | Event   | Before the picture is inserted                                                  |
| imageInsertAfter            | Event   | After the picture is inserted                                                   |
| imageUpdateBefore           | Event   | Before the picture is modified                                                  |
| imageUpdateAfter            | Event   | After the picture is modified                                                   |
| imageDeleteBefore           | Event   | Before the picture is deleted                                                   |
| imageDeleteAfter            | Event   | After the picture is deleted                                                    |
| commentInsertBefore         | Event   | Before inserting comments                                                       |
| commentInsertAfter          | Event   | After inserting comments                                                        |
| commentDeleteBefore         | Event   | Before deleting comments                                                        |
| commentDeleteAfter          | Event   | After deleting comments                                                         |
| commentUpdateBefore         | Event   | Before modifying comments                                                       |
| commentUpdateAfter          | Event   | After modifying comments                                                        |
| pivotTableEditBefore        | Event   | Before modifying the PivotTable, operations such as dragging fields, etc        |
| pivotTableEditAfter         | Event   | After modifying the PivotTable, operations such as dragging fields, etc         |
| frozenCreateBefore          | Event   | Before setting freeze                                                           |
| frozenCreateAfter           | Event   | After setting freeze                                                            |
| frozenCancelBefore          | Event   | Before unfreezing                                                               |
| frozenCancelAfter           | Event   | After unfreezing                                                                |
| onTogglePager               | Event   | Click the page button to call back the function, return the current page number |

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
