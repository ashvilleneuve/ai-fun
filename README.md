# Geoffrey the Goaliebot

This is a project created with the [OpenAI API](https://beta.openai.com/) and [Shopify’s Polaris component library](https://polaris.shopify.com/). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). 

Created as a response for the FrontEnd Developer Internship application challenge, it is a first attempt at an AI-driven autoresponding assistant for Shopify Plus's escalated teams' live support channels in Slack. These channels allow frontline support advisors to get answers for merchants during live interactions. They are often very busy and replies are time sensitive, so it can be a stressful part of the role. An autorespomder might be able to mitigate this burden by answering some of the less complex questions for us (perhaps by being @ mentioned in threads the escalated support member deems appropriate).

It uses the [Answers endpoint](https://beta.openai.com/docs/api-reference/answers) of the OpenAI API with the Curie engine. This iteration uses sample-sized source documents with content pulled from two public-facing help documents, as proof of concept only. It is therefore limited in its scope -- it can  answer basic questions about Shopify Scripts and checkout.liquid. It is also not yet integrated with Slack, as this was outside the requirements for this project. 

There is a [hosted demo here](https://goaliebot.herokuapp.com/), or you can install it locally:

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd goaliebot
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   ```bash
   $ cp .env.example .env
   ```

6. Add your [API key](https://beta.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! 
