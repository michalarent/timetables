import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Profile({ pageProps, Component }: AppProps) {
  const AuthComponent = withPageAuthRequired(Component as any, {});

  return (
    <UserProvider>
      <AuthComponent {...pageProps} />
    </UserProvider>
  );
}
