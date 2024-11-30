<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="id" min-width="20">
      <template #default="{ row }">
        {{ row.id }}
      </template>
    </el-table-column>
    <el-table-column label="name" min-width="100">
      <template #default="{ row }">
        {{ row.name }}
      </template>
    </el-table-column>
    <el-table-column label="Email" width="195" align="center">
      <template #default="scope">
        {{ scope.row.email }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="{ row }">
        <el-tag :type="displayType(row)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { defineComponent } from 'vue';
import { transactionList } from '@/api/remote-search';
import { toThousandFilter } from '@/utils/filters';

export default defineComponent({
  data() {
    return {
      list: null
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      };
      return statusMap[status];
    },
    displayOrderNo(scope) {
      const s = scope.row.order_no;
      if (s) {
        return s.substring(0, 30);
      }
      return '';
    },
    displayPrice(scope) {
      return toThousandFilter(scope.row.price);
    },
    displayType(row) {
      return this.statusFilter(row.is_active);
    },
    fetchData() {
      transactionList().then(response => {
        console.log(response.data)
        this.list = response.data.slice(0, 8);
      });
    }
  }
});
</script>
