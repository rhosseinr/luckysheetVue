<script>
import LuckySheet from "./components/LuckySheet.vue";

export default {
  name: "App",

  components: {
    LuckySheet,
  },

  data() {
    return {
      isMaskShow: false,
      selectedUrl: null,
      selectedFile: null,
      jsonData: {},
      options: [
        {
          text: "Money Manager.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/money-manager-2.xlsx",
        },
        {
          text: "Activity costs tracker.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Activity%20costs%20tracker.xlsx",
        },
        {
          text: "House cleaning checklist.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/House%20cleaning%20checklist.xlsx",
        },
        {
          text: "Student assignment planner.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Student%20assignment%20planner.xlsx",
        },
        {
          text: "Credit card tracker.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Credit%20card%20tracker.xlsx",
        },
        {
          text: "Blue timesheet.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Blue%20timesheet.xlsx",
        },
        {
          text: "Student calendar (Mon).xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Student%20calendar%20%28Mon%29.xlsx",
        },
        {
          text: "Blue mileage and expense report.xlsx",
          value:
            "https://minio.cnbabylon.com/public/luckysheet/Blue%20mileage%20and%20expense%20report.xlsx",
        },
      ],
    };
  },

  methods: {
    selectExcel() {
      const value = this.selectedUrl;
      if (value == "") {
        return;
      }
    },

    loadExcelFromFile(event) {
      const files = event.target.files;
      if (files == null || files.length == 0) {
        alert("No files wait for import");
        return;
      }
      this.selectedFile = files[0];
    },
  },
};
</script>

<template>
  <div class="d-flex h-100">
    <div class="demo-toolbar">
      <input id="uploadBtn" type="file" @change="loadExcelFromFile" />
      <span>Load Remote Xlsx:</span>
      <select v-model="selectedUrl" @change="selectExcel">
        <option disabled value="">Choose</option>
        <option
          v-for="option in options"
          :key="option.text"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <!-- <a href="javascript:void(0)" @click="downloadExcel"> Download xlsx </a> -->
    </div>
    <LuckySheet :url="selectedUrl" :file="selectedFile" />
  </div>
</template>

<style>
@font-face {
  font-family: Vazir;
  src: url("vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2")
      format("woff2 supports variations"),
    url("vazirmatn/fonts/webfonts/Vazirmatn[wght].woff2")
      format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: fallback;
}

html,
body {
  font-family: Vazir, Helvetica, Arial, sans-serif;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#app {
  font-family: Vazir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#uploadBtn {
  font-size: 16px;
}

.demo-toolbar {
  background: rgba(200, 200, 200, 0.5);
  padding: 1em;
}

.d-flex {
  display: flex;
  flex-direction: column;
}

.h-100 {
  height: 100%;
}
</style>
