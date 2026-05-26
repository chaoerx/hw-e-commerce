import {
  Box,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  RangeSlider,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import type { ProductSortOption } from '../types/product.types';

const RATINGS = [4, 3, 2, 1];

interface ProductSidebarFiltersProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange: (category?: string) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
  ratings: number[];
  onRatingsChange: (ratings: number[]) => void;
  onSale: boolean;
  onSaleChange: (onSale: boolean) => void;
  sort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  onClear: () => void;
}
export const ProductSidebarFilters = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  ratings,
  onRatingsChange,
  onSale,
  onSaleChange,
  sort,
  onSortChange,
  onClear,
}: ProductSidebarFiltersProps) => {
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories
      .filter((category): category is string => typeof category === "string")
      .map((category) => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
      })),
  ];

  const sortOptions: { value: ProductSortOption; label: string }[] = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
    { value: "rating_desc", label: "Rating" },
    { value: "title_asc", label: "Title: A → Z" },
    { value: "title_desc", label: "Title: Z → A" },
  ];

  const toggleRating = (rating: number) => {
    if (ratings.includes(rating)) {
      onRatingsChange(ratings.filter((r) => r !== rating));
      return;
    }
    onRatingsChange([...ratings, rating].sort((a, b) => b - a));
  };

  return (
    <Stack gap="md">
      <Box p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Stack gap="xl">
          <Stack gap="sm">
            <Title order={3}>Filters</Title>
          </Stack>

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Category
            </Text>
            <Select
              data={categoryOptions}
              placeholder="All Categories"
              searchable
              clearable
              value={selectedCategory ?? ""}
              onChange={(value) => onCategoryChange(value || undefined)}
            />
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Sort By
            </Text>
            <Select
              data={sortOptions}
              value={sort}
              onChange={(value) =>
                onSortChange((value as ProductSortOption) ?? "relevance")
              }
            />
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Price Range
            </Text>
            <RangeSlider
              min={0}
              max={2000}
              step={50}
              value={[minPrice, maxPrice]}
              onChange={(value) => onPriceChange(value[0], value[1])}
              marks={[
                { value: 0, label: '$0' },
                { value: 2000, label: '$2000' },
              ]}
              mb="md"
            />
            <Group grow>
              <NumberInput
                label="Min"
                value={minPrice}
                onChange={(value) => {
                  const next = typeof value === "number" ? value : minPrice;
                  onPriceChange(next, maxPrice);
                }}
                min={0}
                max={2000}
                prefix="$"
              />
              <NumberInput
                label="Max"
                value={maxPrice}
                onChange={(value) => {
                  const next = typeof value === "number" ? value : maxPrice;
                  onPriceChange(minPrice, next);
                }}
                min={0}
                max={2000}
                prefix="$"
              />
            </Group>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Rating
            </Text>
            <Stack gap="xs">
              {RATINGS.map((rating) => (
                <Group key={rating} gap="xs">
                  <Checkbox
                    checked={ratings.includes(rating)}
                    onChange={() => toggleRating(rating)}
                  />
                  <Group gap={2}>
                    {[...Array(rating)].map((_, i) => (
                      <IconStarFilled key={i} size={16} color="#ffd43b" />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <IconStar key={i} size={16} color="#868e96" />
                    ))}
                  </Group>
                  <Text size="sm">& up</Text>
                </Group>
              ))}
            </Stack>
          </Stack>

          <Divider />

          <Stack gap="sm">
            <Text fw={600} size="sm">
              Deals
            </Text>
            <Switch
              label="On Sale / Discounted"
              checked={onSale}
              onChange={(event) => onSaleChange(event.currentTarget.checked)}
            />
          </Stack>

          <Divider />

          <Group justify="flex-end">
            <Text
              size="sm"
              fw={600}
              style={{ cursor: "pointer" }}
              onClick={onClear}
            >
              Clear filters
            </Text>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
};
