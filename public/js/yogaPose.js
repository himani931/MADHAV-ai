document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const videoElement = document.getElementById("video");
  const canvasElement = document.getElementById("canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const feedback = document.getElementById("feedback");

  let camera = null;
  let pose = null;

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    startBtn.innerText = "Starting...";
    startCamera();
  });

  function startCamera() {
    // Initialize MediaPipe Pose
    pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    // Start Camera
    camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });

    camera
      .start()
      .then(() => {
        videoElement.style.display = "block";
        startBtn.innerText = "Camera Running";
        feedback.innerText = "Align your body properly 🧘";
      })
      .catch((err) => {
        console.error("Camera error:", err);
        feedback.innerText = "Camera access denied ❌";
        startBtn.disabled = false;
        startBtn.innerText = "📷 Start Camera";
      });
  }

  function onResults(results) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height,
    );

    if (results.poseLandmarks) {
      // Draw skeleton
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });

      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });

      checkPosture(results.poseLandmarks);
    }
  }

  function checkPosture(landmarks) {
    // Shoulder alignment check
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftShoulder || !rightShoulder) return;

    const difference = Math.abs(leftShoulder.y - rightShoulder.y);

    if (difference > 0.05) {
      feedback.innerText = "⚠ Keep your shoulders level ";
    } else {
      feedback.innerText = " Good posture! Keep going ";
    }
  }
});