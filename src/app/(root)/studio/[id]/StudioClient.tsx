"use client";

import dynamic from "next/dynamic";

const Sequencer = dynamic(() => import("@/components/sequencer/Sequencer"), { ssr: false });

export default function StudioClient({ projectId }: { projectId: string }) {
  return <Sequencer projectId={projectId} />;
}
