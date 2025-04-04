import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const VehiclePost = mongoose.model('VehiclePost');
    
    // İlanın var olup olmadığını ve kullanıcıya ait olup olmadığını kontrol et
    const post = await VehiclePost.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!post) {
      return NextResponse.json(
        { error: 'İlan bulunamadı veya bu işlem için yetkiniz yok' },
        { status: 404 }
      );
    }

    // İlanı sil
    await VehiclePost.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vehicle Post Delete Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 