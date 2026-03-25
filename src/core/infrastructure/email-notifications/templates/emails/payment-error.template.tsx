import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
} from "@react-email/components";

interface Props {
  userName: string;
}

export function PaymentErrorEmail({ userName }: Props) {
  return (
    <Html lang="es">
      <Body
        style={{ backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            backgroundColor: "#CB0E43",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
          }}
        >
          <Section style={{ textAlign: "center", paddingBottom: "24px" }}>
            <Img
              src="https://res.cloudinary.com/dy3rkkfjw/image/upload/v1774404706/eduprompt-logo_fzjigb.png"
              width="180"
              height="82"
              alt="EduPrompt"
              style={{ margin: "0 auto" }}
            />
          </Section>

          <Text
            style={{ color: "#fff", fontSize: "26px", textAlign: "center" }}
          >
            Error al auto renovar la suscripción
          </Text>

          <Text
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Hola, {userName}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: "16px",
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            No se pudo auto renovar tu suscripción de EduPrompt Pro revisa tus
            fondos en tu cuenta de PayPal o tarjeta de crédito. Puedes
            reintentar el pago desde la sección de configuraciones dentro de la
            app. Si el problema persiste comunícate con soporte enviando un
            mensaje al correo de soporte.
          </Text>

          <Section style={{ textAlign: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: "22px",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Correo de soporte
            </Text>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "14px 28px",
              }}
            >
              <span
                style={{
                  color: "#272A30",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                }}
              >
                support@eduuprompt.com
              </span>
            </div>
          </Section>
          <Hr
            style={{ borderColor: "rgba(255,255,255,0.2)", marginTop: "36px" }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            © Derechos reservados - Eduprompt 2026
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
