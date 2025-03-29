import { MongoClient } from 'mongodb';

const sourceUri = "mongodb+srv://mehmetdemirkok:i0E6OBiGY4yV8QsS@cluster0.3iekl.mongodb.net/test";
const targetUri = "mongodb+srv://mehmetdemirkok:i0E6OBiGY4yV8QsS@cluster0.3iekl.mongodb.net/VanFleetX";

async function migrateCollections() {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db('test');
    const targetDb = targetClient.db('VanFleetX');

    // Tüm koleksiyonları al
    const collections = ['cargoposts', 'companies', 'emptytruckposts', 'truckposts', 'users'];

    for (const collectionName of collections) {
      console.log(`Migrating ${collectionName}...`);
      
      // Koleksiyondaki tüm dökümanları al
      const documents = await sourceDb.collection(collectionName).find({}).toArray();
      
      if (documents.length > 0) {
        // Hedef koleksiyona dökümanları ekle
        await targetDb.collection(collectionName).insertMany(documents);
        console.log(`${documents.length} documents migrated to ${collectionName}`);
        
        // Kaynak koleksiyonu temizle
        await sourceDb.collection(collectionName).deleteMany({});
        console.log(`Source ${collectionName} collection cleared`);
      } else {
        console.log(`No documents found in ${collectionName}`);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

migrateCollections(); 