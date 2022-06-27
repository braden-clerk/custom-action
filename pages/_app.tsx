import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_KEY}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
