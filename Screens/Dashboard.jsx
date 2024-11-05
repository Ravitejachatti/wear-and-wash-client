import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersByCenter, fetchusers, acceptUser, rejectUser } from '../Redux/App/action'; // Import actions
import { getData } from '../Storage/getData';

const Dashboard = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true); // Local loading state
    const [actionLoading, setActionLoading] = useState(false); // Loading state for actions

    useEffect(() => {
        const fetchData = async () => {
            let location = await getData('userLocation');
            const centerName = JSON.parse(location); // Use const to declare centerName
            setLoading(true); // Set loading to true when starting to fetch
            try {
                dispatch(getUsersByCenter(centerName)); // Dispatch the action
                dispatch(fetchusers(centerName));
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false); // Set loading to false after fetch completes
            }
        };

        fetchData(); // Call the fetchData function
    }, [dispatch]);

    const tempusers = useSelector((state) => state.app.tempusers); // Access users from Redux store
    const users = useSelector((state) => state.app.users);

    // console.log("tempusers ", tempusers);
    // console.log("users ", users);

    const handleAccept = async (userId) => {
        setActionLoading(true); // Set action loading to true
        try {
            await dispatch(acceptUser(userId)); // Wait for the action to complete
            // console.log("accepted");
        } catch (error) {
            console.error("Error accepting user:", error);
        } finally {
            setActionLoading(false); // Reset action loading state
        }
    };

    const handleReject = async (userId) => {
        setActionLoading(true); // Set action loading to true
        try {
            await dispatch(rejectUser(userId)); // Wait for the action to complete
            // console.log("rejected");
        } catch (error) {
            console.error("Error rejecting user:", error);
        } finally {
            setActionLoading(false); // Reset action loading state
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>Name: {item.name}</Text>
            <Text style={styles.itemText}>Email: {item.email}</Text>
            <Text style={styles.itemText}>Phone: {item.phone}</Text>
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.buttonAccept}
                    onPress={() => handleAccept(item._id)}
                    disabled={actionLoading} // Disable button when loading
                >
                    <Text style={styles.buttonText}>
                        {actionLoading ? 'Loading...' : 'Accept'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonReject}
                    onPress={() => handleReject(item._id)}
                    disabled={actionLoading} // Disable button when loading
                >
                    <Text style={styles.buttonText}>
                        {actionLoading ? 'Loading...' : 'Reject'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Show loading indicator while data is being fetched
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading users...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.userCountText}>
                Total Users: {users.length} {/* Display user count */}
            </Text>
            <Text style={styles.userCountText}>
                Requested Users: {tempusers.length}
            </Text>
            <FlatList
                data={tempusers}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                extraData={tempusers}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Adds a shadow effect for Android
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    buttonAccept: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    buttonReject: {
        backgroundColor: '#F44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    userCountText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    itemText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
});

export default Dashboard;
