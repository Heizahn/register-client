import { TextInput, type TextInputProps, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState, useRef } from "react";
import { Keyboard } from "react-native";

export type ThemedInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    exitFocus: boolean;
    setExitFocus: (exit: boolean) => void;
};

export function ThemedInput({
    lightColor,
    darkColor,
    exitFocus,
    setExitFocus,
    ...rest
}: ThemedInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
        setIsFocused(true);
        setExitFocus(false);
    };

    const handleBlur = () => {
        setExitFocus(true);
        setIsFocused(false);
    };

    useEffect(() => {
        if (exitFocus && inputRef.current) {
            // Quita el foco programáticamente
            inputRef.current.blur();
            // Asegura que el teclado se oculte
            Keyboard.dismiss();
            setIsFocused(false);
        }
    }, [exitFocus]);

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: isFocused ? color : "transparent",
                },
            ]}
        >
            <TextInput
                ref={inputRef}
                style={{ color }}
                placeholderTextColor={color}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        marginVertical: 10,
        paddingVertical: 2,
        paddingHorizontal: 15,
        borderWidth: 2,
    },
});
