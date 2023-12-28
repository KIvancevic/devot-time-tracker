import React from "react";
import dynamic from "next/dynamic";

const TrackersTable = dynamic(
  () => import("@/app/components/trackersTable/trackersTable")
);

function Page() {
  return (
    <div className="p-28">
      <TrackersTable />
    </div>
  );
}
export default Page;
