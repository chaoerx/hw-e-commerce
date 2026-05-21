import { Container, Grid, SimpleGrid, Text, Title } from "@mantine/core";
import axios from "axios";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { ProductCard } from "../components/ProductCard";
import { ProductSidebarFilters } from "../components/ProductSidebarFilters";
import { useCategories, useProducts } from "../hooks/useProductQueries";

const Products = () => {
  const { data, isLoading, isError, error } = useProducts();
  const { data: categories } = useCategories();

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Our Products
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <ProductSidebarFilters categories={categories} />
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
                {data.total} products
              </Text>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {data.products.map((product) => (
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
