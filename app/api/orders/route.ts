import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const { customerName, email, address, phone, items, totalPrice, city, paymentMethod } = body;

    if (!customerName || !email || !address || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Vérifier le stock de chaque produit avant de créer la commande
    const stockErrors: string[] = [];
    for (const item of items) {
      const product = await Product.findById(item.productId || item._id);
      if (!product) {
        stockErrors.push(`Produit "${item.name}" non trouvé`);
        continue;
      }
      if (product.stock < item.quantity) {
        stockErrors.push(`Stock insuffisant pour "${item.name}" (disponible: ${product.stock}, demandé: ${item.quantity})`);
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: stockErrors.join('. ') },
        { status: 400 }
      );
    }

    // Décrémenter le stock de chaque produit
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId || item._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      customerName,
      email,
      address,
      city: city || '',
      phone,
      items,
      totalPrice,
      paymentMethod: paymentMethod || 'cash',
      status: 'pending',
    });

    // Here you could add email notification logic
    console.log(`New order created: ${order._id} for ${email}`);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    );
  }
}
