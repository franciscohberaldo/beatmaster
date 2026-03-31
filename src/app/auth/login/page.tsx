import dynamic from "next/dynamic";

const LoginClient = dynamic(
  () => import("@/components/auth/LoginClient").then((m) => ({ default: m.LoginClient })),
  { ssr: false }
);

export default function LoginPage() {
  return <LoginClient />;
}
