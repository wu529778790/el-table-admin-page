# el-table-admin-page

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

| 参数       | 说明     | 类型  | 可选值 | 默认值 |
| ---------- | -------- | ----- | ------ | ------ |
| columns    | 表头     | Array | ——     | ——     |
| table-data | 表格数据 | Array | ——     | ——     |

### column 参数

| 参数     | 说明                                            | 类型    | 可选值     | 默认值 |
| -------- | ----------------------------------------------- | ------- | ---------- | ------ |
| search   | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |
| children | 二级表头,里面内容同 column                      | Array   | ——         | ——     |
| form     | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |
| isnull   | 下拉框搜索,不设置的话默认会出现在搜索的下拉框中 | Boolean | true/false | true   |

## 开发

```js
npm install
npm run serve
npm run build
```
