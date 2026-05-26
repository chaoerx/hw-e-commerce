import { Container, Grid, SimpleGrid, Text, Title } from "@mantine/core";
import axios from "axios";
import { useMemo } from "react";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { ProductCard } from "../components/ProductCard";
import { ProductSidebarFilters } from "../components/ProductSidebarFilters";
import { useCategories, useProducts } from "../hooks/useProductQueries";
import { useProductFilters } from "../hooks/useProductFilters";
import { hasDiscount } from "../utils/productPrice";

const Products = () => {
  const { ui, apiFilters, setFilters, clearFilters } = useProductFilters();
  const { data, isLoading, isError, error } = useProducts(apiFilters);
  const { data: categories } = useCategories();

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    const activeMinRating =
      ui.ratings.length > 0 ? Math.max(...ui.ratings) : undefined;

    const products = data.products
      .filter((p) => {
        if (p.price < ui.minPrice || p.price > ui.maxPrice) return false;
        if (activeMinRating !== undefined && p.rating < activeMinRating)
          return false;
        if (ui.onSale && !hasDiscount(p)) return false;
        return true;
      })
      .slice();

    // Client-side sorting (works even when backend doesn't support sort for some endpoints).
    switch (ui.sort) {
      case "price_asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "title_asc":
        products.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        products.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "relevance":
      default:
        break;
    }

    return products;
  }, [data, ui.maxPrice, ui.minPrice, ui.onSale, ui.ratings, ui.sort]);

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        {ui.category
          ? ui.category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Our Products"}
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <ProductSidebarFilters
            categories={categories}
            selectedCategory={ui.category}
            onCategoryChange={(category) => setFilters({ category })}
            minPrice={ui.minPrice}
            maxPrice={ui.maxPrice}
            onPriceChange={(minPrice, maxPrice) =>
              setFilters({ minPrice, maxPrice })
            }
            ratings={ui.ratings}
            onRatingsChange={(ratings) => setFilters({ ratings })}
            onSale={ui.onSale}
            onSaleChange={(onSale) => setFilters({ onSale })}
            sort={ui.sort}
            onSortChange={(sort) => setFilters({ sort })}
            onClear={clearFilters}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 9 }}>
          {isLoading && <Spinner />}

          {isError && (
            <ErrorMessage
              message={
                axios.isAxiosError(error)
                  ? (error.response?.data as { message?: string })?.message ??
                    error.message
                  : error instanceof Error
                    ? error.message
                    : "Failed to load products"
              }
            />
          )}

          {data && (
            <>
              <Text size="sm" c="dimmed" mb="md">
                Showing {filteredProducts.length} products
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </SimpleGrid>
            </>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Products;
