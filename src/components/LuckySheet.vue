<template>
  <div class="lucky-sheet-wrapper">
    <iframe
      class="lucky-sheet-iframe"
      ref="iframe"
      srcdoc="<html>
                <head>
                  <script src='../../node_modules/lucky-sheet-pkg/dist/plugins/js/plugin.js'></script>
                  <script src='../../node_modules/lucky-sheet-pkg/dist/luckysheet.umd.js'></script>
                  <link rel='stylesheet' href='../../node_modules/lucky-sheet-pkg/dist/plugins/css/pluginsCss.css' />
                  <link rel='stylesheet' href='../../node_modules/lucky-sheet-pkg/dist/plugins/plugins.css' />
                  <link rel='stylesheet' href='../../node_modules/lucky-sheet-pkg/dist/css/luckysheet.css' />
                  <link rel='stylesheet' href='../../node_modules/lucky-sheet-pkg/dist/assets/iconfont/iconfont.css' />
                </head>
                <body>
                  <style>
                  html,
body,
#luckysheet {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
                  </style>
                  <div id='luckysheet'></div>
                </body>
              </html>"
      @load="iframeLoad"
    >
    </iframe>
    <div v-show="isLoading" id="tip">Downloading</div>
  </div>
</template>

<script>
import { exportExcel } from "../utils/export";
import { isFunction } from "../utils/is";
import LuckyExcel from "luckyexcel";

export default {
  name: "LuckySheet",

  props: {
    url: { type: String, default: null },
    file: { type: File, default: null },
    lang: { type: String, default: "en" },
    backUrl: { type: String, default: "/" },
    showInfoBar: { type: Boolean, default: false },
    enableAddBackTop: { type: Boolean, default: false },
    defaultFontSize: { type: Number, default: 12 },
  },

  data() {
    return {
      isLoading: false,
      iframeWin: null,
      hook: {
        updated: this.sheetUpdate,
        cellUpdated: this.cellUpdate,
        cellEditBefore: this.cellEditBefore,
        cellUpdateBefore: this.cellUpdateBefore,
        cellRenderBefore: this.cellRenderBefore,
        cellRenderAfter: this.cellRenderAfter,
        cellAllRenderBefore: this.cellAllRenderBefore,
        rowTitleCellRenderBefore: this.rowTitleCellRenderBefore,
        rowTitleCellRenderAfter: this.rowTitleCellRenderAfter,
        columnTitleCellRenderBefore: this.columnTitleCellRenderBefore,
        columnTitleCellRenderAfter: this.columnTitleCellRenderAfter,
        rangeSelect: this.rangeSelect,
        rangeMoveBefore: this.rangeMoveBefore,
        rangeMoveAfter: this.rangeMoveAfter,
        rangeEditBefore: this.rangeEditBefore,
        rangeEditAfter: this.rangeEditAfter,
        rangeCopyBefore: this.rangeCopyBefore,
        rangeCopyAfter: this.rangeCopyAfter,
        rangePasteBefore: this.rangePasteBefore,
        rangePasteAfter: this.rangePasteAfter,
        rangeCutBefore: this.rangeCutBefore,
        rangeCutAfter: this.rangeCutAfter,
        rangeDeleteBefore: this.rangeDeleteBefore,
        rangeDeleteAfter: this.rangeDeleteAfter,
        rangeClearBefore: this.rangeClearBefore,
        rangeClearAfter: this.rangeClearAfter,
        rangePullBefore: this.rangePullBefore,
        rangePullAfter: this.rangePullAfter,
        workbookCreateBefore: this.workbookCreateBefore,
        workbookCreateAfter: this.workbookCreateAfter,
        workbookDestroyBefore: this.workbookDestroyBefore,
        workbookDestroyAfter: this.workbookDestroyAfter,
        resized: this.resized,
        imageInsertBefore: this.imageInsertBefore,
        imageInsertAfter: this.imageInsertAfter,
        imageUpdateBefore: this.imageUpdateBefore,
        imageUpdateAfter: this.imageUpdateAfter,
        imageDeleteBefore: this.imageDeleteBefore,
        imageDeleteAfter: this.imageDeleteAfter,
        commentInsertBefore: this.commentInsertBefore,
        commentInsertAfter: this.commentInsertAfter,
        commentDeleteBefore: this.commentDeleteBefore,
        commentDeleteAfter: this.commentDeleteAfter,
        commentUpdateBefore: this.commentUpdateBefore,
        commentUpdateAfter: this.commentUpdateAfter,
        pivotTableEditBefore: this.pivotTableEditBefore,
        pivotTableEditAfter: this.pivotTableEditAfter,
        frozenCreateBefore: this.frozenCreateBefore,
        frozenCreateAfter: this.frozenCreateAfter,
        frozenCancelBefore: this.frozenCancelBefore,
        frozenCancelAfter: this.frozenCancelAfter,
      },
    };
  },

  mounted() {
    this.iframeWin = window.frames[0];
  },

  computed: {
    registeredEvents() {
      return this._events;
    },

    computedHook() {
      let registered = {};
      for (const key in this.hook) {
        if (key in this.registeredEvents) {
          registered[key] = this.hook[key];
        }
      }
      return registered;
    },
  },

  watch: {
    url() {
      this.loadExcel(this.url, null);
    },
    file() {
      this.loadExcel(null, this.file);
    },
  },

  methods: {
    iframeLoad(event) {
      this.isLoading = false;
      this.luckysheetCreate(true, {});
    },

    loadExcel(url, file) {
      this.isLoading = true;

      if (url) {
        LuckyExcel.transformExcelToLuckyByUrl(
          url,
          "loaded Excel",
          this.processExcel
        );
      } else if (file && file.name.split(".").pop() === "xlsx") {
        LuckyExcel.transformExcelToLucky(file, this.processExcel);
      } else {
        let msg = file
          ? "Currently only supports the import of xlsx files"
          : "No files wait for import";
        alert(msg);
      }

      this.isLoading = false;
    },

    processExcel(exportJson, luckysheetfile) {
      if (exportJson.sheets == null || exportJson.sheets.length == 0) {
        alert(
          "Failed to read the content of the excel file, currently does not support xls files!"
        );
        return;
      }

      this.luckysheetCreate(false, exportJson);
    },

    downloadExcel() {
      exportExcel(this.iframeWin.luckysheet.getAllSheets(), "excel");
    },

    createConfig(isNew, exportJson) {
      const config = {
        container: "luckysheet",
        showinfobar: this.showInfoBar,
        title: isNew ? "untitled" : exportJson.info.name,
        lang: this.lang,
        myFolderUrl: this.backUrl,
        enableAddBackTop: this.enableAddBackTop,
        defaultFontSize: this.defaultFontSize,
        hook: this.computedHook,
      };
      if (!isNew) {
        config.data = exportJson.sheets;
        config.userInfo = exportJson.info.name.creator;
      }
      return config;
    },

    luckysheetCreate(isNew, exportJson) {
      if (this.iframeWin?.luckysheet) {
        console.log("lucky-sheet ready");
        const config = this.createConfig(isNew, exportJson);
        if (!isNew) {
          isFunction(this.iframeWin?.luckysheet?.destroy) &&
            this.iframeWin.luckysheet.destroy();
        }

        this.iframeWin.luckysheet.create(config);
      } else {
        console.log("lucky-sheet not ready");
        const self = this;
        setTimeout(function () {
          self.luckysheetCreate(true, {});
        }, 1000);
      }
    },

    sheetUpdate(operate) {
      this.$emit("updated", operate);
    },

    cellUpdateBefore(r, c, oldValue, newValue, isRefresh) {
      this.$emit("cellUpdateBefore", { r, c, oldValue, newValue, isRefresh });
    },

    cellUpdate(r, c, oldValue, newValue, isRefresh) {
      this.$emit("cellUpdate", { r, c, oldValue, newValue, isRefresh });
    },

    cellRenderBefore(cell, position, sheet, ctx) {
      this.$emit("cellRenderBefore", { cell, position, sheet, ctx });
    },

    cellRenderAfter(cell, position, sheet, ctx) {
      this.$emit("cellRenderAfter", { cell, position, sheet, ctx });
    },

    cellAllRenderBefore(data, sheet, ctx) {
      this.$emit("cellAllRenderBefore", { data, sheet, ctx });
    },

    rowTitleCellRenderBefore(rowNum, position, ctx) {
      this.$emit("rowTitleCellRenderBefore", { rowNum, position, ctx });
    },

    rowTitleCellRenderAfter(rowNum, position, ctx) {
      this.$emit("rowTitleCellRenderAfter", { rowNum, position, ctx });
    },

    columnTitleCellRenderBefore(columnAbc, position, ctx) {
      this.$emit("columnTitleCellRenderBefore", { columnAbc, position, ctx });
    },

    columnTitleCellRenderAfter(columnAbc, position, ctx) {
      this.$emit("columnTitleCellRenderAfter", { columnAbc, position, ctx });
    },

    rangeSelect(sheet, range) {
      this.$emit("rangeSelect", { sheet, range });
    },

    rangeMoveBefore(range) {
      this.$emit("rangeMoveBefore", range);
    },

    rangeMoveAfter(oldRange, newRange) {
      this.$emit("rangeMoveAfter", { oldRange, newRange });
    },

    rangeEditBefore(range, data) {
      this.$emit("rangeEditBefore", { range, data });
    },

    rangeEditAfter(range, oldData, newData) {
      this.$emit("rangeEditAfter", { range, oldData, newData });
    },

    rangeCopyBefore(range, data) {
      this.$emit("rangeCopyBefore", { range, data });
    },

    rangeCopyAfter(range, data) {
      this.$emit("rangeCopyAfter", { range, data });
    },

    rangePasteBefore(range, data) {
      this.$emit("rangePasteBefore", { range, data });
    },

    rangePasteAfter(range, originData, pasteData) {
      this.$emit("rangePasteAfter", { range, originData, pasteData });
    },

    rangeCutBefore(range, data) {
      this.$emit("rangeCutBefore", { range, data });
    },

    rangeCutAfter(range, data) {
      this.$emit("rangeCutAfter", { range, data });
    },

    rangeDeleteBefore(range, data) {
      this.$emit("rangeDeleteBefore", { range, data });
    },

    rangeDeleteAfter(range, data) {
      this.$emit("rangeDeleteAfter", { range, data });
    },

    rangeClearBefore(range, data) {
      this.$emit("rangeClearBefore", { range, data });
    },

    rangeClearAfter(range, data) {
      this.$emit("rangeClearAfter", { range, data });
    },

    rangePullBefore(range) {
      this.$emit("rangePullBefore", range);
    },

    rangePullAfter(range) {
      this.$emit("rangePullAfter", range);
    },

    cellEditBefore(data) {
      this.$emit("cellEditBefore", data);
    },

    workbookCreateBefore(book) {
      this.$emit("workbookCreateBefore", book);
    },

    workbookCreateAfter(book) {
      this.$emit("workbookCreateAfter", book);
    },

    workbookDestroyBefore(book) {
      this.$emit("workbookDestroyBefore", book);
    },

    workbookDestroyAfter(book) {
      this.$emit("workbookDestroyAfter", book);
    },

    resized(size) {
      this.$emit("resized", size);
    },

    imageInsertBefore(url) {
      this.$emit("imageInsertBefore", url);
    },

    imageInsertAfter(url) {
      this.$emit("imageInsertAfter", url);
    },

    imageUpdateBefore(item) {
      this.$emit("imageUpdateBefore", item);
    },

    imageUpdateAfter(oldItem, newItem) {
      this.$emit("imageUpdateAfter", { oldItem, newItem });
    },

    imageDeleteBefore(item) {
      this.$emit("imageDeleteBefore", item);
    },

    imageDeleteAfter(item) {
      this.$emit("imageDeleteAfter", item);
    },

    commentInsertBefore(cell) {
      this.$emit("commentInsertBefore", cell);
    },

    commentInsertAfter(cell) {
      this.$emit("commentInsertAfter", cell);
    },

    commentDeleteBefore(cell) {
      this.$emit("commentDeleteBefore", cell);
    },

    commentDeleteAfter(cell) {
      this.$emit("commentDeleteAfter", cell);
    },

    commentUpdateBefore(cell) {
      this.$emit("commentUpdateBefore", cell);
    },

    commentUpdateAfter(cell) {
      this.$emit("commentUpdateAfter", cell);
    },

    pivotTableEditBefore(sheet) {
      this.$emit("pivotTableEditBefore", sheet);
    },

    pivotTableEditAfter(oldSheet, newSheet) {
      this.$emit("pivotTableEditAfter", { oldSheet, newSheet });
    },

    frozenCreateBefore(frozen) {
      this.$emit("frozenCreateBefore", frozen);
    },

    frozenCreateAfter(frozen) {
      this.$emit("frozenCreateAfter", frozen);
    },

    frozenCancelBefore(frozen) {
      this.$emit("frozenCancelBefore", frozen);
    },

    frozenCancelAfter(frozen) {
      this.$emit("frozenCancelAfter", frozen);
    },

    onTogglePager(page) {
      this.$emit("onTogglePager", page);
    },

    getCellValue(row, column, setting) {
      return this.iframeWin.luckysheet.getCellValue(row, column, setting);
    },

    setCellValue(row, column, value, setting) {
      this.iframeWin.luckysheet.setCellValue(row, column, value, setting);
    },

    clearCell(row, column, setting) {
      this.iframeWin.luckysheet.clearCell(row, column, setting);
    },

    deleteCell(move, row, column, setting) {
      this.iframeWin.luckysheet.deleteCell(move, row, column, setting);
    },

    setCellFormat(row, column, attr, value, setting) {
      this.iframeWin.luckysheet.setCellFormat(
        row,
        column,
        attr,
        value,
        setting
      );
    },

    find(content, setting) {
      return this.iframeWin.luckysheet.find(content, setting);
    },

    replace(content, replaceContent, setting) {
      return this.iframeWin.luckysheet.replace(
        content,
        replaceContent,
        setting
      );
    },

    exitEditMode(setting) {
      return this.iframeWin.luckysheet.exitEditMode(setting);
    },

    setHorizontalFrozen(isRange, setting) {
      return this.iframeWin.luckysheet.setHorizontalFrozen(isRange, setting);
    },

    setVerticalFrozen(isRange, setting) {
      return this.iframeWin.luckysheet.setVerticalFrozen(isRange, setting);
    },

    setBothFrozen(isRange, setting) {
      return this.iframeWin.luckysheet.setBothFrozen(isRange, setting);
    },

    cancelFrozen(setting) {
      return this.iframeWin.luckysheet.cancelFrozen(setting);
    },

    insertRow(row, setting) {
      return this.iframeWin.luckysheet.insertRow(row, setting);
    },

    insertColumn(column, setting) {
      return this.iframeWin.luckysheet.insertColumn(column, setting);
    },

    deleteRow(rowStart, rowEnd, setting) {
      return this.iframeWin.luckysheet.deleteRow(rowStart, rowEnd, setting);
    },

    hideRow(rowStart, rowEnd, setting) {
      return this.iframeWin.luckysheet.hideRow(rowStart, rowEnd, setting);
    },

    showRow(rowStart, rowEnd, setting) {
      return this.iframeWin.luckysheet.showRow(rowStart, rowEnd, setting);
    },

    deleteColumn(columnStart, columnEnd, setting) {
      return this.iframeWin.luckysheet.deleteColumn(
        columnStart,
        columnEnd,
        setting
      );
    },

    setRowHeight(rowInfo, setting) {
      return this.iframeWin.luckysheet.setRowHeight(rowInfo, setting);
    },

    getRowHeight(rowInfo, setting) {
      return this.iframeWin.luckysheet.getRowHeight(rowInfo, setting);
    },

    setColumnWidth(columnInfo, setting) {
      return this.iframeWin.luckysheet.setColumnWidth(columnInfo, setting);
    },

    getColumnWidth(columnInfo, setting) {
      return this.iframeWin.luckysheet.getColumnWidth(columnInfo, setting);
    },

    getDefaultRowHeight(setting) {
      return this.iframeWin.luckysheet.getDefaultRowHeight(setting);
    },

    getDefaultColWidth(setting) {
      return this.iframeWin.luckysheet.getDefaultColWidth(setting);
    },

    getRange() {
      return this.iframeWin.luckysheet.getRange();
    },

    getRangeWithFlatten() {
      return this.iframeWin.luckysheet.getRangeWithFlatten();
    },

    getRangeValuesWithFlatte() {
      return this.iframeWin.luckysheet.getRangeValuesWithFlatte();
    },

    getRangeAxis() {
      return this.iframeWin.luckysheet.getRangeAxis();
    },

    getRangeValue(setting) {
      return this.iframeWin.luckysheet.getRangeValue(setting);
    },

    getRangeHtml(setting) {
      return this.iframeWin.luckysheet.getRangeHtml(setting);
    },

    getRangeJson(title, setting) {
      return this.iframeWin.luckysheet.getRangeJson(title, setting);
    },

    getRangeArray(dimensional, setting) {
      return this.iframeWin.luckysheet.getRangeArray(dimensional, setting);
    },

    getRangeDiagonal(type, setting) {
      return this.iframeWin.luckysheet.getRangeDiagonal(type, setting);
    },

    getRangeBoolean(setting) {
      return this.iframeWin.luckysheet.getRangeBoolean(setting);
    },

    setRangeShow(range, setting) {
      return this.iframeWin.luckysheet.setRangeShow(range, setting);
    },

    setRangeValue(data, setting) {
      return this.iframeWin.luckysheet.setRangeValue(data, setting);
    },

    setRangeFormat(attr, value, setting) {
      return this.iframeWin.luckysheet.setRangeFormat(attr, value, setting);
    },

    setRangeFilter(type, setting) {
      return this.iframeWin.luckysheet.setRangeFilter(type, setting);
    },

    setRangeMerge(type, setting) {
      return this.iframeWin.luckysheet.setRangeMerge(type, setting);
    },

    cancelRangeMerge(setting) {
      return this.iframeWin.luckysheet.cancelRangeMerge(setting);
    },

    setRangeSort(type, setting) {
      return this.iframeWin.luckysheet.setRangeSort(type, setting);
    },

    setRangeSortMulti(title, sort, setting) {
      return this.iframeWin.luckysheet.setRangeSortMulti(title, sort, setting);
    },

    setRangeConditionalFormatDefault(conditionName, conditionValue, setting) {
      return this.iframeWin.luckysheet.setRangeConditionalFormatDefault(
        conditionName,
        conditionValue,
        setting
      );
    },

    setRangeConditionalFormat(type, setting) {
      return this.iframeWin.luckysheet.setRangeConditionalFormat(type, setting);
    },

    deleteRangeConditionalFormat(itemIndex, setting) {
      return this.iframeWin.luckysheet.deleteRangeConditionalFormat(
        itemIndex,
        setting
      );
    },

    clearRange(setting) {
      return this.iframeWin.luckysheet.clearRange(setting);
    },

    deleteRange(move, setting) {
      return this.iframeWin.luckysheet.deleteRange(move, setting);
    },

    insertRange(move, setting) {
      return this.iframeWin.luckysheet.insertRange(move, setting);
    },

    matrixOperation(type, setting) {
      return this.iframeWin.luckysheet.matrixOperation(type, setting);
    },

    matrixCalculation(type, number, setting) {
      return this.iframeWin.luckysheet.matrixCalculation(type, number, setting);
    },

    getAllSheets() {
      return this.iframeWin.luckysheet.getAllSheets();
    },

    getLuckysheetfile() {
      return this.iframeWin.luckysheet.getLuckysheetfile();
    },

    setSheetAdd(setting) {
      return this.iframeWin.luckysheet.setSheetAdd(setting);
    },

    setSheetMove(type, setting) {
      return this.iframeWin.luckysheet.setSheetMove(type, setting);
    },

    showGridLines(setting) {
      return this.iframeWin.luckysheet.showGridLines(setting);
    },

    hideGridLines(setting) {
      return this.iframeWin.luckysheet.hideGridLines(setting);
    },

    setWorkbookName(name, setting) {
      return this.iframeWin.luckysheet.setWorkbookName(name, setting);
    },

    getWorkbookName(name, setting) {
      return this.iframeWin.luckysheet.getWorkbookName(name, setting);
    },

    refreshFormula(setting) {
      return this.iframeWin.luckysheet.refreshFormula(setting);
    },

    refreshMenuButtonFocus(data, r, c, success) {
      return this.iframeWin.luckysheet.refreshMenuButtonFocus(
        data,
        r,
        c,
        success
      );
    },

    transToCellData(data, setting) {
      return this.iframeWin.luckysheet.transToCellData(data, setting);
    },

    toJson() {
      return this.iframeWin.luckysheet.toJson();
    },
  },
};
</script>

<style scoped>
.lucky-sheet-iframe,
.lucky-sheet-wrapper {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 0;
}
</style>
