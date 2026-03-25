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
  verificationCode: string;
}

export function EmailChangeEmail({ userName, verificationCode }: Props) {
  return (
    <Html lang="es">
      <Body
        style={{ backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            backgroundColor: "#10B981",
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
            Solicitud de cambio de correo
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
            Has solicitado el cambio de correo electrónico de acceso a tu cuenta
            de EduPrompt. Dentro de la app ingresa el siguiente código de
            verificación para realizar el cambio. El código tiene una validez de
            15 minutos.
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
              Código de verificación
            </Text>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "14px 28px",
              }}
            >
              <Img
                src="https://res.cloudinary.com/dy3rkkfjw/image/upload/v1774449262/at-icon_npg7uz.png"
                width="30"
                height="30"
                alt="lock-icon"
                style={{ verticalAlign: "middle", margin: "0 auto" }}
              />
              <span
                style={{
                  color: "#10B981",
                  fontSize: "34px",
                  fontWeight: 700,
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                }}
              >
                {verificationCode}
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
