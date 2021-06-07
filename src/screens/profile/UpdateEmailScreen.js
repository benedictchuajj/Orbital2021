import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    Platform,
    Animated,
} from "react-native";
import SubmitButton from "../../components/SubmitButton";
import CancelButton from "../../components/CancelButton";
import { FIREBASE_CONFIG } from "../../core/config";
import { logoutUser } from "../../api/auth";
import * as firebase from "firebase";

//issue with promise rejection due to long time since last login, refer to below site
//https://firebase.google.com/docs/auth/web/manage-users

export default class UpdateEmailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: null,
        };
    }

    submitEmail = async (navigator, email) => {
        await firebase
            .auth()
            .currentUser.updateEmail(email)
            .then(() => {
                Alert.alert(
                    "Email successfully changed",
                    "Please login again",
                    [
                        {
                            text: "OK",
                            onPress: navigator,
                        },
                    ],
                    { cancelable: false }
                );
            });
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Enter your new email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type here..."
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            multiline={false}
                        />

                        <View style={styles.buttons}>
                            <CancelButton goBack={() => navigation.goBack()} />
                            <View style={styles.space} />
                            <SubmitButton
                                goBack={() => {
                                    this.state.text != null
                                        ? this.submitEmail(
                                              () => logoutUser(),
                                              this.state.text
                                          )
                                        : Alert.alert(
                                              "Can't update with no email!",
                                              "Enter the new email you want to use."
                                          );
                                }}
                                string={"Update"}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        //    alignItems: 'center',
        //    justifyContent: 'center',
        flexDirection: "row",
    },
    innerContainer: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        height: 60,
        lineHeight: 60,
        width: "100%",
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontSize: 30,
        paddingLeft: 15,
        marginBottom: 10,
    },
    input: {
        flex: 0,
        height: 60,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        fontSize: 18,
        paddingLeft: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
    },
    space: {
        width: 20,
    },
});