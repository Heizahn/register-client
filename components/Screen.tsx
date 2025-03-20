import { StyleSheet, View } from "react-native";
import { ThemedView } from "./ThemedView";

export default function Screen({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            <ThemedView style={styles.content}>{children}</ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
        paddingBottom: 4,
        paddingHorizontal: 8,
    },
    content: {
        width: "100%",
        height: "100%",
    },
});
