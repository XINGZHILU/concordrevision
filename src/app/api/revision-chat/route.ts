import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import mongoClientPromise from '@/lib/mongodb';
import { HumanMessage, AIMessage } from 'langchain/schema';
import { StreamingTextResponse } from 'ai';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { Message } from 'ai/react';

export const runtime = 'edge';

async function getContext(message: string) {
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
    
    return await retriever.getRelevantDocuments(message);
}


export async function POST(req: Request) {
    const { messages } = await req.json();
    const currentMessageContent = messages[messages.length - 1].content;

    const context = await getContext(currentMessageContent);

    const TEMPLATE = `You are a very enthusiastic freeCodeCamp.org representative who loves to help people! Given the following sections from the freeCodeCamp.org contributor documentation, answer the question using only that information, outputted in markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that."
  
    Context sections:
    ${JSON.stringify(context)}
  
    Question: """
    ${currentMessageContent}
    """
    `;

    const model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        streaming: true,
    });

    const parser = new BytesOutputParser();

    const stream = await model.pipe(parser).stream([
        ...messages.slice(0, -1).map((msg: Message) => msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)),
        new HumanMessage(TEMPLATE),
    ]);

    return new StreamingTextResponse(stream);
} 