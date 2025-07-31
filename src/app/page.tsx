import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hi, I'm teddav</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          I write about cryptography, algebra, and the fascinating intersection of mathematics and technology. My articles explore complex
          topics like FRI, Reed-Solomon codes, and polynomial commitment schemes.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          I'm passionate about making complex cryptographic concepts accessible and understandable. Through my writing, I aim to bridge the
          gap between theoretical mathematics and practical applications in blockchain technology and zero-knowledge proofs.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Read My Articles
        </Link>
      </div>
    </div>
  );
}
