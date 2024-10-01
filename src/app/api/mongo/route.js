import { NextResponse } from "next/server";
const { MongoClient } = require("mongodb");

export async function POST(request) {
  const uri = "mongodb+srv://samlovescode:pacesonatians.nrxys.mongodb.net/?retryWrites=true&w=majority&appName=SpaceSonatians";
  const client = new MongoClient(uri);

  try {
    // Parse the incoming request body
    const body = await request.json();
    
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('nasaStarsData');
    const stars = database.collection('nasaStarsData');

    // Insert the data into the collection
    const result = await stars.insertOne(body);

    console.log(result);
    return NextResponse.json({ message: 'Data inserted successfully', data: result });

  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: 'Error inserting data', error }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET(request) {
  const uri = "mongodb+srv://samlovescacesonatians.nrxys.mongodb.net/?retryWrites=true&w=majority&appName=SpaceSonatians";
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('nasaStarsData');
    const stars = database.collection('nasaStarsData');
    
    // Fetch all documents from the collection
    const documents = await stars.find({}).toArray();

    return NextResponse.json(documents);

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error }, { status: 500 });
  } finally {
    await client.close();
  }
}
