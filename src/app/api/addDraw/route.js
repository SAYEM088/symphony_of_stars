export async function POST(request) {
  const uri = "mongodb+srv://samlovescodecesonatians.nrxys.mongodb.net/?retryWrites=true&w=majority&appName=SpaceSonatians";
  const client = new MongoClient(uri);

  try {
    // Parse the incoming request body
    const { data } = await request.json();

    // Check if data is provided
    if (!data) {
      return NextResponse.json({ message: 'No image data provided' }, { status: 400 });
    }

    // Connect to the MongoDB client
    await client.connect();
    const database = client.db('drawData');
    const collection = database.collection('drawPic');

    // Insert the base64 data into MongoDB
    const result = await collection.insertOne({ image: data });

    console.log('Insert result:', result);
    return NextResponse.json({ message: 'Data inserted successfully', data: result });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ message: 'Error inserting data', error }, { status: 500 });
  } finally {
    await client.close();
  }
}
