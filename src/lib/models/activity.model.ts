import mongoose from 'mongoose';

// Mevcut modeli kaldır
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['yuk', 'arac', 'onay', 'kullanici'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
activitySchema.index({ timestamp: -1 });
activitySchema.index({ userId: 1 });
activitySchema.index({ type: 1 });

export const Activity = mongoose.model('Activity', activitySchema); 