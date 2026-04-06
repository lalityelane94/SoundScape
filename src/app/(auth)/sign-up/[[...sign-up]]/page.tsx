import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main style={{ background: "#0A0A0F", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignUp />
    </main>
  );
}
