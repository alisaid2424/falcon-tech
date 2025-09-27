import { DOMAIN } from "@/constants/enums";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type EmailTemplateProps = {
  fullName: string;
  amount: number;
  orderId: string;
};

export const EmailTemplate = ({ body }: { body: EmailTemplateProps }) => (
  <Html>
    <Head />
    <Preview>
      The Ecommerce Platform For Your Digital Products – Explore your order
      details
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://res.cloudinary.com/djhoc0ys4/image/upload/v1743191991/logo22_f6c6d83691.png"
          alt="Elasy Tech Logo"
          width="200"
          height="200"
          style={logo}
        />

        <Text style={paragraph}>Hi {body.fullName},</Text>

        <Text style={paragraph}>
          Thank you for your purchase from <strong>Elasy Tech Ecommerce</strong>
          .
        </Text>

        <Text style={paragraph}>
          We’ve received your payment of{" "}
          <strong>${body.amount.toFixed(2)}</strong>.
        </Text>

        <Text style={paragraph}>
          If you’d like to view your order details, you can do so using the
          button below:
        </Text>

        <Section style={btnContainer}>
          <Button
            style={buttonStyle}
            href={`${DOMAIN}/order-details/${body.orderId}`}
          >
            View Order Details
          </Button>
        </Section>

        <Text style={paragraph}>
          Best regards,
          <br />
          💻 The Elasy Tech Team
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          Elasy Tech hopes to see you again! Visit our{" "}
          <a href={DOMAIN} style={{ color: "#3AF8F5" }}>
            website
          </a>
          for more digital products.
        </Text>
      </Container>
    </Body>
  </Html>
);

// === Styles ===

const main = {
  backgroundColor: "#fff8f0",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderRadius: "50%",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const btnContainer: React.CSSProperties = {
  textAlign: "center",
  marginTop: "20px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#3AF8F5",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "30px 0",
};

const footer = {
  color: "#888",
  fontSize: "12px",
  textAlign: "center" as const,
};
