import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, TextField, Button, Divider, alpha, Stepper, Step, StepLabel,
} from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useCreateOrder } from '../hooks/useQueries';
import type { ShippingAddress } from '../types';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [activeStep, setActiveStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'US',
    phone: '',
  });

  const shippingCost = total >= 5000 ? 0 : 499;
  const grandTotal = total + shippingCost;

  const handleChange = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    const required: (keyof ShippingAddress)[] = ['full_name', 'address_line1', 'city', 'state', 'zip_code', 'phone'];
    const missing = required.filter(f => !address[f]);
    if (missing.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.product.images[0] || '',
      }));

      const order = await createOrder.mutateAsync({
        shipping_address: address,
        items: orderItems,
      });

      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <CheckCircle sx={{ fontSize: 100, color: 'primary.main', mb: 3 }} />
        </motion.div>
        <Typography variant="h2" sx={{ mb: 2, fontSize: '2.5rem' }}>Order Confirmed!</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Thank you for your purchase. Your order has been placed successfully.
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ mb: 4, fontWeight: 600 }}>
          Order ID: {orderId.slice(0, 8).toUpperCase()}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/orders')}>
            View Orders
          </Button>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>
          Checkout
        </Typography>

        <Grid container spacing={4}>
          {/* Shipping Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{
              p: 4,
              borderRadius: 3,
              background: alpha('#141414', 0.8),
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
            }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Shipping Information</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Full Name *" value={address.full_name} onChange={handleChange('full_name')} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Address Line 1 *" value={address.address_line1} onChange={handleChange('address_line1')} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Address Line 2" value={address.address_line2} onChange={handleChange('address_line2')} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="City *" value={address.city} onChange={handleChange('city')} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="State *" value={address.state} onChange={handleChange('state')} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="ZIP Code *" value={address.zip_code} onChange={handleChange('zip_code')} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone *" value={address.phone} onChange={handleChange('phone')} />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{
              p: 4,
              borderRadius: 3,
              background: alpha('#141414', 0.8),
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
              position: 'sticky',
              top: 90,
            }}>
              <Typography variant="h5" sx={{ mb: 3 }}>Order Summary</Typography>

              {items.map((item) => (
                <Box key={`${item.product_id}-${item.size}-${item.color}`} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box component="img" src={item.product.images[0]} sx={{ width: 56, height: 70, borderRadius: 1.5, objectFit: 'cover' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.product.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.size} · {item.color} · Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={600}>₹{total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight={600} color={shippingCost === 0 ? 'primary.main' : 'inherit'}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h5" color="primary.main" fontWeight={700}>
                  ₹{grandTotal.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                sx={{ py: 1.5 }}
                id="place-order-btn"
              >
                {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
