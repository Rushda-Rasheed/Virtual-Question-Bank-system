// import { useState } from "react";
// import axios from "axios";

// export default function Register() {
//   const [fullName, setFullName] = useState("");
//   const [userName, setUserName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }
//     const postData = {
//       fullName,
//       userName,
//       phoneNumber,
//       email,
//       password,
//       confirmPassword,
//     };

//     try {
//       const response = await axios.post("/api/register", postData);
//       if (response.data.success) {
//         alert("Registration successful");
//         router.push("/user/dashboard");
//       } else {
//         alert("Registration failed");
//       }
//     } catch (error) {
//       console.error("Error registering", error);
//     }
//   };

//   const handleImageChange = (e) => {
//     setProfileImage(e.target.files[0]);
//   };

//   return (
//     <div className="bg-gray-50 font-[sans-serif] min-h-screen flex flex-col items-center justify-center py-6 px-4">
//       <div className="max-w-md w-full">
//         <div className="p-8 rounded-2xl bg-white shadow">
//           <div className="flex justify-center mb-6">
//             <img
//               src="/images/logo.svg"
//               alt="Logo"
//               className="h-20 w-20 object-contain"
//             />
//           </div>
//           <h2 className="text-gray-800 text-center text-2xl font-bold">
//             Create Your Account
//           </h2>
//           <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Full Name
//               </label>
//               <input
//                 id="fullName"
//                 name="fullName"
//                 type="text"
//                 required
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Enter your full name"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="userName"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Username
//               </label>
//               <input
//                 id="userName"
//                 name="userName"
//                 type="text"
//                 required
//                 value={userName}
//                 onChange={(e) => setUserName(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Enter your username"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="phoneNumber"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Phone Number
//               </label>
//               <input
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 type="tel"
//                 required
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Enter your phone number"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Enter email address"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Enter password"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="confirm-password"
//                 className="text-gray-800 text-sm mb-2 block"
//               >
//                 Confirm Password
//               </label>
//               <input
//                 id="confirm-password"
//                 name="confirm-password"
//                 type="password"
//                 required
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
//                 placeholder="Confirm your password"
//               />
//             </div>

//             <div className="flex items-center">
//               <label
//                 htmlFor="login-link"
//                 className="ml-3 block text-sm text-gray-800"
//               >
//                 Already have an account?{" "}
//                 <a
//                   href="/login"
//                   className="text-blue-600 font-semibold hover:underline ml-1"
//                 >
//                   Sign in here
//                 </a>
//               </label>
//             </div>

//             <div className="!mt-12">
//               <button
//                 type="submit"
//                 className="w-full py-3 px-6 rounded-md bg-blue-500 hover:bg-blue-600 transition-all"
//               >
//                 <span className="text-white text-[15px]">Sign up</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import Axios from "@/utilities/Axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const postData = {
      fullName,
      userName,
      phoneNumber,
      email,
      password,
      confirmPassword,
    };

    try {
      const response = await Axios.post("/users/register", postData);

      if (response.data.success) {
        alert("Registration successful");
        router.push("/user/dashboard");
        localStorage.setItem("user", JSON.stringify({ email }));
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error registering", error);
      alert("An error occurred. Please try again.");
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
          <h2 className="text-gray-800 text-center text-2xl font-bold">
            Create Your Account
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="text-gray-800 text-sm mb-2 block"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="userName"
                className="text-gray-800 text-sm mb-2 block"
              >
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="text-gray-800 text-sm mb-2 block"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-gray-800 text-sm mb-2 block"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-gray-800 text-sm mb-2 block"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Enter password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="text-gray-800 text-sm mb-2 block"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="login-link"
                className="ml-3 block text-sm text-gray-800"
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-semibold hover:underline ml-1"
                >
                  Sign in here
                </a>
              </label>
            </div>

            <div className="!mt-12">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-md bg-blue-500 hover:bg-blue-600 transition-all"
              >
                <span className="text-white text-[15px]">Sign up</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
