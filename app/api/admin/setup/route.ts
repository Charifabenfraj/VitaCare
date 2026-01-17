import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

// Script to create default admin user
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { secretKey } = await request.json();
    
    // Simple security check - in production, use a proper secret
    if (secretKey !== 'parapharma-setup-2024') {
      return NextResponse.json(
        { success: false, error: 'Clé de sécurité invalide' },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@parapharma.com' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin existe déjà',
        data: {
          email: existingAdmin.email,
          name: existingAdmin.name,
        },
      });
    }

    // Create default admin
    const admin = await Admin.create({
      email: 'admin@parapharma.com',
      password: 'admin123',
      name: 'Administrateur',
      role: 'superadmin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin créé avec succès',
      data: {
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de l\'admin' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    return NextResponse.json({
      success: true,
      hasAdmin: adminCount > 0,
      count: adminCount,
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
