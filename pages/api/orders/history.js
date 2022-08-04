import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.send(401).send({ message: 'signin required' }); // pass as JSON not as simple String.
  }
  const { user } = session;
  await db.connect();
  const orders = await Order.find({ user: user.name });
  await db.disconnect();
  res.send(orders);
};

export default handler;
