import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "contact_manager";
let client: MongoClient | null = null;

export async function connectToDatabase() {
  if (client) return client;

  try {
    if (!uri) throw new Error('MongoDB URI is not defined');
    client = new MongoClient(uri);
    await client.connect();
    console.log("Conectado ao MongoDB");
    return client;
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}

export async function getDb() {
  const client = await connectToDatabase();
  return client.db(dbName);
}