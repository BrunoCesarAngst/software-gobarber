import mongoose from 'mongoose';

// campos que compõem os schema.
const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    user: {
      type: Number,
      required: true
    },
    // se a notificação foi lida ou não
    read: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notification', NotificationSchema);
