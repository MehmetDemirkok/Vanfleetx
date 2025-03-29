import mongoose from 'mongoose';

export interface ICargoPost {
  userId: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: number;
  volume: number;
  price: number;
  loadingDate: Date;
  deliveryDate: Date;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const cargoPostSchema = new mongoose.Schema<ICargoPost>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Başlık gerekli'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Açıklama gerekli'],
    trim: true,
  },
  origin: {
    type: String,
    required: [true, 'Yükleme yeri gerekli'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Varış yeri gerekli'],
    trim: true,
  },
  cargoType: {
    type: String,
    required: [true, 'Yük tipi gerekli'],
    enum: ['palet', 'kasa', 'paket', 'dökme'],
  },
  weight: {
    type: Number,
    required: [true, 'Ağırlık gerekli'],
    min: [0, 'Ağırlık 0\'dan büyük olmalı'],
  },
  volume: {
    type: Number,
    required: [true, 'Hacim gerekli'],
    min: [0, 'Hacim 0\'dan büyük olmalı'],
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gerekli'],
    min: [0, 'Fiyat 0\'dan büyük olmalı'],
  },
  loadingDate: {
    type: Date,
    required: [true, 'Yükleme tarihi gerekli'],
  },
  deliveryDate: {
    type: Date,
    required: [true, 'Teslimat tarihi gerekli'],
  },
  status: {
    type: String,
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

// Mongoose modeli daha önce tanımlanmış mı kontrol et
const CargoPost = mongoose.models.CargoPost || mongoose.model<ICargoPost>('CargoPost', cargoPostSchema);

export default CargoPost; 