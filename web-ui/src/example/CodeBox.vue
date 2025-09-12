<template>
  <div>
    <codemirror v-model="value" :style="{height: '100%'}" :tabSize="2" :extensions="extensions" disabled></codemirror>
    <el-button :icon="Link" @click="toGithub">github</el-button>
  </div>
</template>

<script>
import {Codemirror} from "vue-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {oneDark} from "@codemirror/theme-one-dark";
import {Link} from "@element-plus/icons-vue";

export default {
  name: "CodeBox",
  components: {Codemirror},
  props: {
    modelValue: String
  },
  computed: {
    Link() {
      return Link
    }
  },
  data() {
    return {
      value: this.modelValue,
      extensions: [javascript(), oneDark]
    }
  },
  methods: {
    toGithub() {
      window.open('https://github.com/pengxianggui/fast-crud-ui3/blob/main/src/example/full/MyTable.vue', '_blank')
    }
  }
}
</script>

<style scoped lang="scss">

</style>