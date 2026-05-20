import { ActionIcon } from '@mantine/core';
import { IconMoon } from '@tabler/icons-react';

export const ThemeToggler = () => {
  return (
    <ActionIcon
      variant="subtle"
      color="blue"
      size="lg"
      radius="md"
      aria-label="Toggle color scheme"
    >
      <IconMoon size={20} stroke={1.5} />
    </ActionIcon>
  );
};
