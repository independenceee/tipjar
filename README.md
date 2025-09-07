# HydraTipJar

A decentralized tipping application built on Cardano's Layer 2 Hydra protocol, enabling instant and low-cost micropayments.

## Overview

HydraTipJar is a Next.js-based dApp that demonstrates the power of Hydra for handling microtransactions. It allows content creators to receive tips from their audience with near-instant finality and minimal transaction fees.

## Features

-   **Instant Tipping**: Process tips off-chain through Hydra Heads
-   **Low Fees**: Minimize transaction costs for micropayments
-   **Multi-Wallet Support**: Compatible with popular Cardano wallets
    -   Lace
    -   Nami
    -   Eternl
    -   Flint
    -   Typhon
    -   Vespr
    -   Yoroi
    -   Nufi
-   **Real-time Balance Updates**: Instant balance reflection for both tipper and creator
-   **Dark/Light Theme**: Supports both dark and light modes
-   **Responsive Design**: Works seamlessly across devices

## Technology Stack

-   **Frontend**:

    -   Next.js 14
    -   React with TypeScript
    -   TailwindCSS for styling
    -   Geist Font family
    -   Radix UI components

-   **Blockchain**:

    -   Cardano Layer 1 (for settlement)
    -   Hydra Protocol (Layer 2)
    -   Mesh SDK for Cardano integration
    -   CIP-30 wallet standard

-   **Smart Contracts**:
    -   Aiken for validator scripts
    -   Mesh transaction builder

## Getting Started

1. **Prerequisites**

    - Node.js
    - A compatible Cardano wallet
    - Local Hydra node setup

2. **Installation**

    ```bash
    git clone https://github.com/independenceee/tipjar.git
    cd tipjar
    npm install
    ```

3. **Environment Setup**
   Create a `.env` file with necessary configurations (check `.env.example`)

4. **Development**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`

## Smart Contract Development

The smart contracts are written in Aiken and located in the `contract/` directory. To work with contracts:

```bash
cd contract
aiken build
aiken check    # Run tests
aiken docs     # Generate documentation
```

## Architecture

### Components

1. **Frontend Application**

    - User interface for tipping interactions
    - Wallet connection and management
    - Real-time balance updates
    - WebSocket communication with Hydra node

2. **Hydra Layer**

    - State channel management
    - Off-chain transaction processing
    - Real-time transaction finality

3. **Cardano Layer**
    - Final settlement layer
    - Security backing for Hydra heads
    - On-chain transaction processing

### Workflow

1. Tipper connects wallet and opens a Hydra Head with the creator
2. Tipper commits ADA to the session
3. Tipper can send multiple tips off-chain with instant confirmation
4. Balances update in real-time for both parties
5. When finished, tipper closes the session and final balances settle on-chain

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is open source and available under the MIT License.