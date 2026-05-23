import { Box, Card, SimpleGrid, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const CATEGORY_STYLES: Record<string, { emoji: string; gradient: string }> = {
  beauty: { emoji: "💄", gradient: "#f783ac, #ff8787" },
  fragrances: { emoji: "🌸", gradient: "#da77f2, #9775fa" },
  furniture: { emoji: "🛋️", gradient: "#748ffc, #4dabf7" },
  groceries: { emoji: "🛒", gradient: "#69db7c, #40c057" },
  "home-decoration": { emoji: "🏠", gradient: "#ffd43b, #fab005" },
  laptops: { emoji: "💻", gradient: "#4dabf7, #228be6" },
  smartphones: { emoji: "📱", gradient: "#38d9a9, #20c997" },
  "mens-shirts": { emoji: "👔", gradient: "#868e96, #495057" },
  "womens-dresses": { emoji: "👗", gradient: "#f06595, #e64980" },
  sunglasses: { emoji: "🕶️", gradient: "#15aabf, #1098ad" },
};

const defaultStyle = { emoji: "🏷️", gradient: "#868e96, #495057" };

const formatCategory = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

interface CategoryCardsProps {
  categories?: string[];
}

export const CategoryCards = ({ categories = [] }: CategoryCardsProps) => {
  const displayCategories = categories.slice(0, 8);

  if (displayCategories.length === 0) return null;

  return (
    <Box mb="xl">
      <Title order={2} mb="md">
        Shop by Category
      </Title>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
        {displayCategories.map((category) => {
          const style = CATEGORY_STYLES[category] ?? defaultStyle;

          return (
            <Card
              key={category}
              component={Link}
              to={`/products?category=${category}`}
              padding="lg"
              radius="md"
              shadow="sm"
              withBorder
              style={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                background: `linear-gradient(135deg, ${style.gradient})`,
                minHeight: 120,
              }}
            >
              <Text size="2rem" mb="xs">
                {style.emoji}
              </Text>
              <Text fw={600} c="white" lineClamp={2}>
                {formatCategory(category)}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};
