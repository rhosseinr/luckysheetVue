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
  },

  data() {
    return {
      isMaskShow: false,
    };
  },

  created() {
    this.loadLuckySheet();
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
      const pluginJs = document.createElement("script");
      pluginJs.setAttribute("src", "js/plugin.js");
      pluginJs.async = true;
      document.head.appendChild(pluginJs);
      pluginJs.onload = function () {
        const luckysheetJs = document.createElement("script");
        luckysheetJs.setAttribute("src", "js/luckysheet.umd.js");
        luckysheetJs.async = true;
        document.head.appendChild(luckysheetJs);
        luckysheetJs.onload = function () {
          luckysheet.create({
            container: "luckysheet",
          });
        };
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
      isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy();

      window.luckysheet.create({
        container: "luckysheet",
        showinfobar: true,
        data: exportJson.sheets,
        title: exportJson.info.name,
        userInfo: exportJson.info.name.creator,
      });
    },

    downloadExcel() {
      exportExcel(luckysheet.getAllSheets(), "excel");
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
</style>
