import { connectToDatabase } from "@/lib/db";
import { CargoPost } from "@/lib/models/cargo-post.model";

export const getCargoPostById = async (id: string) => {
  try {
    await connectToDatabase();
    
    const post = await CargoPost.findById(id).populate({
      path: 'createdBy',
      select: 'name email phone',
    });

    return post;
  } catch (error) {
    console.error("Error fetching cargo post:", error);
    return null;
  }
}; 