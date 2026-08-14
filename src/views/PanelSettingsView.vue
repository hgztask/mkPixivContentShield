<script>
import {eventEmitter} from "../model/EventEmitter";
import localMKData from "../data/localMKData";
import shielding from "../shieldingModel/shielding";
//面板设置
export default {
  data() {
    return {
      drawerShortcutKeyVal: localMKData.getDrawerShortcutKeyGm(),
      theKeyPressedKeyVal: '',
      shieldButtonPaddingVal: localMKData.getShieldButtonPaddingGm()
    }
  },
  methods: {
    setDrawerShortcutKeyBut() {
      const theKeyPressedKey = this.theKeyPressedKeyVal;
      const drawerShortcutKey = this.drawerShortcutKeyVal;
      if (drawerShortcutKey === theKeyPressedKey) {
        this.$message('不需要重复设置');
        return;
      }
      GM_setValue('drawer_shortcut_key_gm', theKeyPressedKey);
      this.$notify({message: '已设置打开关闭主面板快捷键', type: 'success'});
      this.drawerShortcutKeyVal = theKeyPressedKey;
    },
    setShieldButtonPadding(val) {
      GM_setValue('shield_button_padding_gm', val);
      shielding.applyShieldButtonPadding(val);
      this.$notify({message: `已设置屏蔽按钮垂直内边距为${val}px`, type: 'success'});
    },
    resetShieldButtonPaddingBut() {
      this.shieldButtonPaddingVal = 10;
      this.setShieldButtonPadding(10);
    }
  },
  created() {
    eventEmitter.on('event-keydownEvent', (event) => {
      this.theKeyPressedKeyVal = event.key;
    })
  }
}
</script>

<template>
  <div>
    <el-card shadow="never">
      <template #header>
        <span>快捷键</span>
      </template>
      <div>1.默认情况下，按键盘tab键上的~键为展开关闭主面板</div>
      <div>2.当前展开关闭主面板快捷键：
        <el-tag>{{ drawerShortcutKeyVal }}</el-tag>
      </div>
      当前按下的键
      <el-tag>{{ theKeyPressedKeyVal }}</el-tag>
      <el-button @click="setDrawerShortcutKeyBut">设置打开关闭主面板快捷键</el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <span>屏蔽按钮</span>
      </template>
      <div>屏蔽按钮垂直内边距（px），数值越大按钮越高</div>
      <el-slider v-model="shieldButtonPaddingVal" :min="1" :max="15" :step="1" show-input
                 @change="setShieldButtonPadding"/>
      <el-button @click="resetShieldButtonPaddingBut">恢复默认</el-button>
    </el-card>
  </div>
</template>
