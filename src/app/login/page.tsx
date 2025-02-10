"use client";
import LoginForm from "@/src/components/ui/login-form";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header with the "Medium" logo */}
      <header className="flex gap-8 py-5 px-2 sm:px-12 md:px-16 lg:px-28 xl:px-44">
        <h1
          className="text-3xl font-extrabold text-gray-950 cursor-pointer z-10"
          onClick={() => router.push("./")}
        >
          Medium
        </h1>
      </header>
      {/* Form Section */}
      <div className="flex flex-1 items-center justify-center">
        <div className="-translate-y-10">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
