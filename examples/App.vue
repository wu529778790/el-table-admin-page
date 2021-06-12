<template>
  <div id="app">
    <el-table-admin-page
      ref="elTableAdminPage"
      :columns="columns"
      :table-data="tableData"
      :total="pageList.total"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="searchLeft" slot-scope="{ entitys, index }">
        <el-input
          v-model="entitys[index].queryValue"
          placeholder="请输入搜索内容"
        />
      </template>
      <template slot="columnEspecial" slot-scope="{ column, row }">
        <span>{{ row[column.prop] }}</span>
      </template>
    </el-table-admin-page>
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
          type: "selection", // 多选框
        },
        {
          type: "index", // 序号列
        },
        {
          label: "全年报告",
          children: [
            {
              label: "第一季度",
              prop: "first",
            },
            {
              label: "第二季度",
              prop: "second",
            },
            {
              label: "第三季度",
              prop: "three",
            },
            {
              label: "第四季度",
              prop: "four",
            },
          ],
        },
        {
          label: "测试表头自适应生成的宽度",
          prop: "name",
          align: "center",
        },
        {
          columnKey: "id",
          label: "测试固定宽度",
          prop: "date",
          width: "130",
          align: "center",
        },
        {
          label: "省份",
          prop: "province",
          align: "center",
        },
        {
          label: "市区",
          prop: "city",
          align: "center",
        },
        {
          label: "地址",
          prop: "address",
          showOverflowTooltip: true,
        },
        {
          label: "邮编",
          prop: "zip",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          search: true,
        },
      ],
      pageList: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
    };
  },
  mounted() {
    this.getPage();
  },
  methods: {
    getPage() {
      // 请求的时候不仅要带上pageList,还要带上entitys
      this.$nextTick(() => {
        console.log(this.pageList);
        console.log(
          this.$refs["elTableAdminPage"] &&
            this.$refs["elTableAdminPage"].entitys
        );
      });
      setTimeout(() => {
        this.tableData = Array.from(
          { length: this.pageList.pageSize },
          (item, index) => {
            return {
              date: new Date().getTime(),
              name: `${index}+https://shenzjd.com`,
              province: `${index}深圳`,
              city: `${index}宝安区`,
              address: `${index}上海市普陀区金沙江路 1518 弄`,
              zip: `${index}`,
              first: `一季度${index}`,
              second: `二季度${index}`,
              three: `三季度${index}`,
              four: `四季度${index}`,
            };
          }
        );
        this.pageList.total =
          this.pageList.pageSize + Math.floor(Math.random() * (50 - 1 + 1) + 1);
      }, 500);
    },
    // pageSize 改变时会触发
    sizeChange(value) {
      this.pageList.pageSize = value;
      this.getPage();
    },
    // currentPage 改变时会触发
    currentChange(value) {
      this.pageList.currentPage = value;
      this.getPage();
    },
  },
};
</script>
