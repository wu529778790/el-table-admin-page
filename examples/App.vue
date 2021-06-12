<template>
  <div id="app">
    <el-table-admin-page
      ref="elTableAdminPage"
      :columns="columns"
      :table-data="tableData"
      v-bind.sync="pageList"
      @searchList="getPage"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template slot="searchLeft" slot-scope="{ entitys, index }">
        <el-input
          v-model="entitys[index].queryValue"
          placeholder="请输入搜索内容"
        />
      </template>
      <template slot="searchRight">
        <el-button type="primary">新增</el-button>
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
          label: "测试二级表头",
          children: [
            {
              label: "第一季度靠左",
              prop: "first",
            },
            {
              label: "第二季度居中",
              prop: "second",
              align: "center",
            },
            {
              label: "第三季度靠右",
              prop: "three",
              align: "right"
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
    getPage(entitys) {
      const params = {
        ...this.pageList,
        entitys: entitys
          ? entitys
          : this.$refs["elTableAdminPage"] &&
            this.$refs["elTableAdminPage"].entitys,
      };
      console.log(params);
      // 模拟调用分页接口
      setTimeout(() => {
        // 没有total的话生成total
        if (!this.pageList.total) {
          this.pageList.total =
            this.pageList.pageSize +
            Math.floor(Math.random() * (this.pageList.pageSize - 1 + 1) + 1);
        }
        //当前页要生成的条数
        let length;
        // 在最后一页的话生成total % pageSize条的数据
        if (
          this.pageList.currentPage ===
          Math.ceil(this.pageList.total / this.pageList.pageSize)
        ) {
          length = this.pageList.total % this.pageList.pageSize;
        } else {
          length = this.pageList.pageSize;
        }
        this.tableData = Array.from({ length }, (item, index) => {
          return {
            date: new Date().getTime(),
            name: `${index + 1} https://shenzjd.com`,
            province: `${index + 1}深圳`,
            city: `${index + 1}宝安区`,
            address: `${index + 1}上海市普陀区金沙江路 1518 弄`,
            zip: `${index + 1}`,
            first: `一季度${index + 1}`,
            second: `二季度${index + 1}`,
            three: `三季度${index + 1}`
          };
        });
      }, 100);
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
