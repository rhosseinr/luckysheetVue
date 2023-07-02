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
  },

  data() {
    return {
      isMaskShow: false,
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

  watch: {
    url() {
      this.loadExcel(this.url, null);
    },
    file() {
      this.loadExcel(null, this.file);
    },
  },

  methods: {
    loadLuckySheet() {
      const self = this;
      const pluginJs = document.createElement("script");
      pluginJs.setAttribute("src", "js/plugin.js");
      pluginJs.async = false;
      document.head.appendChild(pluginJs);

      const luckysheetJs = document.createElement("script");
      luckysheetJs.setAttribute("src", "js/luckysheet.umd.js");
      luckysheetJs.async = false;
      document.head.appendChild(luckysheetJs);
      luckysheetJs.onload = function () {
        self.luckysheetCreate(true, {});
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
        this.isMaskShow = false;
        return;
      }

      if (file == null) {
        alert("No files wait for import");
        this.isMaskShow = false;
        return;
      }

      let name = file.name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != "xlsx") {
        alert("Currently only supports the import of xlsx files");
        this.isMaskShow = false;
        return;
      }
      LuckyExcel.transformExcelToLucky(file, this.processExcel);
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

    luckysheetCreate(isNew, exportJson) {
      const config = {
        container: "luckysheet",
        showinfobar: this.showInfoBar,
        title: "untitled",
        lang: this.lang,
        myFolderUrl: this.backUrl,
        updated: this.sheetUpdate,
      };

      if (isNew) {
        luckysheet.create(config);
      } else {
        isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy();
        config.title = exportJson.info.name;
        config.data = exportJson.sheets;
        config.userInfo = exportJson.info.name.creator;
        window.luckysheet.create(config);
      }
    },

    sheetUpdate(data) {
      this.$emit("update", data);
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
