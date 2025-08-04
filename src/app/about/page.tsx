export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="mb-16">
        <p className="text-gray-700 mb-4">
          These days, I&apos;m deep into cryptography: zero-knowledge proofs, MPC, FHE. Interested in building privacy-preserving
          applications.
          <br />
          My work focuses on exploring the boundaries of what&apos;s possible with modern cryptographic techniques.
          <br />
          I used to do DevSecOps for Big Tech, now I&apos;m more excited about low-level stuff like assembly and wasm.
          <br />
          I also worked on smart contract security and the EVM, having fun with solidity and yul.
          <br />I work at the intersection of zero-knowledge, smart contract security, and cryptographic engineering.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span>🥇</span>
              <span>
                First place in <strong>Secureum Epoch 0</strong> (smart contract security bootcamp)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span>🧪</span>
              <span>
                ZK Security Fellow @ <strong>Electi</strong> (formerly yAcademy)
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
