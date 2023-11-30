"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-bold underline mb-5">Login Terlebih dahulu</h1>

      <Link href={"/home"} className="font-bold mr-5">
        Home
      </Link>

      <button type="button" onClick={() => router.push("/home")}>
        Login
      </button>
    </div>
  );
}
