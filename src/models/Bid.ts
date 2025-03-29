import mongoose, { Document } from 'mongoose';

export interface IBid extends Document {
  postId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  amount: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new mongoose.Schema<IBid>({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
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
  amount: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

export const Bid = mongoose.models.Bid || mongoose.model<IBid>('Bid', bidSchema); 