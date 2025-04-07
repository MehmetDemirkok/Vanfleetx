import mongoose from 'mongoose';

const cargoPostSchema = new mongoose.Schema({
  loadingCity: { type: String, required: true },
  loadingAddress: { type: String, required: true },
  unloadingCity: { type: String, required: true },
  unloadingAddress: { type: String, required: true },
  loadingDate: { type: Date, required: true },
  unloadingDate: { type: Date, required: true },
  vehicleType: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'completed', 'cancelled'], 
    default: 'active' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  weight: { type: Number },
  volume: { type: Number },
  price: { type: Number },
  palletCount: { type: Number },
  palletType: { type: String },
}, {
  timestamps: true,
});

// Indexes
cargoPostSchema.index({ loadingCity: 1 });
cargoPostSchema.index({ unloadingCity: 1 });
cargoPostSchema.index({ vehicleType: 1 });
cargoPostSchema.index({ status: 1 });
cargoPostSchema.index({ createdBy: 1 });
cargoPostSchema.index({ createdAt: -1 });

export const CargoPost = mongoose.models.CargoPost || mongoose.model('CargoPost', cargoPostSchema); 