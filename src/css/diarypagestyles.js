import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const diarypagestyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    entryContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        margin: 5,
        minHeight: width / 2 - 20,
        position: 'relative',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
    },
    entryContent: {
        paddingTop: 40,
    },
    entryText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 15,
        color: 'black',
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 5,
        right: 6,
    },
});

export default diarypagestyles;
