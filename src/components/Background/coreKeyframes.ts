import { ref, onMounted } from 'vue';

const getKeyframes = async (path: string, maxIndex: number) => {
  const getFileName = (index: number) => {
    if (index < 10) {
      return `00${index}.jpg`;
    }
    if (index < 100) {
      return `0${index}.jpg`;
    }
    return `${index}.jpg`;
  };

  const filePromises = [];

  for (let i = 1; i <= maxIndex; i += 1) {
    const file = getFileName(i);
    const res = fetch(`${path}/${file}`);
    filePromises.push(res);
  }

  const blobPromises = (await Promise.all(filePromises)).map((file) => file.blob());
  return (await Promise.all(blobPromises)).map((blob) => URL.createObjectURL(blob));
};

export const coreKeyframes = () => {
  const keyframes = ref <string[]>([]);
  const animation = {
    perFrames: 10,
    fps: 15,
    interval: 0,
    scrollLength: 100,
  };

  const currentFrame = ref <number>(0);
  const wrapperHeight = ref <number>(0);

  const setCurrentFrame = (scrollPosition:number) => {
    const frame = Math.ceil(scrollPosition / animation.scrollLength);
    const necessaryFrame = frame * animation.perFrames;

    const animate = () => {
      if (necessaryFrame > currentFrame.value) {
        currentFrame.value += 1;
      }
      if (necessaryFrame < currentFrame.value) {
        currentFrame.value -= 1;
      }
      if (necessaryFrame === currentFrame.value) {
        clearInterval(animation.interval);
      }
    };

    if (necessaryFrame !== currentFrame.value) {
      animate();
      clearInterval(animation.interval);
      animation.interval = window.setInterval(animate, animation.fps);
    }
  };

  onMounted(async () => {
    keyframes.value = await getKeyframes('keyframes', 240);
    wrapperHeight.value = window.innerHeight
      + (keyframes.value.length / animation.perFrames)
      * animation.scrollLength;
  });

  return {
    currentFrame,
    setCurrentFrame,
    keyframes,
    wrapperHeight,
  };
};
