import mongoose, { Document } from 'mongoose';

export interface ILocation {
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IEmptyTruckPost extends Document {
  title: string;
  description: string;
  companyId: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  currentLocation: ILocation;
  destination: ILocation;
  truckType: string;
  capacity: number;
  price: number;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new mongoose.Schema<ILocation>({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
});

const emptyTruckPostSchema = new mongoose.Schema<IEmptyTruckPost>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  currentLocation: {
    type: locationSchema,
    required: true,
  },
  destination: {
    type: locationSchema,
    required: true,
  },
  truckType: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE',
  },
}, {
  timestamps: true,
});

export const EmptyTruckPost = mongoose.models.EmptyTruckPost || mongoose.model<IEmptyTruckPost>('EmptyTruckPost', emptyTruckPostSchema); 