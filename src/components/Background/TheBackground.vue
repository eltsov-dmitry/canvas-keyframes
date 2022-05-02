<template>
  <div
    class="b-background"
    :style="{ height: `${keyframeCore.wrapperHeight.value}px` }"
    v-scroll="keyframeCore.setCurrentFrame"
  >
    <h1 class="b-background__title">Scroll down</h1>
    <canvas
      class="b-background__canvas"
      ref="canvasRef"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  onMounted,
} from 'vue';
import { useQuasar } from 'quasar';
import { coreKeyframes } from 'components/Background/coreKeyframes';
import { coreCanvas } from 'components/Background/coreCanvas';

export default defineComponent({
  name: 'TheBackground',
  setup() {
    const $q = useQuasar();
    const canvasRef = ref();

    const setLoading = (val: boolean) => (val ? $q.loading.show() : $q.loading.hide());

    const keyframeCore = coreKeyframes();
    const canvasCore = coreCanvas();

    watch(keyframeCore.keyframes, () => {
      const canvas = canvasRef.value;
      const { keyframes, currentFrame } = keyframeCore;

      if (keyframes.value.length) {
        canvasCore.start(canvas, keyframes.value, currentFrame);
        setLoading(false);
      }
    });

    onMounted(() => {
      setLoading(true);
    });

    return {
      keyframeCore,
      canvasRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.b-background{
  position: relative;
  width: 100%;
  height: 100vh;
  &__canvas {
    position: sticky;
    width: 100%;
    height: 100vh;
    top: 0;
  }
  &__title {
    position: absolute;
    top: 50vh;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    white-space: nowrap;
    font-size: 5em;
    z-index: 1;
  }
}
</style>
