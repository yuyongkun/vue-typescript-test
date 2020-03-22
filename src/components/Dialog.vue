<template>
  <v-card v-show="dialogShow" class="mx-auto" outlined :width="width" :height="height">
    <h3 class="dialog-title">Dialog弹框</h3>
    <div class="media-content">
      <video :src="realSrc"></video>
    </div>
    <v-card-actions>
      <v-btn text @click="handlerDialog('off')">取消</v-btn>
      <v-btn text @click="handlerDialog('off')">确定</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { commitDialogOff,commitDialogOn } from "@/store/modules/_mutations";
import { MediaInfoPart } from "@/class/graphItem";
export default Vue.extend({
  name: "c-dialog",
  props: ["width", "height", "realSrc", "mtype"],
  mounted() {},
  //   data(){
  //     //   return {
  //     //       mtype:0
  //     //   }
  //   },
  computed: {
   
    //  mediaType(){
    //      return this.realSrc.index
    //  }
  },
  methods: {
    handlerDialog() {
      commitDialogOff();
    }
  }
});
</script>
<style lang="scss">
.mx-auto {
  min-width: 200px;
  z-index: 2;
  position: fixed;
  top: 25%;
  box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.2);
}
.dialog-title {
  padding: 10px;
  background: #f2f2f2;
  font-size: 16px;
  font-weight: normal;
}
</style>
