import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col px-2 pt-24">
        <p>Hello World</p>
      </main>
    </>
  );
}
