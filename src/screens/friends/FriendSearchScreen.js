import * as firebase from "firebase";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
} from "react-native";

export default function FriendSearchScreen({ props, navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    const [search, setSearch] = useState("");
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState(false);

    const getAllUsers = async () => {
        const users = [];

        await firebase
            .firestore()
            .collection("users")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const { name, bio, userImg, email, createdAt } = doc.data();
                    users.push({
                        userId: doc.id,
                        name,
                        bio,
                        email,
                        createdAt: createdAt,
                    });
                });
            });
        console.log("Users: ", users);
        setMasterDataSource(users);
        setLoading(false);
    };

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.name
                    ? item.name.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFiltered(true);
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <Text
                style={styles.itemStyle}
                onPress={() =>
                    currentUserId == item.userId
                        ? navigation.navigate("Profile")
                        : navigation.navigate("ViewProfileScreen", { item })
                }
            >
                {item.name}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: "#C8C8C8",
                }}
            />
        );
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View styles={styles.searchBar}>
                    <TextInput
                        style={styles.textInputStyle}
                        onChangeText={(text) => searchFilterFunction(text)}
                        value={search}
                        placeholder="Search Here"
                    />
                    {search !== "" ? (
                        <TouchableOpacity
                            style={styles.closeButtonParent}
                            onPress={() => {
                                setFilteredDataSource(masterDataSource);
                                setSearch("");
                            }}
                        >
                            <Image
                                style={styles.closeButton}
                                source={require("../../assets/close-circle-outline.png")}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <FlatList
                    data={filtered ? filteredDataSource : masterDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={ItemSeparatorView}
                    renderItem={ItemView}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    itemStyle: {
        padding: 10,
        fontSize: 20,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
    },
    searchBar: {
        flexDirection: "row",
    },
    closeButtonParent: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginRight: 10,
        flex: 1,
    },
    closeButton: {
        height: 20,
        width: 20,
        marginBottom: 16,
    },
});