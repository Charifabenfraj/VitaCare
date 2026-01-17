import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const category = await Category.create({
      ...body,
      slug,
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
