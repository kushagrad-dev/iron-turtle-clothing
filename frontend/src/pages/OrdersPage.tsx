import React from 'react';
import { Box, Container, Typography, Grid, Chip, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useOrders } from '../hooks/useQueries';
import { LocalShipping, CheckCircle, Schedule, Cancel } from '@mui/icons-material';

const statusConfig: Record<string, { color: string; icon: React.ReactElement }> = {
  pending: { color: '#ffd700', icon: <Schedule /> },
  confirmed: { color: '#00ff88', icon: <CheckCircle /> },
  processing: { color: '#2196f3', icon: <Schedule /> },
  shipped: { color: '#00bcd4', icon: <LocalShipping /> },
  delivered: { color: '#00ff88', icon: <CheckCircle /> },
  cancelled: { color: '#ff4d6a', icon: <Cancel /> },
};

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 4 }}>
          My Orders
        </Typography>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : orders?.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <LocalShipping sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
            <Typography variant="h4" color="text.secondary">No orders yet</Typography>
          </Box>
        ) : (
          orders?.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box sx={{
                p: { xs: 2.5, md: 4 },
                mb: 3,
                borderRadius: 3,
                background: alpha('#141414', 0.8),
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">ORDER ID</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                    <br />
                    <Chip
                      icon={statusConfig[order.status]?.icon}
                      label={order.status.toUpperCase()}
                      size="small"
                      sx={{
                        mt: 0.5,
                        color: statusConfig[order.status]?.color,
                        borderColor: statusConfig[order.status]?.color,
                        fontWeight: 700,
                      }}
                      variant="outlined"
                    />
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  {order.items.map((item: any, i: number) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 56, height: 70, borderRadius: 1.5, objectFit: 'cover' }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.size} · {item.color} · Qty: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight={600}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}` }}>
                  <Typography variant="h6" color="primary.main" fontWeight={700}>
                    Total: ₹{order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))
        )}
      </Container>
    </Box>
  );
};

export default OrdersPage;
