import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    // Signed-in users go to dashboard route to avoid self-looping '/' redirect
    redirect("/dashboard");
  }

  // Not signed-in users go to the Clerk sign-in flow
  redirect("/sign-in");
}
