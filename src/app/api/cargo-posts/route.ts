import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CargoPost from '@/models/CargoPost';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    const cargoPosts = await CargoPost.find().sort({ createdAt: -1 });

    return NextResponse.json(cargoPosts);
  } catch (error) {
    console.error('Error fetching cargo posts:', error);
    return NextResponse.json(
      { error: 'İlanlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const cargoPost = await CargoPost.create({
      ...data,
      userId: session.user.id,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(cargoPost);
  } catch (error) {
    console.error('Error creating cargo post:', error);
    return NextResponse.json(
      { error: 'İlan oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 