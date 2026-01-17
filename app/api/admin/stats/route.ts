import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    // Get total counts
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get orders by status
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    // Calculate total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Get products on promotion
    const promotionProducts = await Product.countDocuments({ isPromotion: true });
    const packProducts = await Product.countDocuments({ isPack: true });

    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    // Get best sellers (products that appear most in orders)
    const orderItems = orders.flatMap((order) => order.items);
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    orderItems.forEach((item) => {
      const id = item.productId.toString();
      if (!productSales[id]) {
        productSales[id] = { name: item.name, quantity: 0, revenue: 0 };
      }
      productSales[id].quantity += item.quantity;
      productSales[id].revenue += item.price * item.quantity;
    });

    const bestSellers = Object.entries(productSales)
      .map(([id, data]) => ({ productId: id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 20 } })
      .select('name stock image')
      .sort({ stock: 1 })
      .limit(5);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyOrders = await Order.find({
      createdAt: { $gte: sixMonthsAgo },
    });

    const monthlyRevenue: { [key: string]: number } = {};
    monthlyOrders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString('fr-FR', { month: 'short', year: '2-digit' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalPrice;
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          promotionProducts,
          packProducts,
        },
        ordersByStatus: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
        },
        recentOrders,
        bestSellers,
        lowStockProducts,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
