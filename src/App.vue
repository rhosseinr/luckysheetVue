<script>
import LuckySheet from "./components/LuckySheet.vue";

export default {
  name: "App",

  components: {
    LuckySheet,
  },

  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute("src", "js/plugin.js");
    plugin.async = true;
    document.head.appendChild(plugin);

    const luckysheet = document.createElement("script");
    luckysheet.setAttribute("src", "js/luckysheet.umd.js");
    luckysheet.async = true;
    document.head.appendChild(luckysheet);
  },
};
</script>

<template>
  <LuckySheet />
</template>
