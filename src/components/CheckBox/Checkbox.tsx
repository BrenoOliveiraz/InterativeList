import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { CheckIcon } from 'native-base';

export default function Checkbox() {
    const [selected, setSelected] = useState(false);

    const handlePress = () => {
        setSelected(!selected);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handlePress}>
                {selected && <CheckIcon size="5" mt="0.5" color="emerald.500" />}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    touchable: {
        height: 20,
        width: 20,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 1,
    },
});
