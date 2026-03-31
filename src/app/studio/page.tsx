import dynamic from "next/dynamic";

const StudioClient = dynamic(
  () => import("@/components/studio/StudioClient").then((m) => ({ default: m.StudioClient })),
  { ssr: false }
);

export default function StudioPage() {
  return <StudioClient />;
}
