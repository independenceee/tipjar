export interface DocSection {
    id: string;
    title: string;
    href: string;
    active?: boolean;
    external?: boolean;
}

export interface DocCategory {
    id: string;
    title: string;
    sections: DocSection[];
    expandable?: boolean;
}

export const docCategories: DocCategory[] = [
    {
        id: "new-to-cardano",
        title: "New to Cardano?",
        expandable: true,
        sections: [
            { id: "introduction", title: "Introduction", href: "/docs/introduction" },
            { id: "getting-started", title: "Getting Started", href: "/docs/getting-started" },
            { id: "basics", title: "Cardano Basics", href: "/docs/basics" },
        ],
    },
    {
        id: "learn",
        title: "Learn",
        expandable: true,
        sections: [
            { id: "stake-pool-operators", title: "Stake Pool Operators", href: "/docs/stake-pool-operators" },
            { id: "node-operation", title: "Node Operation", href: "/docs/node-operation" },
            { id: "smart-contracts", title: "Smart Contracts", href: "/docs/smart-contracts" },
            { id: "dapps", title: "Building dApps", href: "/docs/dapps" },
        ],
    },
    {
        id: "explore-more",
        title: "Explore more",
        expandable: true,
        sections: [
            { id: "ecosystem", title: "Ecosystem", href: "/docs/ecosystem" },
            { id: "tools", title: "Developer Tools", href: "/docs/tools" },
            { id: "resources", title: "Resources", href: "/docs/resources" },
        ],
    },
    {
        id: "cardano-evolution",
        title: "Cardano evolution",
        expandable: true,
        sections: [
            { id: "roadmap", title: "Roadmap", href: "/docs/roadmap" },
            { id: "updates", title: "Updates", href: "/docs/updates" },
            { id: "governance", title: "Governance", href: "/docs/governance" },
        ],
    },
    {
        id: "direct-links",
        title: "",
        sections: [
            { id: "governance-overview", title: "Governance overview", href: "/docs/governance-overview" },
            { id: "contribution-guidelines", title: "Contribution guidelines", href: "/docs/contribution-guidelines" },
        ],
    },
    {
        id: "external-links",
        title: "",
        sections: [
            { id: "glossary", title: "Glossary", href: "https://docs.cardano.org/glossary", external: true },
            { id: "faqs", title: "FAQs", href: "https://docs.cardano.org/faqs", external: true },
        ],
    },
];

export interface CodeBlock {
    language: string;
    code: string;
    title?: string;
}

export interface AlertBox {
    type: "info" | "warning" | "note";
    title: string;
    content: string;
}

export interface DocSubSection {
    title: string;
    content: string;
    codeBlocks?: CodeBlock[];
    lists?: string[];
    gridItems?: { title: string; description: string }[];
    additionalContent?: string;
}

export interface DocSectionContent {
    title: string;
    content: string;
    description?: string;
    link?: string;
    sections?: DocSubSection[];
    alerts?: AlertBox[];
}

export interface DocContent {
    title: string;
    description: string;
    alerts?: AlertBox[];
    sections: DocSectionContent[];
}

export const monitoringContent: DocContent = {
    title: "Monitoring and Analytics",
    description: "Learn how to monitor and analyze Cardano network performance and metrics.",
    alerts: [
        {
            type: "info",
            title: "Monitoring Tools",
            content: "Various tools are available for monitoring Cardano network performance.",
        },
    ],
    sections: [
        {
            title: "Network Monitoring",
            content: "Monitor network health, performance metrics, and system resources.",
            sections: [
                {
                    title: "Real-time Metrics",
                    content: "Track real-time network metrics including transaction throughput, block production, and node performance.",
                    codeBlocks: [
                        {
                            title: "Monitoring Script",
                            language: "bash",
                            code: `# Monitor network metrics
cardano-cli query tip --mainnet
cardano-cli query protocol-parameters --mainnet`,
                        },
                    ],
                },
            ],
        },
    ],
};

export interface DocDocument {
    id: string;
    documentCode: string;
    name: string;
    description: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    readTime: string;
    lastUpdated: string;
    demoImage: string;
    author: string;
    views: number;
    likes: number;
}

export const docDocuments: DocDocument[] = [
    {
        id: "1",
        documentCode: "DOC-001",
        name: "Getting Started with Cardano",
        description: "Learn the fundamentals of Cardano blockchain, its architecture, and how to get started with development.",
        category: "Getting Started",
        difficulty: "beginner",
        readTime: "15 min",
        lastUpdated: "2025-01-15",
        demoImage: "/images/docs/getting-started.jpg",
        author: "Cardano Team",
        views: 1250,
        likes: 89,
    },
    {
        id: "2",
        documentCode: "DOC-002",
        name: "Plutus Smart Contracts",
        description: "Deep dive into Plutus smart contract development with practical examples and best practices.",
        category: "Smart Contracts",
        difficulty: "intermediate",
        readTime: "45 min",
        lastUpdated: "2025-01-10",
        demoImage: "/images/docs/plutus.jpg",
        author: "IOHK",
        views: 890,
        likes: 156,
    },
    {
        id: "3",
        documentCode: "DOC-003",
        name: "Marlowe for Financial Contracts",
        description: "Build financial smart contracts using Marlowe, Cardano's domain-specific language for DeFi.",
        category: "DeFi",
        difficulty: "intermediate",
        readTime: "30 min",
        lastUpdated: "2025-01-08",
        demoImage: "/images/docs/marlowe.jpg",
        author: "Marlowe Team",
        views: 567,
        likes: 78,
    },
    {
        id: "4",
        documentCode: "DOC-004",
        name: "Native Token Creation",
        description: "Step-by-step guide to creating and managing native tokens on Cardano blockchain.",
        category: "Tokens",
        difficulty: "beginner",
        readTime: "20 min",
        lastUpdated: "2025-01-05",
        demoImage: "/images/docs/tokens.jpg",
        author: "Cardano Foundation",
        views: 1200,
        likes: 92,
    },
    {
        id: "5",
        documentCode: "DOC-005",
        name: "Stake Pool Operation",
        description: "Complete guide to running a stake pool, including setup, maintenance, and optimization.",
        category: "Staking",
        difficulty: "advanced",
        readTime: "60 min",
        lastUpdated: "2025-01-03",
        demoImage: "/images/docs/stake-pool.jpg",
        author: "Stake Pool Alliance",
        views: 445,
        likes: 67,
    },
    {
        id: "6",
        documentCode: "DOC-006",
        name: "Hydra Scaling Solution",
        description: "Understanding Cardano's Hydra layer-2 scaling solution and its implementation.",
        category: "Scaling",
        difficulty: "advanced",
        readTime: "40 min",
        lastUpdated: "2025-01-01",
        demoImage: "/images/docs/hydra.jpg",
        author: "IOHK Research",
        views: 334,
        likes: 45,
    },
    {
        id: "7",
        documentCode: "DOC-007",
        name: "DApp Development Guide",
        description: "Build decentralized applications on Cardano with comprehensive development tutorials.",
        category: "Development",
        difficulty: "intermediate",
        readTime: "50 min",
        lastUpdated: "2024-12-28",
        demoImage: "/images/docs/dapp.jpg",
        author: "Developer Community",
        views: 678,
        likes: 123,
    },
    {
        id: "8",
        documentCode: "DOC-008",
        name: "Cardano Governance",
        description: "Understanding Cardano's governance model, voting mechanisms, and participation.",
        category: "Governance",
        difficulty: "intermediate",
        readTime: "25 min",
        lastUpdated: "2024-12-25",
        demoImage: "/images/docs/governance.jpg",
        author: "Cardano Foundation",
        views: 456,
        likes: 89,
    },
];

export const docListCategories = [
    { id: "all", title: "All Documents", count: docDocuments.length },
    { id: "getting-started", title: "Getting Started", count: 1 },
    { id: "smart-contracts", title: "Smart Contracts", count: 1 },
    { id: "defi", title: "DeFi", count: 1 },
    { id: "tokens", title: "Tokens", count: 1 },
    { id: "staking", title: "Staking", count: 1 },
    { id: "scaling", title: "Scaling", count: 1 },
    { id: "development", title: "Development", count: 1 },
    { id: "governance", title: "Governance", count: 1 },
];

export const introductionContent: DocContent = {
    title: "Welcome to Cardano Documentation",
    description:
        "Learn about Cardano and build with confidence. Our comprehensive documentation covers everything from basic concepts to advanced development techniques.",
    sections: [
        {
            title: "Getting Started",
            description: "New to Cardano? Start here with the basics.",
            link: "/docs/getting-started",
            content: "",
        },
        {
            title: "Smart Contracts",
            description: "Learn to build smart contracts with Plutus.",
            link: "/docs/smart-contracts",
            content: "",
        },
        {
            title: "DeFi Development",
            description: "Create financial applications with Marlowe.",
            link: "/docs/defi",
            content: "",
        },
    ],
};

export const installationContent: DocContent = {
    title: "Installation",
    description: "Learn how to install and set up the Cardano node and CLI tools on your system.",
    sections: [
        {
            title: "System Requirements",
            content: "Before installing Cardano, ensure your system meets the following requirements:",
            sections: [
                {
                    title: "Hardware Requirements",
                    content: "Your system should meet these hardware requirements:",
                    lists: [
                        "CPU: 4+ cores recommended",
                        "RAM: 16GB minimum, 32GB recommended",
                        "Storage: 100GB+ SSD",
                        "Network: Stable internet connection",
                    ],
                },
                {
                    title: "Operating System",
                    content: "Supported operating systems:",
                    lists: ["Linux (Ubuntu 20.04+ recommended)", "macOS 10.15+", "Windows 10+ (with WSL2)"],
                },
            ],
        },
        {
            title: "Installing Cardano Node",
            content: "Follow these steps to install the Cardano node:",
            sections: [
                {
                    title: "Installation Steps",
                    content: "Use the following commands to install Cardano node:",
                    codeBlocks: [
                        {
                            language: "bash",
                            code: `# Download the latest release
wget https://github.com/input-output-hk/cardano-node/releases/latest/download/cardano-node-1.35.5-linux.tar.gz

# Extract the archive
tar -xzf cardano-node-1.35.5-linux.tar.gz

# Move to system path
sudo mv cardano-node /usr/local/bin/
sudo mv cardano-cli /usr/local/bin/

# Verify installation
cardano-node --version
cardano-cli --version`,
                        },
                    ],
                },
            ],
        },
    ],
};

// Docs Components Interfaces
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface DocBreadcrumbProps {
    items: BreadcrumbItem[];
}

export interface DocContentComponentProps {
    content: DocContent;
}

export interface DocHeaderProps {
    onMenuClick?: () => void;
}

export interface DocListItemProps {
    document: DocDocument;
    onNavigate: (id: string) => void;
}

export interface DocSidebarProps {
    onClose?: () => void;
}

// Navigation Components Interfaces
export interface NavDocsProps {
    previous?: { title: string; href: string };
    current: { title: string; href: string };
    next?: { title: string; href: string };
}
