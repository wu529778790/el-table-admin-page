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

### 遇到的问题

- 通过遍历给元素添加属性,怎么写

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

- 手动修改当前页码，数据改变，dom 不生效的问题

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
