"use client";

import {useSelectedLayoutSegment} from "next/navigation";

export default function Signup() {
  const segments = useSelectedLayoutSegment();
  console.log({segments});
  return <div>Signup</div>;
}
