import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  company?: {
    name: string;
    taxId: string;
    address: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'İsim gerekli'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email gerekli'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Şifre gerekli'],
      minlength: [6, 'Şifre en az 6 karakter olmalı'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    company: {
      name: String,
      taxId: String,
      address: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Şifreyi hashleme
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Mongoose modeli daha önce tanımlanmış mı kontrol et
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 