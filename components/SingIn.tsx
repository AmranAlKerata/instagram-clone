import { signIn } from "@/auth";

export default function SingIn(): React.ReactNode {
  return (
    <div className="login text-end text-blue-500">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
    </div>
  );
}
