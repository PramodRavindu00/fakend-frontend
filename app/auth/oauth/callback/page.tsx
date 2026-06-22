import {
  AuthenticatingView,
  OAuthHandlerView,
} from "@/components/custom/oauth/OAuthCallbackViews";
import { Suspense } from "react";
interface Props {
  searchParams: Promise<{ error?: string; token: string }>;
}
const OAuthCallbackPage = async ({ searchParams }: Props) => {
  const { error, token } = await searchParams;
  return (
    <Suspense fallback={<AuthenticatingView />}>
      <OAuthHandlerView error={error ?? null} token={token ?? null} />
    </Suspense>
  );
};

export default OAuthCallbackPage;
