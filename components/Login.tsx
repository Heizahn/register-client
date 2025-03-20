import React from "react";
import { Text, StyleSheet, Button, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedInput } from "./ThemeInput";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "./ThemedView";

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [exitFocus, setExitFocus] = React.useState(false);
    const colorScheme = useColorScheme();

    const handleLogin = async () => {
        try {
            if (email === "test@test.com" && password === "123456") {
                console.log("Login exitoso");
            } else {
                setError("Email o password incorrectos");
            }
        } catch (error) {
            setError("Error al intentar acceder");
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
                <ThemedText type="title">Iniciar sesión</ThemedText>
                <ThemedInput
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />
                <ThemedInput
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                    secureTextEntry
                />

                <View style={styles.button}>
                    <Button title="Iniciar sesión" onPress={handleLogin} />
                </View>
                {error && <Text style={{ color: "red" }}>{error}</Text>}
            </ThemedView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
        borderRadius: 10,
    },

    button: {
        marginTop: 10,
    },
});
