import { client } from '../config/db';

async function listImages() {
  try {
    await client.connect();
    const db = client.db();
    const imagesCollection = db.collection('images');

    const images = await imagesCollection.find({}).toArray();
    console.log('Images in MongoDB:');
    images.forEach((image) => {
      console.log({
        id: image._id.toString(),
        name: image.name,
        url: `/api/images/${image._id}`,
      });
    });
  } catch (error) {
    console.error('Error listing images:', error);
  } finally {
    await client.close();
  }
}

listImages();
