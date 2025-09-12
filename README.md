<div align="center">

<img src="https://hydra.family/head-protocol/img/hydra.png" width="120" alt="HydraTipJar Logo" />

# **HydraTipJar**

**A decentralized tipping platform powered by Cardano's Hydra Layer 2 for instant, low-fee micropayments to creators and communities**

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=nextdotjs)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Container-blue?logo=docker)](https://www.docker.com/)
[![Aiken](https://img.shields.io/badge/Aiken-Smart%20Contracts-orange?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY2NjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTExLjUgM0M2LjI1IDMgMiA3LjI1IDIgMTJzNC4yNSA5IDkuNSA5IDkuNS00LjI1IDkuNS05LTQuMjUtOS41LTktOS41eiIvPjwvc3ZnPg==)](https://aiken-lang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-Hydra%20L2-green?logo=cardano)](https://cardano.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

</div>

## About HydraTipJar

HydraTipJar is an open-source decentralized application (dApp) designed to transform how creators, streamers, and communities receive tips using the Cardano blockchain. By harnessing the power of Cardano's Layer 2 (L2) scaling solution, **Hydra**, HydraTipJar delivers instant, near-zero-fee transactions, making it an ideal solution for micropayments as small as 0.1 ADA. This platform eliminates the high fees and centralized control of traditional tipping systems (e.g., Patreon, Ko-fi, or Twitch, which can charge up to 30%) while offering a secure, transparent, and user-friendly experience.

The project leverages a modern tech stack: **Next.js 13** for a responsive frontend, **Aiken** for developer-friendly smart contracts, and **Hydra** for high-throughput off-chain transactions. HydraTipJar not only serves as a practical tool for creators but also acts as a reference implementation for developers exploring Cardano's L2 capabilities. It showcases how Hydra's state channels can process thousands of transactions per second (TPS) per channel, with sub-second latency and costs below 0.01 ADA, all while maintaining the security guarantees of Cardano's Layer 1 (L1).

As of September 2025, HydraTipJar is actively developed, with a focus on Hydra integration and testing on Cardano's preview and testnet environments. The project is licensed under the MIT License, encouraging open collaboration. It is maintained by the GitHub user "independenceee" and has garnered attention within the Cardano community as a flagship example of a Hydra-powered dApp.

### Key Benefits

-   **Speed**: Tips are processed in under 1 second via Hydra's off-chain state channels, perfect for live interactions during streams or events.
-   **Low Costs**: Transaction fees are negligible (<0.01 ADA), enabling true micropayments for small tips or donations.
-   **Decentralized**: Peer-to-peer tipping with no intermediaries, ensuring creators receive 100% of their tips (minus minimal network fees).
-   **Scalability**: Hydra supports thousands of TPS per head, allowing communities to scale without L1 congestion.
-   **Security**: Aiken-compiled Plutus scripts ensure robust smart contracts, with L1 settlement for withdrawals guaranteeing finality.
-   **Accessibility**: Supports major Cardano wallets and a responsive UI for desktop and mobile users.

### Use Cases

-   **Content Creators**: Streamers on Twitch or YouTube can share TipJar links or QR codes for instant fan support.
-   **Open-Source Developers**: Accept micro-donations for GitHub contributions or software releases.
-   **Communities**: Crowdfund projects or community pots with multi-signature withdrawal options.
-   **Charities & Causes**: Transparent donation tracking with on-chain metadata for accountability.

---

## 🌐 Features

HydraTipJar combines intuitive user experience with powerful blockchain technology. Below is a detailed breakdown of its core features:

-   **Connect Cardano Wallets**  
    Seamlessly integrates with popular browser-based Cardano wallets (Nami, Eternl, Flint, Lace, Typhon, Vespr, Yoroi, Nufi) using the CIP-30 standard. Users can connect in one click, switch between mainnet and preview/testnet, and sign transactions securely. Multi-wallet support ensures flexibility for advanced users.

-   **Receive Instant ADA Tips**  
    Creators generate a unique TipJar link (e.g., `tipjar.cardano2vn.io/tipper/{wallet_address}`) or QR code to share on social platforms, stream overlays, or profile bios. Tips are processed off-chain in Hydra Heads for near-instant confirmation (<1s) and include optional message fields for personalized fan interactions.

-   **Recent Tips Dashboard**  
    A real-time dashboard displays tip history, including sender wallet addresses, amounts (in ADA or lovelace), timestamps, and attached messages. Features include filtering by date or sender, sorting by amount, and aggregate stats (total received, top tippers). Powered by WebSockets for live updates during streams.

-   **Creator Registration & Profile Management**  
    Easy onboarding: connect a wallet, set up a profile (name, bio, avatar, social links), and initialize a personal Hydra Head. Creators can manage multiple profiles for different platforms (e.g., Twitch, YouTube). Optional NFT-based profiles store metadata on-chain for verifiable identity.

-   **Secure ADA Withdrawals**  
    Tips accumulate in a Hydra Head and can be withdrawn to an L1 wallet in batches. Multi-signature support enables community-managed tip pools. Hydra's contestable commit mechanism ensures security against double-spending, with withdrawals settling on L1 in 5-10 minutes.

-   **Hydra & Aiken Integration**  
    The backend uses Aiken to write concise, secure smart contracts that compile to Plutus Core. Hydra's state channels handle off-chain transactions, supporting over 1,000 TPS per head. The system is extensible to support Cardano native tokens beyond ADA.

-   **Dockerized Deployment**  
    Fully containerized setup with Docker Compose, including frontend (Next.js), Hydra node (Rust), PostgreSQL for off-chain logs, and Nginx for reverse proxy. Deploy locally or scale to cloud platforms like AWS, Vercel, or DigitalOcean with minimal configuration.

-   **Enhanced UI/UX**  
    Built with TailwindCSS for responsive design, auto-detecting dark/light modes. Radix UI ensures accessibility (WCAG-compliant). Real-time balance updates and robust error handling improve usability, even on unstable connections.

-   **Analytics & Social Sharing**  
    Integrated analytics (via Recharts) provide visualizations of tip trends, top tippers, and monthly summaries. One-click sharing generates QR codes or links for X, Discord, Telegram, or stream overlays.

---

## 🛠️ Technology Stack

| Component           | Technologies                                         | Purpose                                                                    |
| ------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| **Frontend**        | Next.js 13, React, TypeScript, TailwindCSS, Radix UI | Server-side rendered UI for performance, SEO, and accessibility.           |
| **Blockchain**      | Mesh SDK, CIP-30, Blockfrost/Koios API               | Wallet integration, transaction building, and blockchain data queries.     |
| **Layer 2**         | Hydra Protocol (Rust-based nodes)                    | Off-chain state channels for high-throughput, low-latency transactions.    |
| **Smart Contracts** | Aiken (compiles to Plutus Core)                      | Secure, developer-friendly scripts for tip validation and Head management. |
| **Deployment**      | Docker Compose, Nginx                                | Containerized services for easy local and cloud deployment.                |
| **Data**            | PostgreSQL, WebSockets                               | Off-chain storage for logs and real-time dashboard updates.                |

---

## ⚡ Getting Started

Follow these steps to set up HydraTipJar locally or deploy it for production. Prerequisites: Node.js 18+, Docker, and a Cardano wallet with testnet ADA (use the [Cardano faucet](https://docs.cardano.org/cardano-testnet/faucet) for preview/testnet).

1. **Clone the Repository**

    ```bash
    git clone https://github.com/independenceee/tipjar.git
    cd tipjar
    ```

2. **Install Dependencies**

    ```bash
    npm install
    # Or: yarn install
    ```

3. **Configure Environment**

    - Copy the example env file: `cp .env.example .env`
    - Edit `.env`:
        - `BLOCKFROST_API_KEY`: Obtain from [Blockfrost](https://blockfrost.io/).
        - `NETWORK`: Set to `preview` (testnet) or `mainnet`.
        - `MIN_TIP_AMOUNT`: Default is `1000000` (1 ADA in lovelace).
        - `HYDRA_NODE_URL`: Local or remote Hydra node (e.g., `ws://localhost:4001`).
    - For Hydra: Install and run a Hydra node (see [Hydra Docs](https://hydra.family/head-protocol/)).

4. **Run Locally**

    ```bash
    npm run dev
    ```

    Access at [http://localhost:3000](http://localhost:3000). Connect a wallet, initialize a Hydra Head, and test tipping.

5. **Build for Production**

    ```bash
    npm run build
    npm start
    ```

    Optimized build served on port 3000.

6. **Docker Compose**
    ```bash
    docker-compose up --build
    ```
    Launches all services (frontend, Hydra node, PostgreSQL, Nginx). Access at [http://localhost:3000](http://localhost:3000). Scale Hydra nodes with `docker-compose scale hydra-node=3` for multi-party setups.

**Troubleshooting**:

-   **Wallet Issues**: Ensure CIP-30 compatibility and browser extensions are enabled.
-   **Hydra Errors**: Verify node sync with `hydra-node --help`. Check network alignment (preview/mainnet).
-   **Test ADA**: Request from the Cardano testnet faucet for preview network.

---

## 📁 Project Structure

The project follows a modular monorepo structure for maintainability and scalability:

-   **`src/`** — Core frontend code (TypeScript/React)

    -   `components/` — Reusable UI elements (e.g., `WalletConnectButton.tsx`, `TipModal.tsx`, `DashboardChart.tsx`)
    -   `hooks/` — Custom React hooks (e.g., `useHydraState.ts`, `useWalletTx.ts`)
    -   `services/` — API integrations (e.g., `hydraService.ts`, `explorerService.ts` for Blockfrost/Koios)
    -   `txbuilders/` — Transaction logic (e.g., `tipTxBuilder.ts` for off-chain sends)
    -   `constants/` — Configs (e.g., `walletList.ts`, `networkParams.ts`)
    -   `types/` — TypeScript interfaces (e.g., `HydraHead`, `TipEvent`)
    -   `utils/` — Helpers (e.g., `formatLovelace.ts`, `validateSignature.ts`)

-   **`contract/`** — Smart contract sources

    -   Aiken scripts: `tip_validator.aiken` (validates tips), `head_setup.aiken` (initializes Hydra Heads)
    -   Compiled outputs: Plutus JSON for deployment

-   **`public/`** — Static assets

    -   Images: Hydra logo, wallet icons
    -   Favicon and PWA manifest

-   **`env/`** — Environment configurations

    -   `.env.example`: Template for API keys and settings
    -   Docker-specific overrides

-   **`docker-compose.yml`** — Orchestrates services: Next.js, Hydra node, PostgreSQL, Nginx

-   **`scripts/`** — Deployment and build utilities (e.g., `deploy-contracts.sh`)

-   **Root Files**:
    -   `README.md` — Project documentation
    -   `CONTRIBUTING.md` — Contribution guidelines
    -   `LICENSE` — MIT License
    -   `package.json` — Dependencies and scripts

---

## 🧑‍💻 Developer Notes

-   **Hydra Workflow**: Users commit ADA to a Hydra Head on L1, tip off-chain, and close the Head to withdraw. Transactions are validated by Aiken scripts.
-   **Testing**: Run `npm test` for Jest unit tests. End-to-end tests use Playwright in `/tests/`.
-   **Extending**: Add new wallets in `src/constants/wallets.ts`. Write custom validators in Aiken and compile with `aiken build`.
-   **Mainnet Deployment**: Set `.env` to `mainnet`, deploy contracts via `cardano-cli` or Mesh SDK.
-   **Performance**: Hydra scales linearly with participants. Benchmark with `/benchmarks/` scripts.
-   **Security**: Aiken reduces smart contract errors by ~50% compared to raw Plutus. Hydra's contestable commits prevent double-spending.

For advanced setup, refer to [Hydra Docs](https://hydra.family/head-protocol/) and [Aiken Book](https://aiken-lang.org/book/).

---

## 🤝 Contributing

We welcome contributions to make HydraTipJar even better! Whether you're fixing bugs, adding features (e.g., native token support), improving docs, or enhancing the UI, your input is valued.

1. Fork the repository and create a feature branch:
    ```bash
    git checkout -b feature/your-idea
    ```
2. Commit changes with clear messages:
    ```bash
    git commit -m "Add: your idea with tests"
    ```
3. Push to your fork:
    ```bash
    git push origin feature/your-idea
    ```
4. Open a Pull Request on GitHub, linking to relevant issues.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details:

-   Follow ESLint/Prettier for code style.
-   Include tests for new features.
-   Discuss breaking changes in issues first.

Report bugs or suggest features via GitHub Issues. Join the Cardano developer community on Discord or X for collaboration.

---

## 📚 Documentation & Resources

-   [API Reference](docs/API.md) — Details on endpoints and data types
-   [Hydra Setup Guide](docs/hydra-setup.md) — Node configuration and troubleshooting
-   [Smart Contract Breakdown](docs/contracts.md) — Aiken script explanations
-   Cardano Ecosystem:
    -   [Cardano Developer Portal](https://developers.cardano.org/)
    -   [Hydra RFCs](https://github.com/cardano-scaling/hydra)
    -   [Mesh SDK Docs](https://meshjs.dev/)
    -   [Aiken Language Book](https://aiken-lang.org/book/)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). Copyright © 2025 independenceee. Free to use, modify, and distribute.
