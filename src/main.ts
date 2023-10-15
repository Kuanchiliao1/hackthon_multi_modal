import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import OpenAI from "openai";

// const configuration = new Configuration({
//     apiKey: import.meta.env.VITE_API_KEY,
// });

const openai = new OpenAI({apiKey: import.meta.env.VITE_API_KEY, dangerouslyAllowBrowser: true});


(async () => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }, {role: "user", content: `Please provide a detailed scenario descriptor for roleplay. The scenario should be specific and should mention the next immediate action and the person involved based on their appearance or demeanor. For the image prompt, focus only on physical visuals of the scene and characters. Make it no longer than the example. Format as a JSON object as shown.
      Custom instructions = ${'hackathon, difficulty: hard'}

      Example:
      {scenario: "You're at a local bookshop, about to approach a middle-aged man engrossed in reading a mystery novel", imagePrompt: "Local bookshop with bookshelves, cozy ambiance, and a middle-aged man deeply engrossed in reading".}
    `}],
    model: "gpt-3.5-turbo",
  });

  const sceneInfo = JSON.parse(completion.choices[0].message.content)
  console.log(sceneInfo)

  // const image = await openai.images.generate({ prompt: sceneInfo.imagePrompt, size: "256x256" });
  // console.log(image.data[0].url);
  // document.querySelector('.this-class').src = image.data[0].url
  // document.querySelector('.char-info').textContent += sceneInfo.scenario
})();

// Audio stuff
document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("toggleRecord").addEventListener("click", toggleRecording);

  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;

  function toggleRecording() {
      if (isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  }

  function startRecording() {
      if (navigator.mediaDevices && window.MediaRecorder) {
          navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => {
                  mediaRecorder = new MediaRecorder(stream);

                  mediaRecorder.ondataavailable = event => {
                      audioChunks.push(event.data);
                  };

                  mediaRecorder.onstop = () => {
                      let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                      let audioUrl = URL.createObjectURL(audioBlob);
                      document.getElementById("audioPlayback").src = audioUrl;
                  };

                  mediaRecorder.start();
                  document.getElementById("toggleRecord").textContent = "Stop Recording";
                  isRecording = true;
              })
              .catch(error => {
                  console.error("Error accessing the microphone:", error);
              });
      }
  }

  function stopRecording() {
      if (mediaRecorder && mediaRecorder.state === "recording") {
          mediaRecorder.stop();
          document.getElementById("toggleRecord").textContent = "Start Recording";
          isRecording = false;
      }
  }
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="toggleRecord">Start Recording</button>
    <audio id="audioPlayback" controls></audio>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <img class="this-class">
    <p class="char-info">description: </p>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
