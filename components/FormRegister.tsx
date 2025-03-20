import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedInput } from "./ThemeInput";
import {
    Button,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FormRegister() {
    const [formData, setFormData] = useState({
        name: "",
        identity: "",
        rif: "",
        phone: "",
        direction: "",
        coordinates: {
            latitude: "",
            longitude: "",
        },
        plan: "",
        sn: "",
        email: "",
    });
    const [sending, setSending] = useState(false);
    const [exitFocus, setExitFocus] = useState(false);
    const [locationPermission, setLocationPermission] = useState<
        boolean | null
    >(null);

    const color = useThemeColor(
        {
            light: "#000",
            dark: "#fff",
        },
        "text"
    );

    useEffect(() => {
        (async () => {
            // Verificar y solicitar permisos de ubicación al cargar el componente
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === "granted");
        })();
    }, []);

    const handleInputChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCoordinateChange = (
        field: "latitude" | "longitude",
        value: string
    ) => {
        setFormData({
            ...formData,
            coordinates: {
                ...formData.coordinates,
                [field]: value,
            },
        });
    };

    const getCurrentLocation = async () => {
        try {
            // Verificar si ya tenemos permisos
            if (!locationPermission) {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permiso denegado",
                        "Necesitamos permisos de ubicación para obtener tus coordenadas."
                    );
                    return;
                }
                setLocationPermission(true);
            }

            // Obtener ubicación actual
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            // Actualizar el estado con las coordenadas obtenidas
            setFormData({
                ...formData,
                coordinates: {
                    latitude: location.coords.latitude.toString(),
                    longitude: location.coords.longitude.toString(),
                },
            });
        } catch (error) {
            Alert.alert(
                "Error de ubicación",
                "No pudimos obtener tu ubicación actual. Por favor intenta de nuevo o ingresa las coordenadas manualmente."
            );
            console.error("Error getting location:", error);
        }
    };

    const handleSubmit = () => {
        setSending(true);
        setTimeout(() => {
            setSending(false);
        }, 2000);
        console.log(formData);
    };

    const handleBlur = () => {
        setExitFocus(true);
    };

    return (
        <TouchableOpacity onPress={handleBlur} activeOpacity={1}>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>
                    Formulario de Registro
                </ThemedText>
                <ThemedInput
                    placeholder="Nombre Completo"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />
                <ThemedInput
                    placeholder="Cédula de Identidad"
                    value={formData.identity}
                    onChangeText={(text) => handleInputChange("identity", text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />

                <ThemedInput
                    placeholder="RIF"
                    value={formData.rif}
                    onChangeText={(text) => handleInputChange("rif", text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />
                <ThemedInput
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />
                <ThemedInput
                    placeholder="Dirección"
                    value={formData.direction}
                    onChangeText={(text) =>
                        handleInputChange("direction", text)
                    }
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                />

                {/* Sección de coordenadas */}
                <View style={styles.coordinatesContainer}>
                    <View style={styles.labelContainer}>
                        <ThemedText>Coordenadas</ThemedText>
                        <TouchableOpacity
                            style={styles.locationButton}
                            onPress={getCurrentLocation}
                        >
                            <ThemedText style={[styles.locationButtonText]}>
                                Usar mi ubicación
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.coordinatesInputContainer}>
                        <ThemedInput
                            style={[styles.coordinatesInput, { color: color }]}
                            placeholder="Latitud"
                            value={formData.coordinates.latitude}
                            onChangeText={(text) =>
                                handleCoordinateChange("latitude", text)
                            }
                            exitFocus={exitFocus}
                            setExitFocus={setExitFocus}
                            keyboardType="numeric"
                        />

                        <ThemedInput
                            placeholder="Longitud"
                            value={formData.coordinates.longitude}
                            style={[styles.coordinatesInput, { color: color }]}
                            onChangeText={(text) =>
                                handleCoordinateChange("longitude", text)
                            }
                            exitFocus={exitFocus}
                            setExitFocus={setExitFocus}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <ThemedInput
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                    exitFocus={exitFocus}
                    setExitFocus={setExitFocus}
                    keyboardType="email-address"
                />
            </ThemedView>
            <View style={styles.button}>
                <Button
                    title={sending ? "Enviando..." : "Enviar"}
                    onPress={handleSubmit}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingHorizontal: 15,
    },
    button: {
        marginTop: 10,
        paddingHorizontal: 15,
    },
    title: {
        textAlign: "center",
        marginBottom: 15,
    },
    coordinatesContainer: {
        marginVertical: 10,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    coordinatesInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    coordinatesInput: {
        width: 130,
    },

    locationButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    locationButtonText: {
        fontSize: 12,
        color: "white",
    },
});
