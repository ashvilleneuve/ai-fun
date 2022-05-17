import { useState, useCallback, useRef } from "react";
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import { 
  AppProvider, 
  Button, 
  ButtonGroup, 
  Card, 
  Form, 
  FormLayout, 
  Frame, 
  Layout, 
  Loading, 
  Modal, 
  Page, 
  SkeletonBodyText, 
  SkeletonDisplayText, 
  SkeletonPage, 
  TextContainer, 
  TextField, 
  Thumbnail 
} from '@shopify/polaris';

let history;
if (typeof window !== 'undefined' && localStorage.getItem("conversation") != "") {
  history = JSON.parse(localStorage.getItem("conversation"));
} else {
  history = [];
}
export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [historyOutput, setHistoryOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(true);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );
  const loadingMarkup = isLoading ? <Loading /> : null;
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
    width: 50,
    topBarSource:
      '/talk.svg',
    contextualSaveBarSource:
      '/talk.svg',
    url: '/',
    accessibilityLabel: 'AI Fun',
  };
  const historyChildren = historyOutput.length ? historyOutput.map(h => <Card sectioned title={h.prompt}><p>{h.result}</p></Card>) : ""
  const actualPageMarkup = (
    <Page 
      title="Hello, I'm Bit, the Onboarding Buddy Bot."
      narrowWidth={true}
    >
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
          children={historyChildren}
        >
        </Layout.Section>
      </Layout>
    </Page>
  );

  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );

  const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;

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
        {loadingMarkup}
        {pageMarkup}
        {modal}
        </Frame>
    </AppProvider>
  );
}
