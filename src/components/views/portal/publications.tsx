import { PublicationsDataTable } from "@/components/views/portal/ui-tables";
import { PortalResearcherPubs } from "@/lib/actions/queries";
// import { getResearcherPublications } from "@/lib/queries/portal";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

// Test data that matches your PortalResearcherPubs type
const mockPublicationsData: PortalResearcherPubs = [
  {
    id: "pub-1",
    type: "journal_article",
    title:
      "Machine Learning Approaches for Climate Change Prediction: A Comprehensive Review",
    abstract:
      "This paper presents a comprehensive review of machine learning techniques applied to climate change prediction, focusing on deep learning models and their effectiveness in long-term forecasting.",
    link: "https://example.com/paper1",
    creatorId: "user-1",
    publicationDate: new Date("2024-03-15"),
    doi: "10.1038/s41598-024-12345-6",
    venue: "Nature Scientific Reports",
    metadata: {
      journalInfo: {
        name: "Nature Scientific Reports",
        volume: "14",
        issue: "1",
        pages: "1-15",
        impactFactor: 4.379,
      },
    },
    citationCount: 23,
    lastCitationUpdate: new Date("2024-12-01"),
    created_at: new Date("2024-03-01"),
    updated_at: new Date("2024-03-15"),
    userAuthorOrder: 0, // Lead author
    isLeadAuthor: true,
    canDelete: true,
    authors: [
      {
        order: 0,
        researcherId: "researcher-1",
        researcher: {
          title: "Dr.",
          user: {
            name: "John Smith",
          },
        },
      },
      {
        order: 1,
        researcherId: "researcher-2",
        researcher: {
          title: "Prof.",
          user: {
            name: "Sarah Johnson",
          },
        },
      },
      {
        order: 2,
        researcherId: "researcher-3",
        researcher: {
          title: "Dr.",
          user: {
            name: "Michael Chen",
          },
        },
      },
    ],
  },
  {
    id: "pub-2",
    type: "conference_paper",
    title:
      "Real-time Data Processing in IoT Networks: Performance Analysis and Optimization",
    abstract:
      "We present novel algorithms for real-time data processing in large-scale IoT networks, demonstrating significant improvements in latency and throughput.",
    link: "https://dl.acm.org/doi/10.1145/example",
    creatorId: "user-2",
    publicationDate: new Date("2024-07-20"),
    doi: "10.1145/3658644.3670123",
    venue: "ACM SIGCOMM 2024",
    metadata: {
      conferenceInfo: {
        name: "ACM SIGCOMM 2024",
        location: "Sydney, Australia",
        pages: "45-58",
        acceptanceRate: 18.2,
      },
    },
    citationCount: 7,
    lastCitationUpdate: new Date("2024-11-15"),
    created_at: new Date("2024-04-10"),
    updated_at: new Date("2024-07-20"),
    userAuthorOrder: 1, // Second author
    isLeadAuthor: false,
    canDelete: false,
    authors: [
      {
        order: 0,
        researcherId: "researcher-4",
        researcher: {
          title: "Prof.",
          user: {
            name: "Lisa Anderson",
          },
        },
      },
      {
        order: 1,
        researcherId: "researcher-1", // Current user
        researcher: {
          title: "Dr.",
          user: {
            name: "John Smith",
          },
        },
      },
    ],
  },
  {
    id: "pub-3",
    type: "book_chapter",
    title: "Quantum Computing Applications in Cryptography",
    abstract:
      "This chapter explores the implications of quantum computing for modern cryptographic systems and presents quantum-resistant algorithms.",
    link: null,
    creatorId: "user-3",
    publicationDate: new Date("2023-11-08"),
    doi: "10.1007/978-3-031-45678-9_12",
    venue: "Advances in Computer Science",
    metadata: {
      bookInfo: {
        title: "Advances in Computer Science",
        publisher: "Springer",
        isbn: "978-3-031-45678-9",
        chapter: 12,
        pages: "245-267",
      },
    },
    citationCount: 12,
    lastCitationUpdate: new Date("2024-10-20"),
    created_at: new Date("2023-08-15"),
    updated_at: new Date("2023-11-08"),
    userAuthorOrder: 2, // Third author
    isLeadAuthor: false,
    canDelete: false,
    authors: [
      {
        order: 0,
        researcherId: "researcher-5",
        researcher: {
          title: "Prof.",
          user: {
            name: "Robert Wilson",
          },
        },
      },
      {
        order: 1,
        researcherId: "researcher-6",
        researcher: {
          title: "Dr.",
          user: {
            name: "Emma Davis",
          },
        },
      },
      {
        order: 2,
        researcherId: "researcher-1", // Current user
        researcher: {
          title: "Dr.",
          user: {
            name: "John Smith",
          },
        },
      },
    ],
  },
  {
    id: "pub-4",
    type: "report",
    title: "Novel Approaches to Sustainable Energy Storage Systems",
    abstract:
      "We investigate innovative battery technologies and their potential for large-scale renewable energy storage applications.",
    link: "https://arxiv.org/abs/2024.12345",
    creatorId: "user-1",
    publicationDate: new Date("2024-12-01"),
    doi: null,
    venue: "arXiv",
    metadata: {
      preprintInfo: {
        server: "arXiv",
        category: "physics.app-ph",
        version: "v1",
      },
    },
    citationCount: 0,
    lastCitationUpdate: null,
    created_at: new Date("2024-12-01"),
    updated_at: new Date("2024-12-01"),
    userAuthorOrder: 0, // Lead author
    isLeadAuthor: true,
    canDelete: true,
    authors: [
      {
        order: 0,
        researcherId: "researcher-1", // Current user
        researcher: {
          title: "Dr.",
          user: {
            name: "John Smith",
          },
        },
      },
      {
        order: 1,
        researcherId: "researcher-7",
        researcher: {
          title: "Dr.",
          user: {
            name: "Alice Thompson",
          },
        },
      },
    ],
  },
  {
    id: "pub-5",
    type: "journal_article",
    title:
      "Artificial Intelligence in Healthcare: Challenges and Opportunities",
    abstract:
      "A systematic review of AI applications in healthcare, examining current implementations, challenges, and future opportunities for improving patient outcomes.",
    link: "https://www.sciencedirect.com/science/article/example",
    creatorId: "user-4",
    publicationDate: new Date("2024-01-15"),
    doi: "10.1016/j.jbi.2024.104567",
    venue: "Journal of Biomedical Informatics",
    metadata: {
      journalInfo: {
        name: "Journal of Biomedical Informatics",
        volume: "141",
        issue: null,
        pages: "104567",
        impactFactor: 3.745,
      },
    },
    citationCount: 45,
    lastCitationUpdate: new Date("2024-12-10"),
    created_at: new Date("2023-10-20"),
    updated_at: new Date("2024-01-15"),
    userAuthorOrder: 3, // Fourth author
    isLeadAuthor: false,
    canDelete: false,
    authors: [
      {
        order: 0,
        researcherId: "researcher-8",
        researcher: {
          title: "Prof.",
          user: {
            name: "David Martinez",
          },
        },
      },
      {
        order: 1,
        researcherId: "researcher-9",
        researcher: {
          title: "Dr.",
          user: {
            name: "Jennifer Lee",
          },
        },
      },
      {
        order: 2,
        researcherId: "researcher-10",
        researcher: {
          title: "Dr.",
          user: {
            name: "Thomas Brown",
          },
        },
      },
      {
        order: 3,
        researcherId: "researcher-1", // Current user
        researcher: {
          title: "Dr.",
          user: {
            name: "John Smith",
          },
        },
      },
    ],
  },
];
async function Publications({ className, ...props }: Props) {
  // const pubs = await getResearcherPublications();
  const pubs = mockPublicationsData;
  return (
    <PublicationsDataTable pubs={pubs} className={cn(className)} {...props} />
  );
}

export { Publications };
