import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">teddav</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Exploring the fascinating world of zero-knowledge proofs, cryptography, and privacy-preserving technologies.
        </p>
      </div>

      {/* About & Contact */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">About & Contact</h2>

        <p className="text-gray-700 mb-4">
          I&apos;m passionate about zero-knowledge proofs, cryptography, and building privacy-preserving applications.
          <br />
          My work focuses on exploring the boundaries of what&apos;s possible with modern cryptographic techniques.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href="https://github.com/teddav"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            @teddav
          </a>
          <a
            href="https://twitter.com/0xteddav"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            @0xteddav
          </a>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Writings</h2>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600">Explore my latest thoughts on cryptography, algebra, and zero-knowledge proofs.</p>
          <div className="mt-4">
            <Link href="/blog" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Projects & Tooling */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Projects & Tooling</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/teddav/zk-tenant"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                zk-tenant
              </a>
            </h3>
            <p className="text-gray-700 mb-3">
              Privacy-preserving housing application using{" "}
              <a
                href="https://ants.gouv.fr/nos-missions/les-solutions-numeriques/2d-doc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                2D-Doc
              </a>
            </p>
            <div className="flex gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Privacy</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Housing</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Noir</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/teddav/co-match.noir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                co-match
              </a>
            </h3>
            <p className="text-gray-700 mb-3">Secure MPC matching via TACEO&apos;s co-snarks</p>
            <div className="flex gap-2">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">MPC</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Co-snarks</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">TACEO</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/orgs/noir-lang/discussions/8595"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Noir WebProof SDK proposal
              </a>
              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Granted</span>
            </h3>
            <p className="text-gray-700 mb-3">Helping bring zk proofs to the browser with a WebAssembly-friendly Noir SDK</p>
            <div className="flex gap-2">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">WebAssembly</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Noir</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">zk-tls</span>
            </div>
          </div>
        </div>
      </section>

      {/* Other Work */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Other Work</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/teddav/halo2-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                halo2-starter
              </a>
            </h3>
            <p className="text-gray-700 mb-3">Battle-tested testing patterns for Halo2 development</p>
            <div className="flex gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Halo2</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Testing</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Patterns</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/teddav/halo2-soundness-bugs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                halo2-soundness-bugs
              </a>
            </h3>
            <p className="text-gray-700 mb-3">Exploring edge cases and exploits in Halo2 implementations</p>
            <div className="flex gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Halo2</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Security</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Research</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              <a
                href="https://github.com/privacy-scaling-explorations/halo2/pull/352"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                PR #352
              </a>
            </h3>
            <p className="text-gray-700 mb-3">Emulating malicious provers by modifying cell values in the Mock Prover</p>
            <div className="flex gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Halo2</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Mock Prover</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Security</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
