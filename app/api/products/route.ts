import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isPromotion = searchParams.get('isPromotion');
    const isPack = searchParams.get('isPack');
    const limit = searchParams.get('limit');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (isPromotion === 'true') {
      filter.isPromotion = true;
    }

    if (isPack === 'true') {
      filter.isPack = true;
    }

    let query = Product.find(filter).populate('categoryId').sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const products = await query;
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
}
