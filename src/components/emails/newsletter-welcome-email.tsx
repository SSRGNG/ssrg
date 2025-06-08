import { appFullName } from "@/config/constants";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface NewsletterWelcomeEmailProps {
  name?: string;
  fromEmail: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

// For previewing we need to put images in the .react-email/public folder
// In production we need to put images in the root public folder
const newsletterImages = [
  {
    src: `${baseUrl}/images/newsletter/research-impact.webp`,
    alt: "Researchers collaborating on project",
    credit: "Research Commons",
    creditUrl:
      "https://www.pexels.com/photo/diverse-researchers-collaborating-on-project-3861969/",
    description: `At SSRG, we believe that rigorous research can drive meaningful social change. Our interdisciplinary team works closely with communities and policymakers to develop evidence-based solutions to complex social challenges. Through our newsletter, we'll keep you informed about our latest findings and their real-world applications.`,
  },
  {
    src: `${baseUrl}/images/newsletter/community-engagement.webp`,
    alt: "Community workshop session",
    credit: "Social Impact Archive",
    creditUrl:
      "https://www.pexels.com/photo/people-in-community-workshop-4342352/",
    description: `We're committed to participatory research methods that center community voices and experiences. Our work spans policy analysis, community development, and equity frameworks. Each month, we'll share insights from our current projects, opportunities to get involved, and resources for social innovation.`,
  },
];

export default function NewsletterWelcomeEmail({
  name = "there",
  fromEmail = "newsletter@ssrg.org",
  token,
}: NewsletterWelcomeEmailProps) {
  const previewText = `Welcome to the SSRG Research Newsletter, ${name}!`;

  return (
    <Html>
      <Head>
        <title>SSRG Research Newsletter</title>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto bg-gray-50 font-sans">
          <Container className="mx-auto my-[40px] max-w-2xl rounded p-4">
            <Section className="mt-4">
              <Heading className="text-center text-2xl font-semibold text-blue-800">
                {appFullName}
              </Heading>
              <Hr className="my-4" />
              <Heading className="text-center text-3xl font-semibold text-gray-800">
                Welcome to Our Research Community!
              </Heading>
              <Text className="mb-0 mt-6 text-center text-base">
                Thank you for subscribing to the SSRG Research Newsletter,{" "}
                {name}.
              </Text>
              <Text className="m-0 text-center text-base">
                Each month, we&apos;ll share our latest research findings,
                upcoming events, and opportunities for collaboration.
              </Text>
            </Section>
            <Section className="mt-6">
              {newsletterImages.map((item) => (
                <Row key={item.alt} className="mt-10">
                  <Img
                    src={item.src}
                    alt={item.alt}
                    height={424}
                    className="aspect-video w-full object-cover"
                  />
                  <Text className="mb-0 mt-2 text-center text-gray-400">
                    Photo by{" "}
                    <Link
                      href={item.creditUrl}
                      className="text-blue-600 underline"
                    >
                      {item.credit}
                    </Link>
                  </Text>
                  <Text className="mb-0 mt-4 text-center text-base">
                    {item.description}
                  </Text>
                </Row>
              ))}
            </Section>
            <Section className="mt-8 bg-blue-50 p-6 rounded-lg">
              <Heading className="text-center text-xl font-medium text-blue-800">
                What to Expect From Our Newsletter
              </Heading>
              <Text className="mt-4 text-base">
                • Research highlights and key findings from our latest projects
              </Text>
              <Text className="mt-2 text-base">
                • Upcoming webinars, conferences, and community events
              </Text>
              <Text className="mt-2 text-base">
                • Opportunities for research participation and collaboration
              </Text>
              <Text className="mt-2 text-base">
                • Relevant policy developments and social impact news
              </Text>
              <Text className="mt-2 text-base">
                • Resources for practitioners and fellow researchers
              </Text>
            </Section>
            <Section className="mt-8 text-center text-gray-600">
              <Text className="my-4">
                We look forward to sharing our work with you. If you have any
                questions or research interests to discuss, please reach out to
                us at{" "}
                <Link
                  href={`mailto:${fromEmail}`}
                  className="text-blue-600 underline"
                >
                  {fromEmail}
                </Link>
              </Text>
              <Text className="mb-0 mt-4">
                © {appFullName} {new Date().getFullYear()}
              </Text>
              <Text className="m-0">
                123 Research Way, Academic City, AC 12345
              </Text>
              <Text className="mt-6 text-gray-400 text-sm">
                If you wish to update your email preferences or unsubscribe, you
                can{" "}
                <Link
                  href={`${baseUrl}/email-preferences?token=${token}`}
                  className="text-blue-600 underline"
                >
                  manage your subscription here
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
