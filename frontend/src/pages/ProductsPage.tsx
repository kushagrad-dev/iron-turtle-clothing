import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem,
  Slider, Chip, IconButton, Drawer, useMediaQuery, useTheme, Skeleton, alpha,
  Pagination, Button,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../components/product/ProductCard';
import { useProducts, useCategories } from '../hooks/useQueries';

const ProductsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 20000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as 'asc' | 'desc') || 'desc');
  const [page, setPage] = useState(1);

  const activeCategory = searchParams.get('category') || '';
  const { data: categories } = useCategories();

  const filters = useMemo(() => ({
    category: activeCategory,
    min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
    max_price: priceRange[1] < 20000 ? priceRange[1] : undefined,
    sort: sortBy,
    order: sortOrder,
    page,
    limit: 12,
  }), [activeCategory, priceRange, sortBy, sortOrder, page]);

  const { data, isLoading } = useProducts(filters);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const FilterContent = (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Filters</Typography>
        {isMobile && (
          <IconButton onClick={() => setFilterOpen(false)}><Close /></IconButton>
        )}
      </Box>

      {/* Categories */}
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
        Category
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        <Chip
          label="All"
          onClick={() => handleCategoryChange('')}
          variant={activeCategory === '' ? 'filled' : 'outlined'}
          sx={{ fontFamily: '"Oswald", sans-serif' }}
        />
        {categories?.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.name}
            onClick={() => handleCategoryChange(cat.slug)}
            variant={activeCategory === cat.slug ? 'filled' : 'outlined'}
            sx={{ fontFamily: '"Oswald", sans-serif' }}
          />
        ))}
      </Box>

      {/* Price Range */}
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
        Price Range
      </Typography>
      <Slider
        value={priceRange}
        onChange={(_, value) => setPriceRange(value as number[])}
        onChangeCommitted={() => setPage(1)}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `₹${v}`}
        min={0}
        max={20000}
        sx={{ mb: 1, color: 'primary.main' }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="caption" color="text.secondary">₹{priceRange[0]}</Typography>
        <Typography variant="caption" color="text.secondary">₹{priceRange[1]}</Typography>
      </Box>

      {/* Sort */}
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
        Sort By
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
        >
          <MenuItem value="created_at">Newest</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth size="small">
        <Select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc'); setPage(1); }}
        >
          <MenuItem value="desc">High to Low</MenuItem>
          <MenuItem value="asc">Low to High</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>
              {activeCategory
                ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection`
                : 'All Products'
              }
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {data?.total || 0} products
            </Typography>
          </motion.div>
        </Box>

        {/* Mobile filter button */}
        {isMobile && (
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            size="small"
            onClick={() => setFilterOpen(true)}
            sx={{ mb: 3 }}
          >
            Filters
          </Button>
        )}

        <Grid container spacing={3}>
          {/* Sidebar (Desktop) */}
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <Box sx={{
                position: 'sticky',
                top: 90,
                background: alpha('#141414', 0.8),
                borderRadius: 3,
                border: `1px solid ${alpha('#fff', 0.06)}`,
              }}>
                {FilterContent}
              </Box>
            </Grid>
          )}

          {/* Mobile filter drawer */}
          {isMobile && (
            <Drawer
              anchor="left"
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              PaperProps={{ sx: { width: 300 } }}
            >
              {FilterContent}
            </Drawer>
          )}

          {/* Products Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={2}>
              {isLoading
                ? Array(8).fill(0).map((_, i) => (
                  <Grid size={{ xs: 6, sm: 4, md: 4 }} key={i}>
                    <Skeleton variant="rectangular" sx={{ borderRadius: 3, paddingTop: '150%' }} />
                  </Grid>
                ))
                : data?.products?.map((product) => (
                  <Grid size={{ xs: 6, sm: 4, md: 4 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))
              }
            </Grid>

            {/* No results */}
            {!isLoading && data?.products?.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h5" color="text.secondary">No products found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your filters
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={(_, value) => { setPage(value); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductsPage;
