import mongoose, { Schema, Document } from 'mongoose';

export interface ITruckPost extends Document {
  title: string;
  currentLocation: string;
  destination: string;
  truckType: string;
  capacity: number;
  availableDate: Date;
  status: 'active' | 'pending' | 'completed';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const truckPostSchema = new Schema<ITruckPost>({
  title: { type: String, required: true },
  currentLocation: { type: String, required: true },
  destination: { type: String, required: true },
  truckType: { type: String, required: true },
  capacity: { type: Number, required: true },
  availableDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'pending', 'completed'],
    default: 'active'
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

// Indexes for better query performance
truckPostSchema.index({ currentLocation: 1 });
truckPostSchema.index({ destination: 1 });
truckPostSchema.index({ truckType: 1 });
truckPostSchema.index({ status: 1 });
truckPostSchema.index({ createdBy: 1 });
truckPostSchema.index({ createdAt: -1 });

const TruckPost = mongoose.models.TruckPost || mongoose.model<ITruckPost>('TruckPost', truckPostSchema);

export { TruckPost }; 