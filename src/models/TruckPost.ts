import mongoose from 'mongoose';

const truckPostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  truckType: {
    type: String,
    required: true,
    enum: ['tir', 'kamyon', 'kamyonet', 'van', 'pickup'],
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  availableDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
truckPostSchema.index({ userId: 1 });
truckPostSchema.index({ status: 1 });
truckPostSchema.index({ createdAt: -1 });

const TruckPost = mongoose.models.TruckPost || mongoose.model('TruckPost', truckPostSchema);

export default TruckPost; 