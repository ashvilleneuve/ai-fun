import { useState, useCallback, useRef } from "react";
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { 
  AppProvider, 
  Button, 
  ButtonGroup, 
  Card,
  DisplayText,
  Form, 
  FormLayout, 
  Frame, 
  Layout, 
  Modal, 
  Page, 
  Stack,
  TextField, 
  TextStyle,
  Thumbnail 
} from '@shopify/polaris';


export default function Home() {
  let history;
  if (typeof window !== 'undefined' && localStorage.getItem("conversation") != "") {
    history = JSON.parse(localStorage.getItem("conversation"));
  } else {
    history = [];
  }
  const [userInput, setUserInput] = useState("");
  const [historyOutput, setHistoryOutput] = useState(history.reverse());
  const [active, setActive] = useState(true);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const skipToContentRef = useRef(null); 
  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );
  const activator = useRef(null);
  function clearHistory() {
    localStorage.setItem("conversation", "");
    let clearedHistory = localStorage.getItem("conversation");
    setHistoryOutput(clearedHistory);
    handleChange();
  }

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

  const logo = {
    width: 75,
    source:
      '/public/robot.png',
    accessibilityLabel: 'Geoffrey the Goaliebot',
  };
  const historyChildren = historyOutput.length ? historyOutput.map(h => <Card sectioned key={h.prompt} title={"Question: " + h.prompt}><p><TextStyle variation="strong">Response: </TextStyle>{h.result}</p></Card>) : "";
  const pageMarkup = (
    <Page 
      narrowWidth={true}
    >
      <Stack distribution="trailing">
        <Stack.Item fill>
          <DisplayText size="extraLarge">Hello, I'm Geoffrey, the Goaliebot.</DisplayText>
        </Stack.Item>
        <Stack.Item>
          <Thumbnail
            source="/robot.png"
            size="large"
            transparent={true}
            alt="Geoffrey the Goaliebot"
          />
        </Stack.Item>
      </Stack>
      <Layout>
        {skipToContentTarget}
        <Layout.Section>
          <Form noValidate>
            <FormLayout>
              <TextField
                value={userInput}
                onChange={(e) => setUserInput(e)}
                label="How can I help?"
                type="text"
                inputMode="text"
                multiline={4}
                spellCheck={true}
                autoComplete="off"
              />
              <ButtonGroup>
                <Button id="activator" onClick={handleChange} ref={activator}>Clear history</Button>
                <Button primary onClick={onSubmit}>Submit</Button>
              </ButtonGroup>
            </FormLayout>
          </Form>
        </Layout.Section>
        <Layout.Section 
          className="history container"
        >
          {historyChildren}
        </Layout.Section>
      </Layout>
    </Page>
  );

  const modal = (<div>
    <Modal
      activator={activator}
      open={!active}
      onClose={handleChange}
      title="Are you sure?"
      primaryAction={{
        content: 'Delete history',
        onAction: clearHistory,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <p>Clearing chat history is permanent.</p>
      </Modal.Section>
    </Modal>
  </div>
  );

  return (
    <AppProvider i18n={enTranslations}>
        <Frame
          logo={logo}
          skipToContentTarget={skipToContentRef.current}
        >
        {pageMarkup}
        {modal}
        </Frame>
    </AppProvider>
  );
}
