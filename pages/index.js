import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { AppProvider, Button, Avatar, Card, Page, ResourceList, TextStyle } from '@shopify/polaris';


let history;
if (typeof window !== 'undefined') {
  console.log('we are running on the client')
  history = JSON.parse(localStorage.getItem("conversation")) || [];
} else {
  history = [];
  console.log('we are running on the server');
}
export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [historyOutput, setHistoryOutput] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });
    const data = await response.json(); 
    let lastPrompt = userInput;
    let lastResult = data.result;
    history.push({ prompt: lastPrompt, result: lastResult });
    localStorage.setItem("conversation", JSON.stringify(history));
    let getHistory = JSON.parse(localStorage.getItem("conversation"));
    setHistoryOutput(getHistory.reverse());
    setUserInput("");
  }

  return (
    <AppProvider i18n={enTranslations}>
      <Page>
        <Head>
          <title>OpenAI Quickstart</title>
          <link rel="icon" href="/talk.svg" />
        </Head>

        <main className={styles.main}>
          <img src="/talk.svg" className={styles.icon} />
          <h3>Say something</h3>
          <form>
            <textarea
              name="user"
              rows="4"
              cols="50"
              placeholder="Say something"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button onClick={onSubmit}>Send</Button>
          </form>
          <div className="history container">
            {historyOutput.length ? historyOutput.map(h => (<Card title={h.prompt}><p>{h.result}</p></Card>)) : <Card title="Welcome"></Card>} 
          </div>
        </main>
      </Page>
    </AppProvider>
  );
}
