# HydraTipJar

HydraTipJar is an open-source decentralized application (dApp) that brings instant, low-fee tipping and micropayments to Cardano using the Hydra Layer 2 protocol. Designed for creators, communities, and developers, HydraTipJar showcases the power of Hydra for scalable, real-time transactions.

## 🚀 Why HydraTipJar?

-   **Instant Tips:** Send and receive ADA tips in seconds, not minutes.
-   **Negligible Fees:** Hydra Layer 2 slashes transaction costs, making micro-rewards practical.
-   **Open Source:** Transparent, auditable, and extensible for the Cardano developer ecosystem.
-   **Creator Empowerment:** Enable fans to support creators with frictionless crypto payments.
-   **Developer Friendly:** A reference implementation for Hydra, Cardano wallets (CIP-30), and dApp best practices.

## 🌐 Features

-   Hydra Head state channel management
-   ADA commitment and off-chain tip transactions
-   Real-time balance updates for tipper and creator
-   Secure wallet integration (Lace, Eternl, Nami, Flint, Typhon, Vespr, Yoroi, Nufi)
-   Responsive, theme-aware UI (dark/light mode)
-   Open participation, global opportunity

## 🛠️ Technology Stack

-   **Frontend:** Next.js, React, TypeScript, TailwindCSS, Radix UI
-   **Blockchain:** Cardano Layer 1, Hydra Layer 2, Mesh SDK, CIP-30
-   **Smart Contracts:** Aiken (Plutus), MeshTxBuilder

## ⚡ Getting Started

1.  **Clone the repo:**

    ```bash
    git clone https://github.com/independenceee/tipjar.git
    cd tipjar
    npm install
    ```

2.  **Configure environment:**

    -   Copy `.env.example` to `.env` and update settings

3.  **Run locally:**

    ```bash
    npm run dev
    ```

    Visit [http://localhost:3000](http://localhost:3000)

4.  **Connect your Cardano wallet and Hydra node**

## 🧑‍💻 Developer Notes

-   Smart contracts are in `/contract` (Aiken)
-   Transaction logic in `/src/txbuilders`
-   Wallets and network config in `/src/constants`
-   UI components in `/src/components`

## 📚 Documentation & Resources

-   [Hydra Protocol](https://hydra.family)
-   [Cardano Developer Portal](https://developers.cardano.org)
-   [Aiken Smart Contracts](https://aiken-lang.org)

## 🤝 Contributing

Pull requests, issues, and feedback are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 independenceee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

Empower creators. Enable communities. Build the future of Cardano micropayments with HydraTipJar.
