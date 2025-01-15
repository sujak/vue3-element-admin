<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-group">
        <el-button :loading="processLoading" class="filter-item" type="primary" @click="handleAttendance">
          출첵
        </el-button>

        <el-button :loading="processLoading2" class="filter-item" type="primary" @click="handleUpdateMembers">
        조직도
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import request from '@/utils/request';

export function processAttendance(params) {
  return request({
    url: '/api/v1/automation/hiworksAttendance',
    method: 'post',
    params
  });
}

export function processGetMembers(params) {
  return request({
    url: '/api/v1/automation/hiworksUpdateMembers',
    method: 'post',
    params
  });
}

export default defineComponent({
  name: 'Automation',
  data() {
    return {
      processLoading: false,
      processLoading2: false
    };
  },
  created() {

  },
  methods: {
    handleAttendance() {
      this.processLoading = true;
      processAttendance().then((res)=> {
          console.log(res);
        }).then(()=> {
          this.processLoading = false;
        })
    },
    handleUpdateMembers(){
      this.processLoading2 = true;
      processGetMembers().then((res)=> {
          console.log(res);
        }).then(()=> {
          this.processLoading2 = false;
        })
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
