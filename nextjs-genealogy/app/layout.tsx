import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Genealogy",
  description: "Explore our family tree and genealogy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold text-center mb-2">Family Genealogy</h1>
            <nav className="flex justify-center space-x-4 mt-4">
              <a href="/" className="px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-600 transition">
                Home
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center py-6 mt-12">
          <p>&copy; 2025 Family Genealogy</p>
        </footer>
      </body>
    </html>
  );
}
