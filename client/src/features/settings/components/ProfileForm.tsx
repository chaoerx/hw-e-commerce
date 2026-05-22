import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema";
import type { UserProfile } from "../types/user.types";

interface ProfileFormProps {
  user: UserProfile;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isSubmitting: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

const toFormValues = (user: UserProfile): ProfileFormValues => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone ?? "",
  gender: user.gender === "male" ||user.gender === "female" ? user.gender : "male",
});

export const ProfileForm = ({
  user,
  onSubmit,
  isSubmitting,
  successMessage,
  errorMessage,
}: ProfileFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: toFormValues(user),
  });

  useEffect(() => {
    reset(toFormValues(user));
  }, [user, reset]);

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Group>
            <Avatar src={user.image} alt={user.username} size="lg" radius="xl" />
            <Stack gap={2}>
              <Text fw={600} size="lg">
                {user.firstName} {user.lastName}
              </Text>
              <Text size="sm" c="dimmed">
                @{user.username}
              </Text>
            </Stack>
          </Group>

          {successMessage && (
            <Alert color="green" title="Profile updated">
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert color="red" title="Update failed">
              {errorMessage}
            </Alert>
          )}

          <Group grow align="flex-start">
            <TextInput
              label="First name"
              placeholder="Emily"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <TextInput
              label="Last name"
              placeholder="Johnson"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </Group>

          <TextInput
            label="Email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <TextInput
            label="Phone"
            placeholder="+1 555-0100"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select
                label="Gender"
                placeholder="Select gender"
                data={genderOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.gender?.message}
              />
            )}
          />

          <TextInput
            label="Username"
            value={user.username}
            disabled
            description="Username cannot be changed"
          />

          <Group justify="flex-end">
            <Button
              type="button"
              variant="default"
              disabled={!isDirty || isSubmitting}
              onClick={() => reset(toFormValues(user))}
            >
              Reset
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
              Save changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
