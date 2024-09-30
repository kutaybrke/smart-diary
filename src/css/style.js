import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    moodWrapper: {
        alignItems: 'center',
        margin: 10,
    },
    moodButton: {
        width: width * 0.15,
        height: width * 0.15,
        borderRadius: (width * 0.15) / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moodButtonText: {
        fontSize: width * 0.1,
        color: '#fff',
    },
    moodLabel: {
        marginTop: 5,
        fontSize: width * 0.04,
        color: '#000',
    },
    summaryContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    imageWrapper: {
        position: 'absolute',
        top: height * 0.04,
        left: width * 0.25,
        width: width * 0.7,
        height: width * 0.7,
    },
    imageFrame: {
        width: '70%',
        height: '70%',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
        borderRadius: 10,
    },
    imagePlaceholder: {
        color: '#aaa',
    },
    floatingIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingIconText: {
        fontSize: 30,
    },
    headingText: {
        fontSize: 25,
    },
    weatherContainer: {
        alignItems: 'center',
        marginRight: 170,
        marginVertical: 20,
    },
    weatherLocation: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    weatherText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
    },
    weatherDescription: {
        fontSize: 18,
        color: '#555',
    },
    weatherIcon: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    chatBotButton: {
        width: 150,
        height: 150,
        backgroundColor: '#007bff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 70,
        right: -20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    chatBotButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default styles;
