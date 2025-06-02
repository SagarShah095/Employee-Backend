const NotificationModel = require("../Models/NotificationModel");

exports.getNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await NotificationModel.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await NotificationModel.updateMany(
      { userId, read: false }, // 👈 Correct field
      { $set: { read: true } } // 👈 Correct field
    );
    res.status(200).json({
      message: "All notifications marked as read.",
      updated: result.modifiedCount || result.nModified || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};


exports.unreadCount = async (req, res) => {
    
 try {
    const { userId } = req.params;
    const count = await NotificationModel.countDocuments({
      userId,
      read: false,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to get unread count." });
  }
}

 exports.singleRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const result = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { $set: { read: true } },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read", notification: result });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}