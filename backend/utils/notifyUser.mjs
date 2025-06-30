import Notification from '../models/Notification.mjs';

export const notifyUser = async (userId, message) => {
  try {
    await Notification.create({ userId, message });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};
