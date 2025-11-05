import { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonInput,
  IonButton, IonToast
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import "../styles/register.scss";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8081/api/users?password=${encodeURIComponent(pwd)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          username: nombre,
          status: "ACTIVE",
          role: "USER"
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error creando usuario");
      }

      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    } catch (err: any) {
      setError(err.message);
    }
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
                <IonButton expand="block" type="submit" className="btn-register" color="success">
                  Registrarse
                </IonButton>
                {/* ✅ Botón para volver a Home */}
                <IonButton
                  expand="block"
                  color="medium"
                  onClick={() => navigate("/home")}
                  style={{ marginTop: "10px" }}
                >
                  Volver a Home
                </IonButton>
              </div>
            </IonList>
          </form>
        </div>

        {/* Toasts */}
        <IonToast
          isOpen={success}
          message="Registro exitoso"
          duration={1000}
          position="top"
          color="success"
          onDidDismiss={() => setSuccess(false)}
        />

        <IonToast
          isOpen={!!error}
          message={error}
          duration={2000}
          position="top"
          color="danger"
          onDidDismiss={() => setError("")}
        />
      </IonContent>
    </IonPage>
  );
}