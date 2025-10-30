<script lang="ts">
import ruleKeyDataList from '../res/ruleKVDataList.json'
import AddRuleDialog from "../components/AddRuleDialog.vue";
import {eventEmitter} from "../model/EventEmitter";
import ruleKeyListData from "../data/ruleKeyListData";
import RuleSetValueDialog from "../eventEmitter_components/ruleSetValueDialog.vue";
import ViewRulesRuleDialog from "../eventEmitter_components/viewRulesRuleDialog.vue";
import RuleInformationView from "./RuleInformationView.vue";
import ruleUtil from "../utils/ruleUtil";

const ruleInfoArr: ruleKeyDataListItemType [] = ruleKeyDataList;
export default {
  components: {AddRuleDialog, RuleSetValueDialog, ViewRulesRuleDialog, RuleInformationView},
  data() {
    return {
      ruleInfoArr,
      cascaderVal: ['精确匹配', 'userId_precise'],
      cascaderOptions: ruleKeyListData.getSelectOptions(),
      addRuleDialogVisible: false,
      addRuleDialogRuleInfo: {key: '', name: '', fullName: ''} as ruleKeyDataListItemType
    }
  },
  methods: {
    handleChangeCascader(val: any) {
      console.log(val)
    },
    batchAddBut() {
      const [_, key] = this.cascaderVal;
      this.addRuleDialogVisible = true;
      this.addRuleDialogRuleInfo = ruleInfoArr.find(item => item.key === key)!
    },
    setRuleBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find(item => item.key === key);
      eventEmitter.emit('event:修改规则对话框', typeMap)
    },
    findItemAllBut() {
      const [_, key] = this.cascaderVal;
      const typeMap = ruleInfoArr.find(item => item.key === key);
      eventEmitter.send('event-lookRuleDialog', typeMap);
    },
    delBut() {
      const [_, key] = this.cascaderVal;
      ruleUtil.showDelRuleInput(key);
      eventEmitter.emit('刷新规则信息', false);
    },
    clearItemRuleBut() {
      const key = this.cascaderVal[1];
      const find = ruleInfoArr.find(item => item.key === key)!;
      this.$confirm(`是要清空${find.fullName}的规则内容吗？`, 'tip').then(() => {
        GM_deleteValue(key)
        this.$alert(`已清空${find.fullName}的规则内容`)
      })
      eventEmitter.emit('刷新规则信息', false);
    },
    delAllBut() {
      this.$confirm('确定要删除所有规则吗？').then(() => {
        for (const x of ruleInfoArr) {
          GM_deleteValue(x.key);
        }
        this.$message.success("删除全部规则成功");
        eventEmitter.emit('刷新规则信息', false);
      })
    }
  },
  watch: {},
  created() {

  }
}
</script>

<template>
  <div>
    <el-cascader v-model="cascaderVal" :options="cascaderOptions" :props="{ expandTrigger: 'hover' }"
                 :show-all-levels="true" filterable
                 style="width: 100%" @change="handleChangeCascader"/>
    <el-divider/>
    <el-button-group>
      <el-button @click="batchAddBut">批量添加</el-button>
      <el-button @click="setRuleBut">修改</el-button>
      <el-button @click="findItemAllBut">查看项内容</el-button>
      <el-button @click="delBut">移除</el-button>
    </el-button-group>
    <el-button-group>
      <el-button type="danger" @click="clearItemRuleBut">清空项</el-button>
      <el-button type="danger" @click="delAllBut">全部移除</el-button>
    </el-button-group>
    <el-card shadow="never">
      <template #header>说明</template>
      <div>1.规则的值唯一，且不重复。</div>
      <div>
        <el-link href="https://www.jyshare.com/front-end/854/" target="_blank" type="primary">
          2.正则表达式测试地址
        </el-link>
      </div>
    </el-card>
    <RuleInformationView/>
    <AddRuleDialog v-model="addRuleDialogVisible" :rule-info="addRuleDialogRuleInfo"/>
    <RuleSetValueDialog/>
    <ViewRulesRuleDialog/>
  </div>
</template>
