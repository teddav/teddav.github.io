"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 text-xl font-semibold text-gray-900 hover:text-gray-700">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                <Image src="/img/logo.png" alt="teddav" width={32} height={32} className="rounded-full" />
              </div>
              <span className="text-xl font-semibold text-gray-900 hover:text-gray-700">teddav</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 hover:underline px-3 py-2 rounded-md text-base font-medium transition-all duration-150 active:scale-95"
            >
              Home
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-700 hover:text-gray-900 hover:underline px-3 py-2 rounded-md text-base font-medium transition-all duration-150 active:scale-95"
            >
              Portfolio
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-gray-900 hover:underline px-3 py-2 rounded-md text-base font-medium transition-all duration-150 active:scale-95"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
