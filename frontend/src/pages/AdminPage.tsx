import React, { useState } from 'react';
import {
  Box, Container, Typography, Grid, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Chip, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, alpha, Tab, Tabs, Select, MenuItem,
  FormControl, InputLabel, Switch, FormControlLabel, Avatar,
} from '@mui/material';
import { Add, Edit, Delete, Inventory, ShoppingCart as OrderIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  useProducts, useCategories, useCreateProduct, useUpdateProduct,
  useDeleteProduct, useOrders, useUpdateOrderStatus,
} from '../hooks/useQueries';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, mb: 1 }}>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your products and orders
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4 }}>
          <Tab icon={<Inventory />} label="Products" iconPosition="start" sx={{ fontFamily: '"Oswald", sans-serif' }} />
          <Tab icon={<OrderIcon />} label="Orders" iconPosition="start" sx={{ fontFamily: '"Oswald", sans-serif' }} />
        </Tabs>

        {tab === 0 && <ProductsTab />}
        {tab === 1 && <OrdersTab />}
      </Container>
    </Box>
  );
};

// =================== PRODUCTS TAB ===================
const ProductsTab: React.FC = () => {
  const { data, isLoading } = useProducts({ limit: 50 });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', compare_at_price: '', category_id: '',
    images: '', sizes: 'S,M,L,XL,XXL', colors: '', stock: '', featured: false,
  });

  const resetForm = () => {
    setForm({
      name: '', description: '', price: '', compare_at_price: '', category_id: '',
      images: '', sizes: 'S,M,L,XL,XXL', colors: '', stock: '', featured: false,
    });
    setEditing(null);
  };

  const handleEdit = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      compare_at_price: product.compare_at_price ? String(product.compare_at_price) : '',
      category_id: product.category_id || '',
      images: product.images?.join(',') || '',
      sizes: product.sizes?.join(',') || '',
      colors: product.colors?.join(',') || '',
      stock: String(product.stock),
      featured: product.featured,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
        category_id: form.category_id || null,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
      };

      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, data: payload });
        toast.success('Product updated!');
      } else {
        await createProduct.mutateAsync(payload as any);
        toast.success('Product created!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{data?.total || 0} Products</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { resetForm(); setOpen(true); }}>
          Add Product
        </Button>
      </Box>

      <TableContainer sx={{
        borderRadius: 3,
        background: alpha('#141414', 0.8),
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.products?.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={product.images[0]}
                      variant="rounded"
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={product.category?.name || 'N/A'} size="small" />
                </TableCell>
                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={product.stock}
                    size="small"
                    color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{product.featured ? '⭐' : '—'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(product)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(product.id)} sx={{ color: '#ff4d6a' }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { background: '#1a1a1a' } }}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Compare At Price" type="number" value={form.compare_at_price} onChange={e => setForm({ ...form, compare_at_price: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={form.category_id} label="Category" onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  {categories?.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Image URLs (comma separated)" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Sizes (comma separated)" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Colors (comma separated)" value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControlLabel
                control={<Switch checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />}
                label="Featured"
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// =================== ORDERS TAB ===================
const OrdersTab: React.FC = () => {
  const { data: orders } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const statusColors: Record<string, string> = {
    pending: '#ffd700',
    confirmed: '#00ff88',
    processing: '#2196f3',
    shipped: '#00bcd4',
    delivered: '#00ff88',
    cancelled: '#ff4d6a',
  };

  return (
    <TableContainer sx={{
      borderRadius: 3,
      background: alpha('#141414', 0.8),
      border: (theme) => `1px solid ${alpha(theme.palette.divider, 1)}`,
    }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  #{order.id.slice(0, 8).toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell>
                <Typography fontWeight={600} color="primary.main">
                  ₹{order.total.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status.toUpperCase()}
                  size="small"
                  sx={{ color: statusColors[order.status], borderColor: statusColors[order.status], fontWeight: 700 }}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <FormControl size="small" sx={{ minWidth: 130 }}>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                  >
                    {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                      <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminPage;
