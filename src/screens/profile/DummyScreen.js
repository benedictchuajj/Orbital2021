import * as React from "react";
import { Text, View } from "react-native";
import BackButton from "../../components/BackButton";
import { trendingScore, newScore } from '../../api/ranking';

export default function DummyScreen({ navigation }) {
    console.log(trendingScore(100,100,40000));
    console.log(trendingScore(100,90,40000));
    //console.log(newScore(10));
    //console.log(newScore(100));
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <BackButton goBack={navigation.goBack} />
            <Text>Work In Progress</Text>
        </View>
    );
}