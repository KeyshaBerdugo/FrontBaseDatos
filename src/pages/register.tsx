import { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonToast,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulación de registro
    await new Promise((r) => setTimeout(r, 600));
    localStorage.setItem("auth_token", "demo-token");
    setSuccess(true);
    setTimeout(() => navigate("/login", { replace: true }), 1000);
  };

  return (
    <IonPage className="register-page">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding register-content">
        <div className="register-card">
          <h2>Crear cuenta</h2>
          <p>Completa tus datos para comenzar</p>

          <form onSubmit={handleRegister}>
            <IonList>
              <IonItem className="custom-input">
                <IonInput
                  label="Nombre completo"
                  labelPlacement="floating"
                  value={nombre}
                  onIonInput={(e) => setNombre(e.detail.value ?? "")}
                  required
                />
              </IonItem>

              <IonItem className="custom-input">
                <IonInput
                  label="Correo electrónico"
                  labelPlacement="floating"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? "")}
                  inputMode="email"
                  required
                />
              </IonItem>

              <IonItem className="custom-input">
                <IonInput
                  type="password"
                  label="Contraseña"
                  labelPlacement="floating"
                  value={pwd}
                  onIonInput={(e) => setPwd(e.detail.value ?? "")}
                  required
                />
              </IonItem>

              <div className="ion-padding">
                <IonButton expand="block" type="submit" className="btn-register">
                  Registrarse
                </IonButton>
              </div>
            </IonList>
          </form>
        </div>

        <IonToast
          isOpen={success}
          message="Registro exitoso"
          duration={1000}
          position="top"
          color="success"
          onDidDismiss={() => setSuccess(false)}
        />
      </IonContent>
    </IonPage>
  );
}
