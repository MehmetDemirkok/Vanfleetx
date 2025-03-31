import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
  companyType?: 'LOGISTICS' | 'TRANSPORT';
  address?: string;
  city?: string;
  country?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  companyType: { 
    type: String, 
    enum: ['LOGISTICS', 'TRANSPORT'],
    default: 'LOGISTICS'
  },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
  timestamps: true
});

// Şifre hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ company: 1 });
userSchema.index({ companyType: 1 });
userSchema.index({ city: 1 });
userSchema.index({ country: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 