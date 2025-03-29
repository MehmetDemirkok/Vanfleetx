import mongoose, { Document } from 'mongoose';

export interface ICargoPost extends Document {
  title: string;
  pickupLocation: string;
  deliveryLocation: string;
  cargoType: 'palet' | 'kasa' | 'paket' | 'dökme';
  description: string;
  status: 'active' | 'inactive' | 'completed';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cargoPostSchema = new mongoose.Schema<ICargoPost>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  pickupLocation: {
    type: String,
    required: true,
    trim: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
    trim: true,
  },
  cargoType: {
    type: String,
    required: true,
    enum: ['palet', 'kasa', 'paket', 'dökme'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'completed'],
    default: 'active',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export const CargoPost = mongoose.models.CargoPost || mongoose.model<ICargoPost>('CargoPost', cargoPostSchema); 