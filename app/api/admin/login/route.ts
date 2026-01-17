import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Find admin with password field included
    const admin = await Admin.findOne({ email, isActive: true }).select('+password');

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return admin data (without password)
    return NextResponse.json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
