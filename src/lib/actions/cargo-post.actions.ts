import { connectToDatabase } from "@/lib/db";
import { CargoPost } from "@/lib/models/cargo-post.model";
import { Types } from "mongoose";

export interface CargoPostType {
  _id: string;
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  loadingDate: string;
  unloadingDate: string;
  vehicleType: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  userId: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  weight?: number;
  volume?: number;
  price?: number;
  palletCount?: number;
  palletType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getCargoPostById(id: string): Promise<CargoPostType | null> {
  try {
    await connectToDatabase();

    const post = await CargoPost.findById(id)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .lean();

    if (!post || Array.isArray(post)) {
      return null;
    }

    // Type assertion for the post object
    const typedPost = post as unknown as {
      _id: Types.ObjectId;
      loadingCity: string;
      loadingAddress: string;
      unloadingCity: string;
      unloadingAddress: string;
      loadingDate: Date;
      unloadingDate: Date;
      vehicleType: string;
      description?: string;
      status: 'active' | 'inactive' | 'completed' | 'cancelled';
      userId: Types.ObjectId;
      createdBy?: {
        _id: Types.ObjectId;
        name: string;
        email: string;
        phone: string;
      };
      weight?: number;
      volume?: number;
      price?: number;
      palletCount?: number;
      palletType?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };

    // Convert Mongoose document to plain object with string IDs and dates
    const formattedPost: CargoPostType = {
      _id: typedPost._id.toString(),
      loadingCity: typedPost.loadingCity,
      loadingAddress: typedPost.loadingAddress,
      unloadingCity: typedPost.unloadingCity,
      unloadingAddress: typedPost.unloadingAddress,
      loadingDate: new Date(typedPost.loadingDate).toISOString(),
      unloadingDate: new Date(typedPost.unloadingDate).toISOString(),
      vehicleType: typedPost.vehicleType,
      description: typedPost.description,
      status: typedPost.status,
      userId: typedPost.userId.toString(),
      weight: typedPost.weight,
      volume: typedPost.volume,
      price: typedPost.price,
      palletCount: typedPost.palletCount,
      palletType: typedPost.palletType,
      createdAt: typedPost.createdAt ? new Date(typedPost.createdAt).toISOString() : undefined,
      updatedAt: typedPost.updatedAt ? new Date(typedPost.updatedAt).toISOString() : undefined,
      createdBy: typedPost.createdBy ? {
        _id: typedPost.createdBy._id.toString(),
        name: typedPost.createdBy.name,
        email: typedPost.createdBy.email,
        phone: typedPost.createdBy.phone
      } : null
    };

    return formattedPost;
  } catch (error) {
    console.error('Error fetching cargo post:', error);
    return null;
  }
} 