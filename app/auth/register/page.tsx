"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      router.push("/admin/dashboard/article");
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center h-screen items-center">
        <div className="border p-5 rounded-2xl border-slate-400">
          <div className="font-bold text-xl">Register</div>
          <p>Buat akun baru</p>
          <p className="text-slate-700 mt-4">Username:</p>
          <input
            className="border rounded-xl border-slate-400 px-2"
            value={username}
            type="text"
            size={30}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-slate-700">Password:</p>
          <input
            className="border rounded-xl border-slate-400 px-2"
            value={password}
            type="text"
            size={30}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />

          <div className="justify-around mt-5">
            <div className="flex justify-center mt-2">
              <div
                className={`bg-slate-200 px-4 py-1 rounded-xl border border-slate-300 hover:bg-slate-300 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => !isLoading && handleRegister()}
              >
                {isLoading ? "Loading..." : "Register"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
