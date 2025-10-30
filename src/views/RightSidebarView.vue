<script lang="ts">
import artworksPage from "../page/artworksPage";
import {eventEmitter} from "../model/EventEmitter";
import usersPage from "../page/usersPage";

export default {
  data() {
    return {
      blockUserButShow: false
    }
  },
  methods: {
    handleMouseEnter() {
      const divRef = this.$refs.divRef as HTMLDivElement;
      divRef.style.transform = "translateX(0)";
    },
    handleMouseLeave() {
      const divRef: HTMLDivElement = this.$refs.divRef as HTMLDivElement;
      divRef.style.transform = 'translateX(80%)'
    },
    blockUserBut() {
      let authorInfo = artworksPage.getAuthorInfo();
      if (authorInfo === null) {
        authorInfo = usersPage.getUserInfo();
      }
      if (authorInfo === null) {
        this.$message.error('获取作者信息失败，未找到作者信息');
        return
      }
      eventEmitter.emit('event:mask_options_dialog_box', authorInfo);
    }
  },
  created() {
    eventEmitter.on('event:right_sidebar_show', (show: boolean) => {
      this.blockUserButShow = show;
    });
  }
}
</script>

<template>
  <div ref="divRef" style="position: fixed ;right: 0;top: 15%;
  transition: transform 0.5s;transform: translateX(80%); "
       @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <el-button v-show="blockUserButShow" @click="blockUserBut">屏蔽用户</el-button>
  </div>
</template>