import { connectToDatabase } from "@/lib/db";
import { CargoPost } from "@/lib/models/cargo-post.model";

export async function getCargoPostById(id: string) {
  try {
    await connectToDatabase();

    const post = await CargoPost.findById(id)
      .populate({
        path: 'createdBy',
        select: 'name email phone',
        model: 'User'
      })
      .lean();

    if (!post) {
      return null;
    }

    return {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
      createdBy: post.createdBy ? {
        ...post.createdBy,
        _id: post.createdBy._id.toString()
      } : null
    };
  } catch (error) {
    console.error('Error fetching cargo post:', error);
    return null;
  }
} 