import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

const uri =
  'mongodb+srv://MyMyself:kito123321@kitorosanocluster.qeuyn.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function connect() {
  try {
    await client.connect();
    const database = client.db('database');
    return database.collection('movies');
  } catch (error) {
    console.error('Error connecting to the database');
    console.error(error);
    await client.close();
  }
}

export class MovieModel {
  static async getAll({ genre, year }) {
    const db = await connect();

    if (genre && year)
      return db
        .find({
          genre: {
            $elemMatch: { $regex: genre, $options: 'i' }
          },
          year
        })
        .toArray();

    if (genre)
      return db
        .find({
          genre: {
            $elemMatch: { $regex: genre, $options: 'i' }
          }
        })
        .toArray();

    if (year) return db.find({ year }).toArray();

    return db.find().toArray();
  }

  static async getById({ id }) {
    const db = await connect();
    const objectId = new ObjectId(id);
    return db.findOne({ _id: objectId });
  }

  static async create({ input }) {
    const db = await connect();

    const { insertedId } = await db.insertOne(input);
    return {
      ...input,
      id: insertedId
    };
  }

  static async delete({ id }) {
    const db = await connect();
    const objectId = new ObjectId(id);
    const result = await db.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  static async update({ id, input }) {
    const db = await connect();
    const objectId = new ObjectId(id);
    const { ok, value } = await db.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnDocument: 'after' }
    );

    if (!ok) return false;

    return value;
  }
}
