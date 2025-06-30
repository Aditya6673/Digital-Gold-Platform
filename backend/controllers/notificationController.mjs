import Notification from '../models/Notification.mjs';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    next(err);
  }
};
