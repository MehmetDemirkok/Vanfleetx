import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { User } from '@/models/User';
import { Company } from '@/models/Company';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      companyName,
      companyType,
      phone,
      address,
    } = body;

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      type: companyType,
      address,
      phone,
      email,
    });

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: companyType === 'LOGISTICS' ? 'LOGISTICS_COMPANY' : 'TRANSPORT_COMPANY',
      company: company._id,
    });

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 