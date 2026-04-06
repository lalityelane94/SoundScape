import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignIn />
    </main>
  );
}
