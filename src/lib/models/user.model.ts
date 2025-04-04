import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  company: string;
  companyType: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  role: 'user' | 'admin';
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mevcut modeli kaldır
if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Yeni şema oluştur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  },
  company: {
    type: String,
    required: [true, 'Şirket adı zorunludur'],
    trim: true
  },
  companyType: {
    type: String,
    required: [true, 'Şirket türü zorunludur'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası zorunludur'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Adres zorunludur'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Şehir zorunludur'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Ülke zorunludur'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: true // Sadece tanımlı alanları kabul et
});

// Şifre hashleme
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastActive = new Date();
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Yeni model oluştur
export const User = mongoose.model('User', userSchema); 