# el-table-admin-page

> 公司内部快速迭代开发用的，但是一直都是在项目内，没有发到 npm 上面，当然也怕提交到 github，被公司扫到。抽空自己又写了一份，给公司内的不太一样，精简了很多，一般都是随着业务的需求逐渐完善，现在只能想到哪，完善哪了。

> 用这种模板可以快速完成页面的增删改查，只需要配置特定的参数即可

该项目基于 elementUI 封装的，主要封装了 Table 表格和 Pagination 分页组件，通过 columns 的参数配置页面(我们开发的时候 columns 是由后端模板生成的)，在公司内部大量使用。

- 只需要设置好表头的参数就可以自动生成搜索框
  - 配置 search 为 false，就不在搜索下拉框中存在
  - 默认选择第一个搜索下拉框
  - 支持多条件搜索，点击加号就可以添加多条件
- 支持多级表头，只需要在 column 里面添加 children 即可
- 没有设置 width 的情况下，自动根据表头内容计算宽度
  - 如果是英文字符，为字符分配 8 个单位宽度
  - 如果是中文字符，为字符分配 20 个单位宽度
  - 其他种类字符，为字符分配 5 个单位宽度
  - 列最小宽度设定为 70

## example

在线 demo：<https://blog.shenzjd.com/el-table-admin-page/>

```js
npm install el-table-admin-page

import elTableAdminPage from "el-table-admin-page";

Vue.use(elTableAdminPage);
```

```vue
<template>
  <div id="app">
    <el-table-admin-page
      ref="elTableAdminPage"
      :columns="columns"
      :table-data="tableData"
      v-bind.sync="pageParams"
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
        <template v-if="['operation'].includes(column.prop)">
          <el-button type="primary" plain size="mini">编辑</el-button>
        </template>
        <template v-else>{{ row[column.prop] }}</template>
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
              align: "right",
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
        {
          label: "操作",
          prop: "operation",
          form: false,
          search: false,
          align: "center",
          showOverflowTooltip: false, // 没设定宽度刚开始按钮后面出来一个点，原来是文本溢出
        },
      ],
      pageParams: {
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
        ...this.pageParams,
        entitys: entitys
          ? entitys
          : this.$refs["elTableAdminPage"] &&
            this.$refs["elTableAdminPage"].entitys,
      };
      console.log(params);
      // 模拟调用分页接口
      setTimeout(() => {
        // 没有total的话生成total
        if (!this.pageParams.total) {
          this.pageParams.total =
            this.pageParams.pageSize * 9 +
            Math.floor(Math.random() * (this.pageParams.pageSize - 1 + 1) + 1);
        }
        //当前页要生成的条数
        let length;
        // 在最后一页的话生成total % pageSize条的数据
        if (
          this.pageParams.currentPage ===
          Math.ceil(this.pageParams.total / this.pageParams.pageSize)
        ) {
          length = this.pageParams.total % this.pageParams.pageSize;
        } else {
          length = this.pageParams.pageSize;
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
            three: `三季度${index + 1}`,
          };
        });
      }, 100);
    },
    // pageSize 改变时会触发
    sizeChange(value) {
      this.pageParams.pageSize = value;
      this.getPage();
    },
    // currentPage 改变时会触发
    currentChange(value) {
      if (typeof value === "number") {
        this.pageParams.currentPage = value;
        this.getPage();
      }
    },
  },
};
</script>
```

## 参数配置

### el-table-admin-page 参数

| 参数        | 说明             | 类型    | 可选值     | 默认值 |
| ----------- | ---------------- | ------- | ---------- | ------ |
| columns     | 表头             | Array   | ——         | ——     |
| table-data  | 表格数据         | Array   | ——         | ——     |
| search-show | 控制搜索框的显示 | Boolean | true/false | true   |

### column 参数

| 参数                | 说明                                            | 类型    | 可选值     | 默认值 |
| ------------------- | ----------------------------------------------- | ------- | ---------- | ------ |
| search              | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |
| children            | 二级表头,里面内容同 column                      | Array   | ——         | ——     |
| showOverflowTooltip | 当内容过长被隐藏时显示 tooltip                  | Array   | true/false | true   |
| form                | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |
| isnull              | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |

### el-table-admin-page 方法

| 方法名     | 说明                  | 参数    |
| ---------- | --------------------- | ------- |
| searchList | 请求 tableData 的方法 | entitys |

### 以后要实现的功能

- 多选下拉框第一个选择的，不在第二个及以后的下拉列表里出现

![20210612165908](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/20210612165908.png)

### 遇到的问题

#### 通过遍历给元素添加属性,怎么写

v-bind 已经实现了，刚开始在群里讨论，大家都说要用 jsx, vue 的模板语法不支持

![2bfdd6458184511d5756f9e6ba7295c](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/2bfdd6458184511d5756f9e6ba7295c.png)

最后在群里江南大佬的提示下，看 vue 的 issues 果然有，祖师爷回复的

<https://github.com/vuejs/vue/issues/4962>

![20210612161325](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/20210612161325.png)

```html
<el-table-column
  :prop="column.prop"
  :label="column.label"
  :width="column.width"
  :align="column.align"
/>
```

```html
<el-table-column v-bind="column" />
```

#### 手动修改当前页码，数据改变，dom 不生效的问题

用 v-if 或者 key 重新渲染给 el-panigation 手动设置 currentPage

```html
<el-pagination
  v-if="paginationShow"
  v-on="$listeners"
  v-bind="$attrs"
  :layout="'total, sizes, prev, pager, next, jumper'"
/>
```

```js
// 加这个show是为了解决手动修改当前页码，数据改变，dom不生效的问题
this.paginationShow = false;
this.$nextTick(() => {
  this.paginationShow = true;
  reSetFirstPage && this.$emit("update:currentPage", 1);
});
```

#### 点击表格会触发@current-change="currentChange"事件

![20210612172409](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/20210612172409.png)

原来是因为 el-table 的事件名称和 el-pagination 的事件名称重复了

![20210612173215](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/20210612173215.png)

![20210612173229](https://cdn.jsdelivr.net/gh/wu529778790/image/blog/20210612173229.png)

所以要么修改方法名称，里面接一下，要么做判断区分，这里封装选择判断区分，因为 el-table 的 current-change 用的比较少(尽量不改变原来的方法参数)

之所以没有在 el-table-admin-page 里面判断，是因为怕有些需求确实会遇到要用 el-table 的 current-change 事件

只需要在 el-pagination 的 current-change 事件中加一个判断即可

```js
if (typeof value === "number") {
  // el-pagination的current-change
  this.pageParams.currentPage = value;
  this.getPage();
} else {
  // el-table的 current-change
}
```

## 二次开发

```js
npm install
npm run serve
git subtree push --prefix dist origin gh-pages
```

## 参考链接

- <https://juejin.cn/post/6859004947837485070>
- <https://juejin.cn/post/6859004947837485070>
