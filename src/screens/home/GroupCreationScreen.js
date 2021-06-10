import * as firebase from "firebase";
import React, { useState } from "react";
import {
    Alert, FlatList, StyleSheet,


    Text,
    TextInput, TouchableOpacity, View
} from "react-native";
import { Divider } from "react-native-paper";
import GroupCreationTopTab from "../../components/GroupCreationTopTab";
import {
    TextSection, UserImg, UserImgWrapper, UserInfo,


    UserInfoText,
    UserName
} from "../../styles/MessageStyles";

export default function GroupCreationScreen({ props, route, navigation }) {
    const currentUserId = firebase.auth().currentUser.uid;
    var currentUserCreatedAt;
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(false);

    const { threads } = route.params;
    const [users, setUsers] = useState(threads);
    const [itemChecked, setItemChecked] = useState(false);
    const [members, setMembers] = useState([]);


    const concatList = (list) => {
        let str = "";
        list.sort()
        for (let i = 0; i < list.length; i++) {
            str = str + list[i].substring(0, 6)
        }
        return str;
    };

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = users.filter(function (item) {
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
            setFilteredDataSource(users);
            setSearch(text);
        }
    };

    const selectItem = (key) => {
        let selectedUsers = users;
        for (let item of selectedUsers) {
            if (item.userId == key) {
                item.isSelected = (item.isSelected == null) ? true : !item.isSelected;
                if (item.isSelected) {
                    setMembers(oldArray => [...oldArray, { userId: item.userId, name: item.name }])
                } else {
                    setMembers(members.filter(mem => mem.userId != item.userId))
                }
                setItemChecked((prevState) => !prevState);
                break;
            }
        }
        setUsers(selectedUsers);
    }

    const createGroupChat = () => {
        if (members.length <= 1) {
            Alert.alert(
                "Too little members to start a group!",
                "Choose at least 2 people to join you."
            );
        } else if (members.length > 4) {
            Alert.alert(
                "Too many members selected!",
                "You can only select up to 4 members."
            );
        } else {
            // Group chat creation
            const users = []
            users[0] = currentUserId;
            for (let i = 0; i < members.length; i++) {
                users[i+1] = members[i].userId
            }
            navigation.navigate('InitGroupChatScreen', { users });
        }
    }

    return (
        <View style={styles.container}>
            <GroupCreationTopTab text={'Create a group'}
                onBack={() => navigation.goBack()} onPress={() => createGroupChat()} />
            <View style={styles.selected}>
                <Text style={styles.subHeader}>
                    Choose up to 4 members to join you! | {members.length} selected.
                </Text>
                <FlatList
                    numColumns={4}
                    data={members}
                    renderItem={({ item }) => (
                        <Text style={styles.member}>
                            {item.name}
                        </Text>
                    )}
                    keyExtractor={(item) => item.name}
                    extraData={itemChecked}
                />
            </View>
            <TextInput
                style={styles.textInputStyle}
                onChangeText={(text) => searchFilterFunction(text)}
                value={search}
                placeholder="Search Here"
            />
            <FlatList
                data={filtered ? filteredDataSource : users}
                keyExtractor={(item) => item.name}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => selectItem(item.userId) }
                        style={{ width: '100%', backgroundColor: item.isSelected ? '#DDD' : '#FFF'}}
                    >
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={{ uri: item.avatar }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.name}</UserName>
                                </UserInfoText>
                                <Text style={styles.text}>{item.bio}</Text>
                            </TextSection>
                        </UserInfo>
                    </TouchableOpacity>
                )}
                extraData={itemChecked}
                style={{ marginBottom: 40, }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
    },
    subHeader: {
        color: 'black',
        fontSize: 16,
        paddingLeft:8,
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: "#ff8c00",
        backgroundColor: "#FFFFFF",
    },
    listTitle: {
        fontSize: 22,
    },
    listDescription: {
        fontSize: 16,
    },
    header: {
        fontSize: 35,
        textAlign: "right",
        backgroundColor: "#ff8c00",
        padding: 10,
        color: "#ffffff",
    },
    text: {
        color: 'black',
        fontSize: 14,
    },
    member: {
        color: 'black',
        fontSize: 16,
        paddingLeft: 8,
        paddingRight: 8,
    }
});