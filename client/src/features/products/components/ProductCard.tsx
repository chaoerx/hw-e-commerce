import { Badge, Box, Card, Group, Image, Text } from "@mantine/core";
import { IconStarFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Product } from "../types/product.types";
import { getDiscountedPrice, hasDiscount } from "../utils/productPrice";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const onSale = hasDiscount(product);
  const discountedPrice = getDiscountedPrice(product);

  return (
    <Card
      component={Link}
      to={`/products/${product.id}`}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      h="100%"
      style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
    >
      <Card.Section>
        <Image
          src={product.thumbnail}
          height={160}
          alt={product.title}
        />
      </Card.Section>

      <Text fw={500} lineClamp={2} mt="md" mb="xs">
        {product.title}
      </Text>

      <Group justify="space-between" align="flex-end" mb="xs">
        <Box>
          {onSale ? (
            <Group gap="xs" align="baseline">
              <Text size="xl" fw={700} c="blue">
                ${discountedPrice.toFixed(2)}
              </Text>
              <Text size="sm" c="dimmed" td="line-through">
                ${product.price.toFixed(2)}
              </Text>
            </Group>
          ) : (
            <Text size="xl" fw={700} c="blue">
              ${product.price.toFixed(2)}
            </Text>
          )}
        </Box>
        {onSale && (
          <Badge color="red" variant="filled">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </Group>

      <Group gap={4}>
        <IconStarFilled size={14} color="#ffd43b" />
        <Text size="sm" c="dimmed">
          {product.rating.toFixed(1)}
        </Text>
        <Text size="sm" c="dimmed">
          • {product.stock} in stock
        </Text>
      </Group>
    </Card>
  );
};
