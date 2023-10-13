const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ConversationalRetrievalQAChain } = require('langchain/chains');
const { HNSWLib } = require('langchain/vectorstores/hnswlib');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const { BufferMemory } = require('langchain/memory');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
const fs = require('fs');
const { config } = require('dotenv');

config();

class LangChain {
  async run(prompt) {
    /* Initialize the LLM to use to answer the question */
    const model = new ChatOpenAI({});
    /* Load in the file we want to do question answering over */
    const text = fs.readFileSync('data.txt', 'utf8');
    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments([text]);
    /* Create the vectorstore */
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    /* Create the chain */
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        memory: new BufferMemory({
          memoryKey: 'chat_history', // Must be set to "chat_history"
        }),
      }
    );
    /* Ask it a question */
    const question = prompt;
    const res = await chain.call({ question });
    console.log(res);

    return res;
    /* Ask it a follow-up question */
    // const followUpRes = await chain.call({
    //   question: "Was that nice?",
    // });
    // console.log(followUpRes);
  }
}

module.exports = LangChain; // Export the class

// Usage: const MyLangChain = require('./LangChain');
// const langChain = new MyLangChain();
// langChain.run('Your Prompt');
