import HomePage from "@/features/posts/pages/HomePage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const initialTab = tab === "me" ? "me" : "all";
  return <HomePage key={initialTab} initialTab={initialTab} />;
}
