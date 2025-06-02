const express = require("express");
const NotificationModel = require("../Models/NotificationModel");
const {
  getNotification,
  markAllRead,
  unreadCount,
  singleRead,
} = require("../controllers/NotificationController");
const router = express.Router();

router.get("/:userId", getNotification);

router.put("/mark-all-read/:userId", markAllRead);

router.get("/unread-count/:userId", unreadCount);

router.put("/mark-read/:notificationId", singleRead);
module.exports = router;
