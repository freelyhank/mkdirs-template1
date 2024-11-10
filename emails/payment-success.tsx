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

interface PaymentSuccessEmailProps {
  userName?: string;
  itemLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
// const baseUrl = 'https://demo.mkdirs.com';

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const PaymentSuccessEmail = ({
  userName,
  itemLink,
}: PaymentSuccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thanks for your submission</Preview>
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
            <Text style={paragraph}>
              Thanks for submitting your product to{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>
              . We're so excited to include your product in our collection!
            </Text>
            <Text style={paragraph}>
              Your product has been successfully added to our directory. You can
              view your listing by clicking the button below:
            </Text>
            <Button style={button} href={itemLink}>
              View your product
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

PaymentSuccessEmail.PreviewProps = {
  userName: "Javayhu",
  itemLink: "https://demo.mkdirs.com",
} as PaymentSuccessEmailProps;

export default PaymentSuccessEmail;
