<script lang="ts">
import {IntervalExecutor} from "../model/IntervalExecutor";
import {eventEmitter} from "../model/EventEmitter";

export default {
  data() {
    return {
      intervalExecutorStatus: [] as { status: boolean, key: string }[]
    }
  },
  methods: {
    setIntervalExecutorStatusBut(row: { key: string }, status: boolean) {
      IntervalExecutor.setIntervalExecutorStatus(row.key, status);
    }
  },
  created() {
    eventEmitter.on('event:update:intervalExecutorStatus', (data: { status: boolean, key: string }) => {
      const {status, key} = data;
      const find = this.intervalExecutorStatus.find((item: { key: string }) => item.key === key);
      if (find) {
        find.status = status;
      } else {
        this.intervalExecutorStatus.push(data);
      }
    })
    GM_addStyle(`
    #detectionStatusView .el-button {
    margin-left: 0!important
    }`)
  }
}
</script>

<template>
  <div id="detectionStatusView">
    <el-table :data="intervalExecutorStatus" border stripe>
      <el-table-column label="检测名" prop="name"/>
      <el-table-column label="状态" width="100">
        <template v-slot="scope">
          <el-tag v-show="scope.row.status" type="success">运行中</el-tag>
          <el-tag v-show="!scope.row.status" type="danger">已停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
          <div>
            <el-button v-show="scope.row.status" @click="setIntervalExecutorStatusBut(scope.row,false)">停止</el-button>
            <el-button v-show="!scope.row.status" @click="setIntervalExecutorStatusBut(scope.row,true)">启动</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>