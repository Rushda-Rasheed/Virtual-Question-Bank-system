import { useContext, useState } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { handleLogin } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleLogin({ email, password });
      if (response.success) {
        router.push("/user/dashboard");
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error logging in", error);
    }
  };
  return (
    <div className="bg-gray-50 font-[sans-serif] min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <div className="max-w-md w-full">
        <div className="p-8 rounded-2xl bg-white shadow">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.svg"
              alt="Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          {isError && (
            <div className="p-2 mb-4 mt-4 bg-red-100 text-sm text-red-700 border border-red-300 rounded">
              Invalid Email address or Password.
            </div>
          )}

          <h2 className="text-gray-800 text-center text-2xl font-bold">
            Sign in
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="text-gray-800 text-sm mb-2 block"
              >
                Email address
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-gray-800 text-sm mb-2 block"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-3 block text-sm text-gray-800"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Sign in
              </button>
            </div>
            <p className="text-gray-800 text-sm !mt-8 text-center">
              Don't have an account?
              <a
                href="/register"
                className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
              >
                Signup here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
