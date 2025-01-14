<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-group">
        <el-button :loading="processLoading" class="filter-item" type="primary" @click="handleAttendance">
          신규등록
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

export default defineComponent({
  name: 'Automation',
  data() {
    return {
      processLoading: false,
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
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
