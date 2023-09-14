"use server";

import { redirect } from "next/navigation";

export const handleSubmitFilter = async (data: FormData) => {
  "use server";
  const filters: string[] = [];
  data.forEach((value, key) => {
    if (key.includes("filters")) {
      if (value === "on") {
        filters.push(key.split(":")[1]);
      }
    }
  });
  if (filters.length > 0) {
    redirect(`/browse?filters=${filters.join(",")}`);
  }
  redirect(`/browse`);
};
