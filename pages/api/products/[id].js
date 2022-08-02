import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (res, req) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

export default handler;
