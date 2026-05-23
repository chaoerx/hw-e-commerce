import { Anchor, Box, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../ui/ErrorMessage";
import { Spinner } from "../ui/Spinner";
import { ProductCard } from "../../features/products/components/ProductCard";
import { useProducts } from "../../features/products/hooks/useProductQueries";

export const FeaturedProducts = () => {
  const { data, isLoading, isError } = useProducts({ limit: 8 });

  return (
    <Box mb="xl">
      <Group justify="space-between" mb="md">
        <Title order={2}>Featured Products</Title>
        <Anchor component={Link} to="/products" size="sm" fw={500}>
          View all →
        </Anchor>
      </Group>

      {isLoading && <Spinner />}

      {isError && <ErrorMessage message="Failed to load featured products" />}

      {data && (
        <>
          <Text size="sm" c="dimmed" mb="md">
            Hand-picked favorites from our catalog
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Box>
  );
};
