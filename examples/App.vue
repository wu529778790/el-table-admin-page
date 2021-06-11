<template>
  <div id="app">
    <el-table-admin-page :columns="columns" :table-data="tableData" />
  </div>
</template>

<script>
import elTableAdminPage from "../packages/el-table-admin-page/src/el-table-admin-page.vue";
export default {
  components: { elTableAdminPage },
  name: "App",
  data() {
    return {
      columns: [
        {
          label: "日期",
          prop: "date",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          query: true,
        },
        {
          label: "姓名",
          prop: "name",
          feildType: "STRING",
          queryType: "EQ",
          isnull: false,
          form: true,
          query: true,
        },
        {
          label: "省份",
          prop: "province",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: false,
          form: true,
          query: true,
        },
        {
          label: "市区",
          prop: "city",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          query: true,
        },
        {
          label: "地址",
          prop: "address",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          query: true,
        },
        {
          label: "邮编",
          prop: "zip",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          query: true,
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
    };
  },
};
</script>
