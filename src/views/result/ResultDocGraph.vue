<template>
  <div>
    <div :style="viewBoxStyle">
      <graph-view-box
        :graph="graph"
        :view-box="viewBox"
        render-selector
        render-label-selector
        render-media
      ></graph-view-box>
    </div>
    <toolbar-bottom @add-empty-note="newNote">
      <template v-slot:subTool>
        <div style="width: 100%; height: 100%" class="d-flex flex-row">
          <div style="width: 80px; height: 100%"></div>
          <v-col cols="1" class="pa-0 ma-0">
            <sub-tool-new-item
              @add-empty-node="newNode"
              @add-empty-link="newLink"
              @add-media="addMedia"
              @add-empty-note="newNote"
              @add-empty-document="addDocument"
            ></sub-tool-new-item>
          </v-col>
          <v-col cols="1" class="pa-0 ma-0">
            <sub-tool-style></sub-tool-style>
          </v-col>
          <v-col cols="1" class="pa-0 ma-0">
            <sub-tool-path :edit-mode="editMode" @path-open-current="bottomSheetOn('path')"></sub-tool-path>
          </v-col>
          <v-col cols="1" class="pa-0 ma-0">
            <sub-tool-svg></sub-tool-svg>
          </v-col>
          <v-col cols="1" class="pa-0 ma-0">
            <sub-tool-doc-save></sub-tool-doc-save>
          </v-col>
        </div>
      </template>
    </toolbar-bottom>
    <v-card :style="bottomSheetStyle" v-show="bottomSheet" class="unselected">
      <v-card-title class="px-2 py-1" style="background-color: coral; color: white">
        <template v-if="bottomSheetKey === 'path'">Current Path</template>
        <v-spacer></v-spacer>
        <icon-group :icon-list="bottomSheetIconList" color="white"></icon-group>
      </v-card-title>
      <v-card-text class="pa-0 ma-0">
        <path-drawer :container="pathContentRect" :path="path"></path-drawer>
      </v-card-text>
    </v-card>
    <!-- 测试弹框 -->
    <c-dialog width="400" height="260" v-show="dialogShow"></c-dialog>
    <v-btn large @click="ToggleDialog">显示弹框</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RectByPoint } from "@/class/geometric";
import {
  GraphSelfPart,
  MediaSettingPart,
  NoteSettingPart,
  MediaInfoPart
} from "@/class/graphItem";
import {
  commitBottomDynamicBarResize,
  commitDialogOn
} from "@/store/modules/_mutations";
import GraphViewBox from "@/components/graphComponents/GraphViewBox.vue";
import PathDrawer from "@/components/path/PathDrawer.vue";
import ToolbarBottom from "@/components/toolbar/ToolbarBottom.vue";
import SubToolNewItem from "@/components/toolbar/SubToolNewItem.vue";
import SubToolStyle from "@/components/toolbar/SubToolStyle.vue";
import SubToolPath from "@/components/toolbar/SubToolPath.vue";
import SubToolSvg from "@/components/toolbar/SubToolSvg.vue";
import IconGroup from "@/components/IconGroup.vue";
import SubToolDocSave from "@/components/toolbar/SubToolDocSave.vue";
import { getIcon } from "@/utils/icon";
import { PathSelfPart } from "@/class/path";
import { getIndex } from "@/utils/utils";

import Dialog from "@/components/Dialog.vue";

export default Vue.extend({
  name: "ResultDocGraph",
  components: {
    GraphViewBox,
    ToolbarBottom,
    SubToolNewItem,
    SubToolStyle,
    SubToolPath,
    IconGroup,
    PathDrawer,
    SubToolSvg,
    SubToolDocSave,
    "c-dialog": Dialog
  },
  data() {
    return {
      editPageRegex: new RegExp("edit-.*"),
      bottomSheet: false,
      bottomSheetKey: "path", // 指定渲染内容,
      pathLeftDivWidth: 240,
      path: PathSelfPart.emptyPathSelfPart()
    };
  },
  props: {
    editMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogShow: function() {
      return this.$store.state.componentDialog.on;
    },
    dataManager: function(): DataManagerState {
      return this.$store.state.dataManager;
    },
    allComponentsStyle: function(): StyleManagerState {
      return this.$store.state.styleComponentSize;
    },
    viewBox: function(): RectByPoint {
      return this.allComponentsStyle.viewBox;
    },
    viewBoxStyle: function(): CSSProp {
      return this.viewBox.getDivCSS({ overflow: "hidden" });
    },

    graph: function(): GraphSelfPart {
      return this.dataManager.currentGraph;
    },
    bottomSheetRect: function(): RectByPoint {
      return this.allComponentsStyle.bottomDynamicBar;
    },
    bottomSheetArea: function(): AreaRect {
      return this.bottomSheetRect.positiveRect();
    },
    bottomSheetStyle: function(): CSSProp {
      return this.bottomSheetRect.getDivCSS({ zIndex: 5 });
    },
    bottomSheetIconList: function(): IconItem[] {
      return [
        { name: getIcon("i-arrow-double", true), _func: this.bottomSheetLarge },
        {
          name: getIcon("i-arrow-double", false),
          _func: this.bottomSheetDecrease
        },
        { name: getIcon("i-edit", "close"), _func: this.bottomSheetOff }
      ];
    },

    pathContentRect: function(): RectObject {
      return {
        width: this.bottomSheetArea.width,
        height: this.bottomSheetArea.height - 44
      };
    }
  },
  methods: {
    ToggleDialog: function() {
      class Dialog extends MediaInfoPart {
        constructor(
          info: BaseMediaInfo,
          ctrl: BaseMediaCtrl,
          isDeleted: boolean,
        ) {
          super(info, ctrl, isDeleted);
          let payload = {
            realSrc: this.realSrc
          } as DialogStatePayload;

          commitDialogOn(payload);
        }
      }
      new Dialog('','','');
      // this.$store.commit('dialogOn')
    },
    newNode: function(_label: string, graph?: GraphSelfPart) {
      graph || (graph = this.graph);
      //Info Ctrl部分
      return graph.addEmptyNode("node", _label);
    },
    newLink: function(
      start: VisNodeSettingPart,
      end: VisNodeSettingPart,
      graph?: GraphSelfPart
    ) {
      graph || (graph = this.graph);
      //Info Ctrl部分
      return graph.addEmptyLink(start, end);
    },

    newNote: function(graph?: GraphSelfPart) {
      graph || (graph = this.graph);
      NoteSettingPart.emptyNoteSetting("note", "", "", graph._id, true);
    },

    addMedia: function(mediaIdList: id[], graph?: GraphSelfPart) {
      let defaultDoc = this.graph;
      graph || (graph = defaultDoc);
      let mediaSettingList = mediaIdList
        .map(_id => this.dataManager.mediaManager[_id])
        .map(info => {
          graph || (graph = defaultDoc);
          return MediaSettingPart.emptyMediaSettingFromInfo(info, graph);
        });
      graph.addItems(mediaSettingList);
      return mediaSettingList;
    },

    addDocument: function(
      _label: "DocGraph" | "DocPaper",
      graph?: GraphSelfPart
    ) {
      graph || (graph = this.graph);
      return graph.addSubGraph();
    },

    bottomSheetOn: function(key: string) {
      this.bottomSheet = true;
      this.bottomSheetKey = key;
    },
    bottomSheetOff: function() {
      this.bottomSheet = false;
    },

    bottomSheetLarge: function() {
      this.bottomSheetResize(true);
    },

    bottomSheetDecrease: function() {
      this.bottomSheetResize(false);
    },

    bottomSheetResize: function(large?: boolean) {
      large === undefined && (large = true);
      let height = this.bottomSheetRect.start.y;
      large ? (height -= 240) : (height += 240);
      commitBottomDynamicBarResize(height);
    }
  },
  watch: {},
  created(): void {},
  mounted(): void {},
  record: {
    status: "editing",
    description: ""
  }
});
</script>

<style scoped>
</style>

/**
* Created by whb on 2019/12/4
* Updated by []
*/
