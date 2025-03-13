import { Inter } from "next/font/google";
import "../pages/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className+ ' check-class'}>{children}</body>
    </html>
  );
}
