const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const LEFT_MARGIN = 180;
const DRUM_WIDTH = 110;
const GAP = 100;
const CANVAS_WIDTH = 1100;
const CANVAS_HEIGHT = 700;
const KEY_SOUND = {
  firstBlock: '1',
  secondBlock: '2',
  thirdBlock: '3',
  forthBlock: '4',
};

// throttle util function
let throttleTimer;
const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  if (results.multiHandLandmarks) {
    for (
      let index = 0;
      index < results.multiHandLandmarks.length;
      index++
    ) {
      const classification = results.multiHandedness[index];
      const isRightHand = !(classification?.label === 'Right');
      let leftHand = [];
      let rightHand = [];
      if (isRightHand) {
        rightHand = results.multiHandLandmarks[index];
      } else {
        leftHand = results.multiHandLandmarks[index];
      }
      if (true) {
        if (!isRightHand && leftHand.length > 6) {
          const indexFinger = leftHand[7];
          const condirateX = indexFinger.x * 1100;
          const condirateY = indexFinger.y * 700;
          if (
            condirateY > 400 &&
            condirateX <= 1100 - LEFT_MARGIN &&
            condirateX >= 1100 - LEFT_MARGIN - DRUM_WIDTH
          ) {
            throttle(() => {
              const keyCode = KEY_SOUND['forthBlock'];
              const audio = document.querySelector(
                `audio[data-key="${keyCode}"]`
              );
              if (!audio) return;
              audio.currentTime = 0;
              audio.play();
            }, 500);
          }
        }
        if (!isRightHand && leftHand.length > 6) {
          const indexFinger = leftHand[7];

          const condirateX = indexFinger.x * 1100;
          const condirateY = indexFinger.y * 700;
          if (
            condirateY > 400 &&
            condirateX <= 1100 - LEFT_MARGIN - DRUM_WIDTH - GAP &&
            condirateX >= 1100 - LEFT_MARGIN - DRUM_WIDTH * 2 - GAP
          ) {
            throttle(() => {
              const keyCode = KEY_SOUND['secondBlock'];
              const audio = document.querySelector(
                `audio[data-key="${keyCode}"]`
              );
              if (!audio) return;
              audio.currentTime = 0;
              audio.play();
            }, 300);
          }
        }

        if (isRightHand && rightHand.length > 6) {
          const indexFinger = rightHand[7];
          const condirateX = indexFinger.x * 1100;
          const condirateY = indexFinger.y * 700;
          if (
            condirateY > 400 &&
            condirateX <= 1100 - LEFT_MARGIN - DRUM_WIDTH * 2 - GAP * 2 &&
            condirateX >= 1100 - LEFT_MARGIN - DRUM_WIDTH * 3 - GAP * 2
          ) {
            throttle(() => {
              const keyCode = KEY_SOUND['thirdBlock'];
              const audio = document.querySelector(
                `audio[data-key="${keyCode}"]`
              );
              if (!audio) return;
              audio.currentTime = 0;
              audio.play();
            }, 500);
          }
        }

        if (isRightHand && rightHand.length > 6) {
          const indexFinger = rightHand[7];
          const condirateX = indexFinger.x * 1100;
          const condirateY = indexFinger.y * 700;
          if (
            condirateY > 400 &&
            condirateX <= 1100 - LEFT_MARGIN - DRUM_WIDTH * 3 - GAP * 3 &&
            condirateX >= 1100 - LEFT_MARGIN - DRUM_WIDTH * 4 - GAP * 3
          ) {
            throttle(() => {
              const keyCode = KEY_SOUND['firstBlock'];
              const audio = document.querySelector(
                `audio[data-key="${keyCode}"]`
              );
              if (!audio) return;
              audio.currentTime = 0;
              audio.play();
            }, 500);
          }
        }
      }

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 1,
        });
        drawLandmarks(canvasCtx, landmarks, {
          color: '#FF0000',
          lineWidth: 1,
          fillColor: 'blue',
          radius: () => {
            return lerp(0, -0.15, 0.1, 10, 1);
          },
        });
      }
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.4,
  minTrackingConfidence: 0.4,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1100,
  height: 700,
});
camera.start();