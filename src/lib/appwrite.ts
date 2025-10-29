import { Client, Databases, ID, Query } from 'node-appwrite'

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

export const databases =  new Databases(client)
export const appwriteClient = client
export { ID }
export { Query }