import { onUnmounted, onMounted, Ref } from 'vue';

export const coreCanvas = () => {
  let isMounted = true;
  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let images: HTMLImageElement[] = [];

  const cover = (img:HTMLImageElement, type:string) => {
    const imgRatio = img.height / img.width;
    const winRatio = window.innerHeight / window.innerWidth;
    if ((imgRatio < winRatio && type === 'contain') || (imgRatio > winRatio && type === 'cover')) {
      const h = window.innerWidth * imgRatio;
      ctx?.drawImage(img, 0, (window.innerHeight - h) / 2, window.innerWidth, h);
    }
    if ((imgRatio > winRatio && type === 'contain') || (imgRatio < winRatio && type === 'cover')) {
      const w = (window.innerWidth * winRatio) / imgRatio;
      ctx?.drawImage(img, (window.innerWidth - w) / 2, 0, w, window.innerHeight);
    }
  };

  const init = (canvasRef:HTMLCanvasElement, keyframes:string[]) => {
    ctx = canvasRef.getContext('2d');
    canvas = canvasRef;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    images = keyframes.map((keyframe) => {
      const img = new Image();
      img.src = keyframe;
      return img;
    });
  };

  const render = (currentFrame: Ref) => {
    const w = canvas?.width ?? 0;
    const h = canvas?.height ?? 0;
    ctx?.clearRect(0, 0, w, h);
    cover(images[currentFrame.value], 'cover');
  };

  const run = (currentFrame: Ref) => {
    window.requestAnimationFrame(() => {
      if (currentFrame.value < images.length) {
        render(currentFrame);
      }

      if (isMounted) {
        run(currentFrame);
      }
    });
  };

  const start = (canvasRef: HTMLCanvasElement, keyframes: string[], currentFrame: Ref) => {
    init(canvasRef, keyframes);
    run(currentFrame);
  };

  onMounted(() => {
    isMounted = true;
  });

  onUnmounted(() => {
    isMounted = false;
  });

  return {
    ctx,
    canvas,
    images,
    cover,
    init,
    render,
    run,
    start,
  };
};
