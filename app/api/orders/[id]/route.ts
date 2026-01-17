import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    // Récupérer la commande actuelle pour vérifier le changement de statut
    const currentOrder = await Order.findById(id);
    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    const previousStatus = currentOrder.status;
    const newStatus = body.status;

    // Si la commande est annulée, restaurer le stock
    if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of currentOrder.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: item.quantity } }
        );
      }
      console.log(`Stock restauré pour commande annulée: ${id}`);
    }

    // Si une commande annulée est réactivée, décrémenter le stock à nouveau
    if (previousStatus === 'cancelled' && newStatus !== 'cancelled') {
      // Vérifier d'abord le stock disponible
      const stockErrors: string[] = [];
      for (const item of currentOrder.items) {
        const product = await Product.findById(item.productId);
        if (product && product.stock < item.quantity) {
          stockErrors.push(`Stock insuffisant pour "${item.name}"`);
        }
      }

      if (stockErrors.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Impossible de réactiver: ' + stockErrors.join('. ') },
          { status: 400 }
        );
      }

      // Décrémenter le stock
      for (const item of currentOrder.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}
