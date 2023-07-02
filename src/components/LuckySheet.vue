<template>
  <div class="lucky-sheet-wrapper">
    <div id="luckysheet" />
    <div v-show="isMaskShow" id="tip">Downloading</div>
  </div>
</template>

<script>
import { exportExcel } from "../utils/export";
import { isFunction } from "../utils/is";
import LuckyExcel from "luckyexcel";
import "../assets/pluginsCss.css";
import "../assets/plugins.css";
import "../assets/luckysheet.css";
import "../assets/iconfont.css";

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
      isMaskShow: false,
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

  created() {
    this.loadLuckySheet();
  },

  mounted() {
    if (this.url) {
      this.loadExcel(this.url, null);
    } else if (this.file) {
      this.loadExcel(null, this.file);
    }
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
    createScript(src) {
      const script = document.createElement("script");
      script.setAttribute("src", src);
      script.async = false;
      document.head.appendChild(script);
      return script;
    },

    loadLuckySheet() {
      const pluginJs = this.createScript("js/plugin.js");
      const luckysheetJs = this.createScript("js/luckysheet.umd.js");
      luckysheetJs.onload = () => {
        this.luckysheetCreate(true, {});
      };
    },

    loadExcel(url, file) {
      this.isMaskShow = true;

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

      this.isMaskShow = false;
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
      exportExcel(luckysheet.getAllSheets(), "excel");
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
      const config = this.createConfig(isNew, exportJson);

      if (!isNew) {
        isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy();
      }

      window.luckysheet.create(config);
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
  },
};
</script>

<style scoped>
.lucky-sheet-wrapper,
#luckysheet {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
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
