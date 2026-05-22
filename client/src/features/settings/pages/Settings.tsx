import { Button, Container, Stack, Text, Title } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/context/AuthContext";
import { ProfileForm } from "../components/ProfileForm";
import { useUpdateUser, useUser } from "../hooks/useUserQueries";
import type { ProfileFormValues } from "../schemas/profile.schema";

const Settings = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: user, isLoading, isError, error } = useUser(authUser?.id ?? 0);
  const updateUser = useUpdateUser(authUser?.id ?? 0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: ProfileFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateUser.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        gender: values.gender,
      });
      setSuccessMessage("Your profile has been updated successfully.");
    } catch (err) {
      setErrorMessage(
        axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string })?.message ??
            "Failed to update profile. Please try again.")
          : "Failed to update profile. Please try again.",
      );
    }
  };

  if (authLoading || isLoading) {
    return (
      <Container size="md" py="xl">
        <Spinner />
      </Container>
    );
  }

  if (!isAuthenticated || !authUser) {
    return (
      <Container size="md" py="xl">
        <Title order={1} mb="md">
          Settings
        </Title>
        <Text mb="md">Please log in to manage your profile.</Text>
        <Button component={Link} to="/login">
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1}>Settings</Title>
        <Text c="dimmed">View and update your account profile.</Text>

        {isError && (
          <ErrorMessage
            message={
              axios.isAxiosError(error)
                ? error.message
                : "Failed to load profile"
            }
          />
        )}

        {user && (
          <ProfileForm
            user={user}
            onSubmit={handleSubmit}
            isSubmitting={updateUser.isPending}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        )}
      </Stack>
    </Container>
  );
};

export default Settings;
