'use server';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import mongoClientPromise from '@/lib/mongodb';
import { HumanMessage } from 'langchain/schema';

export async function askQuestion(question: string): Promise<string> {
  if (!question) {
    return "Please provide a question.";
  }
  
  const client = await mongoClientPromise;
  const dbName = "docs";
  const collectionName = "embeddings";
  const collection = client.db(dbName).collection(collectionName);

  const vectorStore = new MongoDBAtlasVectorSearch(
    new OpenAIEmbeddings({
      modelName: 'text-embedding-ada-002',
      stripNewLines: true,
    }), {
    collection,
    indexName: "default",
    textKey: "text",
    embeddingKey: "embedding",
  });

  const retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchKwargs: {
      fetchK: 20,
      lambda: 0.1,
    },
  });

  const retrieverOutput = await retriever.getRelevantDocuments(question);

  const TEMPLATE = `You are a very enthusiastic freeCodeCamp.org representative who loves to help people! Given the following sections from the freeCodeCamp.org contributor documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that."
  
  Context sections:
  ${JSON.stringify(retrieverOutput)}

  Question: """
  ${question}
  """
  `;

  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo'
  });

  const { content } = await model.invoke([
    new HumanMessage(TEMPLATE),
  ]);

  return content;
} 