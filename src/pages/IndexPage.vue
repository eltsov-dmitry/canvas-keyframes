<template>
  <the-background/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheBackground from 'components/Background/TheBackground.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { TheBackground },
  setup() {
    return {};
  },
});
</script>
