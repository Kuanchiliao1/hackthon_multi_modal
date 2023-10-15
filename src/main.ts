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
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

  const image = await openai.images.generate({ prompt: "Person in an office", size: "256x256" });
  console.log(image.data[0].url);
  document.querySelector('.this-class').src = image.data[0].url
})();


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
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
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
