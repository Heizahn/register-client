import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    Button,
    TouchableOpacity,
    View,
    Alert,
    Image,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedInput } from "./ThemeInput";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [exitFocus, setExitFocus] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
    const colorScheme = useColorScheme();
    const router = useRouter();

    // Verificar si el dispositivo soporta autenticación biométrica
    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);

            if (compatible) {
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                setIsBiometricEnrolled(enrolled);
            }
        })();
    }, []);

    const handleSubmit = async () => {
        try {
            if (email === "test@test.com" && password === "123456") {
                router.replace("/register");
            } else {
                setError("Email o password incorrectos");
            }
        } catch (error) {
            setError("Error al iniciar sesión");
        }
    };

    const handleBiometricAuth = async () => {
        try {
            // Verificar si la autenticación biométrica está disponible
            if (!isBiometricSupported) {
                Alert.alert(
                    "Error",
                    "La autenticación biométrica no está soportada en este dispositivo"
                );
                return;
            }

            if (!isBiometricEnrolled) {
                Alert.alert(
                    "No hay huellas registradas",
                    "No hay huellas digitales registradas en este dispositivo. Por favor, configura la autenticación biométrica en la configuración de tu dispositivo."
                );
                return;
            }

            // Iniciar autenticación biométrica
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Inicia sesión con tu huella digital",
                cancelLabel: "Cancelar",
                disableDeviceFallback: false,
            });

            if (result.success) {
                // Si la autenticación biométrica es exitosa, iniciar sesión automáticamente
                // Aquí podrías usar credenciales guardadas previamente o un token
                router.replace("/register");
            } else {
                // Si la autenticación falla o es cancelada
                if (result.error === "user_cancel") {
                    // El usuario canceló la autenticación
                    console.log("Autenticación cancelada por el usuario");
                } else {
                    setError(
                        "Autenticación fallida. Por favor, intenta de nuevo."
                    );
                }
            }
        } catch (error) {
            console.error("Error en autenticación biométrica:", error);
            setError("Error al intentar la autenticación biométrica");
        }
    };

    const handleBlur = () => {
        setExitFocus(true);
    };

    return (
        <TouchableOpacity onPress={handleBlur} activeOpacity={1}>
            <ThemedView
                style={{
                    ...styles.container,
                    backgroundColor:
                        colorScheme === "dark"
                            ? Colors.dark.background
                            : Colors.light.background,
                }}
            >
                <ThemedText type="title" style={styles.title}>
                    Iniciar sesión
                </ThemedText>
                <ThemedInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setError("");
                    }}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <ThemedInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setError("");
                    }}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                    secureTextEntry
                />

                <View style={styles.button}>
                    <Button title="Iniciar sesión" onPress={handleSubmit} />
                </View>

                {/* Botón de autenticación biométrica */}
                {isBiometricSupported && (
                    <TouchableOpacity
                        style={styles.biometricButton}
                        onPress={handleBiometricAuth}
                    >
                        <ThemedText style={styles.biometricText}>
                            Iniciar sesión con huella digital
                        </ThemedText>
                        <View style={styles.fingerPrintIcon}>
                            {/* Se podría usar un ícono aquí, pero para simplicidad usamos un emoji */}
                            <Text style={styles.fingerPrintEmoji}>👆</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        borderRadius: 10,
    },
    title: {
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
        marginBottom: 15,
    },
    biometricButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    biometricText: {
        marginRight: 10,
    },
    fingerPrintIcon: {
        alignItems: "center",
        justifyContent: "center",
    },
    fingerPrintEmoji: {
        fontSize: 24,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
});
