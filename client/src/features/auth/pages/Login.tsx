import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Anchor,
  Button,
  Card,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login.schema";
import { getAuthErrorMessage } from "../utils/authErrors";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const redirectTo =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);

    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err, "Login failed. Please try again."));
    }
  };

  return (
    <Container size="xs" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Title order={2} mb="md" ta="center">
          Login
        </Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            {error && (
              <Alert color="red" title="Login failed" withCloseButton onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextInput
              label="Username"
              placeholder="emilys"
              error={errors.username?.message}
              {...register("username")}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Text size="xs" c="dimmed">
              Test account: emilys / emilyspass
            </Text>

            <Button type="submit" loading={isSubmitting} fullWidth>
              Sign in
            </Button>

            <Text size="sm" ta="center" c="dimmed">
              Don&apos;t have an account?{" "}
              <Anchor component={Link} to="/signup" fw={500}>
                Sign up
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
