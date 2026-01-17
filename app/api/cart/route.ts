import { NextResponse } from 'next/server';

// This is a simple cart validation endpoint
// The actual cart state is managed on the client side using React Context

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Les items du panier sont requis' },
        { status: 400 }
      );
    }

    // Calculate total
    let total = 0;
    const validatedItems = items.map((item: { price: number; quantity: number; promotionPercentage?: number; isPromotion?: boolean }) => {
      const itemPrice = item.isPromotion && item.promotionPercentage
        ? item.price * (1 - item.promotionPercentage / 100)
        : item.price;
      const itemTotal = itemPrice * item.quantity;
      total += itemTotal;
      return {
        ...item,
        itemTotal,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: validatedItems,
        total: Math.round(total * 100) / 100,
        itemCount: items.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Error processing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors du traitement du panier' },
      { status: 500 }
    );
  }
}
