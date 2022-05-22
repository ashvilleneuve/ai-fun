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
  Loading,
  Modal, 
  Page, 
  SkeletonBodyText,
  SkeletonDisplayText,
  TextField, 
  TextStyle,
  Toast,
} from '@shopify/polaris';


export default function Home() {
  let history;
  if (typeof window !== 'undefined' && localStorage.getItem("conversation") != "") {
    history = JSON.parse(localStorage.getItem("conversation"));
  } else {
    history = [];
  } 
  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  function promptHandler(e) {
    if (e.includes('\n')) {
      onSubmit(e);
    } else {
      setUserInput(e)
    }
  }

  async function onSubmit(event) {
    setToastActive(true);
    setIsLoading(true);
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
    toggleIsLoading();
  }

  const toggleToastActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    [],
  );
  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );

  const toastMarkup = toastActive ? (
    <Toast onDismiss={toggleToastActive} content="Question submitted" />
  ) : null;

  const loadingMarkup = isLoading ? <Loading /> : null; 
  const actualHistoryChildren = historyOutput.length ? historyOutput.map(h => <Card sectioned key={h.prompt} title={"Question: " + h.prompt}><p><TextStyle variation="strong">Response: </TextStyle>{h.result}</p></Card>) : "";
  const loadingHistoryChildren = [...Array(historyOutput.length+1)].map((h) => <Card sectioned><p><SkeletonDisplayText size="small" /><SkeletonBodyText lines={4} /></p></Card>);
  const historyChildren = isLoading ? loadingHistoryChildren : actualHistoryChildren;

  const pageMarkup = (
    <Page 
      narrowWidth={true}
    >
      <Layout distribution="fill">
        <Layout.Section oneThird>
          <DisplayText size="extraLarge">Hello, I'm Geoffrey, the Goaliebot.</DisplayText>
        </Layout.Section>
        <Layout.Section oneThird>
          <img src="../robot.png" alt="Geoffrey the Goaliebot" width='150px'></img>
        </Layout.Section>
      </Layout>
      <Layout>
        {skipToContentTarget}
        <Layout.Section>
          <Form
            noValidate
            implicitSubmit={true}
          >
            <FormLayout>
              <DisplayText size="medium">How can I help?</DisplayText>
              <TextField
                ariaActiveDescendant="activator"
                ariaControls="history_container"
                value={userInput}
                onChange={(e) => promptHandler(e)}
                label="How can I help?"
                labelHidden={true}
                type="text"
                inputMode="text"
                multiline={3}
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
          id="history_container"
        >
          {loadingMarkup}
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
          skipToContentTarget={skipToContentRef.current}
        >
        {pageMarkup}
        {modal}
        {toastMarkup}
        </Frame>
    </AppProvider>
  );
}
