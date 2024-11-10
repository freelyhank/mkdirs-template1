import { siteConfig } from "@/config/site";
import {
  Body,
  Button,
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
  button,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";

interface NotifySubmissionToUserEmailProps {
  userName?: string;
  itemName?: string;
  statusLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const NotifySubmissionToUserEmail = ({
  userName,
  itemName,
  statusLink,
}: NotifySubmissionToUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your submission</Preview>
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
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>Thank you for your submission.</Text>
            <Text style={paragraph}>
              Your product named <b>{itemName}</b> will be reviewed in the next
              48 hours before listing on our directory.
            </Text>
            <Text style={paragraph}>
              You can view your submission status by clicking the button below:
            </Text>
            <Button style={button} href={statusLink}>
              View submission status
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              We appreciate your support and contribution to our community. If
              you have any questions, please don't hesitate to contact us.
            </Text>
            <Text style={paragraph}>
              Thank you again for choosing{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>
              . We look forward to helping more people discover your product!
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
                &nbsp;&nbsp; All Rights Reserved.
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
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

NotifySubmissionToUserEmail.PreviewProps = {
  userName: "Javayhu",
  itemName: "Mkdirs",
  statusLink: "https://demo.mkdirs.com",
} as NotifySubmissionToUserEmailProps;

export default NotifySubmissionToUserEmail;
