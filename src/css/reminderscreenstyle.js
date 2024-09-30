import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    overlayContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
        borderRadius: 50,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
        borderRadius: 10,

    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 3,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,

    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    dayButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        margin: 5,
    },
    dayButtonSelected: {
        backgroundColor: '#007bff',
    },
    dayText: {
        color: '#007bff',
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 10,

    },
    switchLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    selectedTime: {
        fontSize: 16,
        marginVertical: 10,

    },
    selectedDays: {
        fontSize: 16,
        marginVertical: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,

    },
    pickerWrapper: {
        flex: 1,
        marginHorizontal: 10,
    },
    picker: {
        height: 150,
    },
    reminderItem: {
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reminderInfo: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        margin: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        margin: 10,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 10, 
    },
    timeContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 10,
    },
    dayContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 10,
    },
});

export default styles;
