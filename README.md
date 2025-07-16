# Fast-Crud

注意：本项目只是fast-crud的demo演示项目，仅供项目集成参考。

## 介绍

- 文档参考[这里](http://pengxg.cc/tags/fast-crud)
- 在线DEMO参考[这里](http://fastcrud.pengxg.cc/)

## 展示

前端仅使用如下代码:

```vue

<template>
  <fast-table :option="tableOption">
    <fast-table-column-input prop="name" label="姓名"/>
    <fast-table-column-img prop="avatarUrl" label="头像"/>
    <fast-table-column-number prop="age" label="年龄"/>
    <fast-table-column-select prop="sex" label="性别"
                              :options="[{label: '男', value: '1'}, {label: '女', value: '0'}]"/>
    <fast-table-column-date-picker prop="createTime" label="创建时间" type="datetime" :editable="false"/>
  </fast-table>
</template>

<script>
  import {FastTableOption} from "../../../packages";

  export default {
    name: "EasyDemo",
    data() {
      return {
        tableOption: new FastTableOption({
          module: 'student',
        })
      }
    },
    methods: {
      expandButton({choseRow, checkedRows, editRows}, type) {
        if (type === 'code') {
          window.open('https://github.com/pengxianggui/fast-crud-demo/blob/main/web-ui/src/example/easy/EasyDemo.vue', '_blank')
        } else if (type === 'doc') {
          window.open('http://pengxg.cc/tags/fast-crud', '_blank')
        }
      }
    }
  }
</script>
```

就可以实现一个完整CRUD功能的表格，且具备强大搜索过滤功能和批量编辑功能、以及扩展性：
![简单demo](./doc/easy_demo.png)

更完整的demo(包括如何扩展):
![完整demo](./doc/full_demo.png)

## 使用方式

### 后端集成

#### 引入maven依赖

```xml

<dependencies>
    <dependency>
        <groupId>io.github.pengxianggui</groupId>
        <artifactId>fast-crud-spring-boot-starter</artifactId>
        <version>${version}</version>
    </dependency>
    <!-- 下面这个可选 -->
    <dependency>
        <groupId>io.github.pengxianggui</groupId>
        <artifactId>fast-crud-auto-generator</artifactId>
        <version>${version}</version>
    </dependency>
</dependencies>
```

#### 代码生成准备(可选)

手撸一个main方法

```java
public class CodeGenerator {
    public static void main(String[] args) {
        CodeAutoGenerator.builder()
                .author("pengxg") // 替换为你的名称
                .module("demo") // maven多模块时配置模块名,表名要生成的代码文件存放的模块
                .url("jdbc:mysql://127.0.0.1:3306/fast-crud") // 替换成你的数据库连接地址
                .username("root") // 替换成你的数据库用户名
                .password("123456") // 替换成你的数据库密码
                .parentPkg("io.github.pengxianggui.crud.demo") // 替换成你的包根目录
                .build()
                .generate();
    }
}
```

> 运行这个main方法，会交互式询问要针对哪个表生成代码文件，可选择性生成对应的controller、service、serviceImpl、mapper以及mapper.xml。
> 且生成的controller方法已具备crud相关接口

### 前端引入

详见[这里](web-ui/README.md)