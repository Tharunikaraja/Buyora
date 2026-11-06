const { getProductById } = require('../services/productService');
const { supabase, isConfigured } = require('../config/db');

const createOrderFromCart = async (req, res) => {
  const { shippingAddress, items } = req.body;
  const userId = req.user.id;
  if (!req.app.locals.orders) req.app.locals.orders = [];

  const orderItems = [];
  for (const item of items || []) {
    const product = await getProductById(item.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
    }
    if (product.stock < Number(item.quantity || 0)) {
      return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}.` });
    }
    orderItems.push({
      productId: product.productId,
      name: product.name,
      quantity: Number(item.quantity || 1),
      price: Number(product.discountPrice || product.price),
      image: product.images?.[0],
    });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 20000 ? 0 : 299;
  const total = subtotal + deliveryFee;

  if (isConfigured && supabase) {
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_id: `ORD-${Date.now()}`,
          user_id: Number(userId),
          subtotal,
          delivery_fee: deliveryFee,
          total,
          order_status: 'Placed',
          payment_status: 'CREATED',
          shipping_name: shippingAddress?.fullName || req.user.fullName || 'BUYVERSE Customer',
          shipping_phone: shippingAddress?.phone || '',
          shipping_email: shippingAddress?.email || req.user.email || '',
          shipping_address: shippingAddress || { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase order insert failed:', orderError.message);
      return res.status(500).json({ success: false, message: 'Unable to save order to database.' });
    }

    for (const item of orderItems) {
      const { data: productRow } = await supabase
        .from('products')
        .select('id')
        .eq('product_id', item.productId)
        .maybeSingle();

      if (productRow) {
        await supabase.from('order_items').insert([
          {
            order_id: orderRow.id,
            product_id: productRow.id,
            quantity: item.quantity,
            unit_price: item.price,
          },
        ]);
      }
    }

    const order = {
      id: orderRow.order_id,
      userId,
      items: orderItems,
      shippingAddress: shippingAddress || { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      subtotal,
      deliveryFee,
      total,
      status: 'Placed',
      paymentStatus: 'CREATED',
      createdAt: orderRow.created_at,
    };

    req.app.locals.orders.push(order);
    return res.status(201).json({ success: true, order, message: 'Order created successfully.' });
  }

  const order = {
    id: `ORD-${Date.now()}`,
    userId,
    items: orderItems,
    shippingAddress: shippingAddress || { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    subtotal,
    deliveryFee,
    total,
    status: 'Placed',
    paymentStatus: 'CREATED',
    createdAt: new Date().toISOString(),
    payment: {
      status: 'CREATED',
      method: 'PayPal Sandbox',
      paypalOrderId: `PAYPAL-${Date.now()}`,
      captureId: null,
      amount: total,
      currency: 'INR'
    }
  };

  req.app.locals.orders.push(order);
  return res.status(201).json({ success: true, order, message: 'Order created successfully.' });
};

const getOrders = async (req, res) => {
  const userId = req.user.id;

  if (isConfigured && supabase) {
    const { data: orderRows } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', Number(userId))
      .order('created_at', { ascending: false });

    return res.json({ success: true, orders: (orderRows || []).map((entry) => ({
      id: entry.order_id,
      userId: entry.user_id,
      subtotal: entry.subtotal,
      deliveryFee: entry.delivery_fee,
      total: entry.total,
      status: entry.order_status,
      paymentStatus: entry.payment_status,
      shippingAddress: entry.shipping_address || {},
      createdAt: entry.created_at,
    })) });
  }

  const orders = (req.app.locals.orders || []).filter((order) => order.userId === userId);
  return res.json({ success: true, orders });
};

const getOrderById = async (req, res) => {
  if (isConfigured && supabase) {
    const { data: orderRow } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', req.params.orderId)
      .maybeSingle();

    if (!orderRow) return res.status(404).json({ success: false, message: 'Order not found.' });

    return res.json({ success: true, order: {
      id: orderRow.order_id,
      userId: orderRow.user_id,
      subtotal: orderRow.subtotal,
      deliveryFee: orderRow.delivery_fee,
      total: orderRow.total,
      status: orderRow.order_status,
      paymentStatus: orderRow.payment_status,
      shippingAddress: orderRow.shipping_address || {},
      createdAt: orderRow.created_at,
    } });
  }

  const order = (req.app.locals.orders || []).find((entry) => entry.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
  return res.json({ success: true, order });
};

module.exports = { createOrderFromCart, getOrders, getOrderById };
