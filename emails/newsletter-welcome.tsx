import { siteConfig } from "@/config/site";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  anchor,
  box,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = "https://demo.mkdirs.com";

export const NewsletterWelcomeEmail = ({ email }: { email: string }) => {
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  // const unsubscribeUrl = `http://localhost:3000/unsubscribe?email=${encodeURIComponent(email)}`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to Mkdirs!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="32"
              height="32"
              alt="Logo"
            />
            <Hr style={hr} />
            <Text style={paragraph}>
              Welcome to our community! We're thrilled to have you join us on
              this journey of exploring cutting-edge websites and tools.
            </Text>
            <Text style={paragraph}>
              Expect our monthly newsletter packed with curated insights, latest
              trends, and exclusive tips in the AI space.
            </Text>
            <Text style={paragraph}>
              We value your participation and feedback. Please don't hesitate to
              reach out to us if you have any questions or suggestions.
            </Text>
            <Text style={paragraph}>
              Thanks, <br />
              The{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp; All Rights Reserved.
              </span>

              <span style={footerRight}>
                <Link style={anchor} href={siteConfig.links.twitter}>
                  Twitter
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link style={anchor} href={siteConfig.links.github}>
                  GitHub
                </Link>
              </span>
            </Text>
            <Text style={footer}>
              <span>
                If you wish to unsubscribe,{" "}
                <Link style={anchor} href={unsubscribeUrl} target="_blank">
                  click here
                </Link>
                .
              </span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterWelcomeEmail;

NewsletterWelcomeEmail.PreviewProps = {
  email: "support@mkdirs.com",
};
