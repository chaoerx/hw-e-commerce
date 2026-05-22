import {
  Alert,
  Button,
  Card,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      navigate("/");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string })?.message ??
            "Invalid username or password")
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Login
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert color="red" title="Login failed">
                {error}
              </Alert>
            )}

            <TextInput
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
            />

            <Button type="submit" loading={isSubmitting} fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
