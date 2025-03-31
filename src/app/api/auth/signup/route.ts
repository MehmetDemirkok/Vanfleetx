import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/user.model';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { 
      email, 
      password, 
      name,
      companyName,
      companyType,
      phone,
      address,
      city,
      country
    } = await req.json();

    // Validasyon kontrolleri
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, şifre ve ad alanları zorunludur' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalı' },
        { status: 400 }
      );
    }

    // Email benzersizlik kontrolü
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      company: companyName,
      phone,
      address,
      city,
      country,
      role: 'user',
      companyType,
    });

    // Şifreyi çıkart ve kullanıcı bilgilerini döndür
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      company: user.company,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      role: user.role,
      companyType: user.companyType,
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Kayıt olurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 