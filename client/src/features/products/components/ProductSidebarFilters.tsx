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

const RATINGS = [4, 3, 2, 1];

export const ProductSidebarFilters = () => {
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
              data={[{ value: '', label: 'All Categories' }]}
              placeholder="All Categories"
              searchable
              clearable
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
              value={[0, 2000]}
              marks={[
                { value: 0, label: '$0' },
                { value: 2000, label: '$2000' },
              ]}
              mb="md"
            />
            <Group grow>
              <NumberInput
                label="Min"
                value={0}
                min={0}
                max={2000}
                prefix="$"
              />
              <NumberInput
                label="Max"
                value={2000}
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
                  <Checkbox checked={false} />
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
            <Switch label="On Sale / Discounted" checked={false} />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
