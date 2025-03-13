
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const { profileUserDetails, updateProfile } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetails = await profileUserDetails();
        if (userDetails) {
          setFullName(userDetails.fullName || "");
          setUserName(userDetails.userName || "");
          setEmail(userDetails.email || "");
          setPhoneNumber(userDetails.phoneNumber || "");
          setProfileImage(userDetails.profileImage || null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, [profileUserDetails]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updatedDetails = {
      fullName,
      userName,
      email,
      phoneNumber,
      ...(password && { password }),
    };

    try {
      await updateProfile(updatedDetails);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Profile</h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            Edit Photo
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="userName" className="block text-gray-700">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter a new password (optional)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Confirm new password (optional)"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
