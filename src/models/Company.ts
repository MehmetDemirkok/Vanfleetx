import mongoose, { Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  type: 'LOGISTICS' | 'TRANSPORT';
  address: string;
  phone: string;
  email: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['LOGISTICS', 'TRANSPORT'],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  logo: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema); 