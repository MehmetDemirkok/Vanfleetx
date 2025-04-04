import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/user.model';

export async function POST(req: Request) {
  try {
    // MongoDB bağlantısı
    await connectToDatabase();

    // Request body'den verileri al
    const body = await req.json();
    console.log('Request body:', body);

    const { email, password, name, companyName: company, country } = body;

    // Validasyon kontrolleri
    if (!email || !password || !name || !company || !country) {
      return NextResponse.json(
        { message: 'Tüm alanların doldurulması zorunludur' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Email benzersizlik kontrolü
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı verilerini hazırla
    const userData = {
      email: email.toLowerCase(),
      password,
      name,
      company,
      country
    };

    // Yeni kullanıcı oluştur
    const user = await User.create(userData);

    // Kullanıcı yanıtını hazırla (şifre hariç)
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      company: user.company,
      country: user.country,
      role: user.role
    };

    return NextResponse.json(userResponse);
  } catch (error: any) {
    console.error('Signup error:', error);

    // MongoDB validation hatası kontrolü
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors || {}).map((err: any) => err.message);
      return NextResponse.json(
        { message: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    // MongoDB duplicate key hatası kontrolü
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Genel hata durumu
    return NextResponse.json(
      { message: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 