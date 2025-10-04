import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cozl-Maidl Family Tree",
  description: "Explore the Cozl and Maidl family genealogy from Kolovec, Czech Republic",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <header className="bg-white shadow-md border-b-4 border-blue-600 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                  🌳
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition">
                    Cozl-Maidl Family
                  </h1>
                  <p className="text-xs text-gray-500">Kolovec, Czech Republic</p>
                </div>
              </Link>
              <nav className="hidden md:flex space-x-2">
                <Link
                  href="/"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                >
                  📋 All Members
                </Link>
                <Link
                  href="/#statistics"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium"
                >
                  📊 Statistics
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-300 mb-2">&copy; 2025 Cozl-Maidl Family Tree</p>
            <p className="text-sm text-gray-400">Tracing the history of the Cozl and Maidl families from Kolovec, Czech Republic</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
