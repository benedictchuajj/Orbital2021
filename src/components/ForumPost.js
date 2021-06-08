import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";

import ProgressiveImage from "./ProgressiveImage";

import moment from "moment";
import * as firebase from "firebase";

const ForumPost = ({
    route,
    item,
    onViewProfile,
    onDelete,
    onPress,
    onReport,
    onEdit,
}) => {
    const currentUserId = firebase.auth().currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [upvoted, setUpvoted] = useState(null);
    const [downvoted, setDownvoted] = useState(null);
    const [votes, setVotes] = useState(null);

    var commentText;

    if (item.commentCount == 1) {
        commentText = "1 Comment";
    } else if (item.commentCount > 1) {
        commentText = item.commentCount + " Comments";
    } else {
        commentText = "Comment";
    }

    const getUser = async () => {
        await firebase
            .firestore()
            .collection("users")
            .doc(item.userId)
            .get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setUserData(documentSnapshot.data());
                }
            });
    };

    const checkVoted = async () => {
        await firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const { voted } = snapshot.data();
                    if (voted == 1) {
                        setUpvoted(true);
                        setDownvoted(false);
                    } else {
                        setUpvoted(false);
                        setDownvoted(true);
                    }

                } else {
                    setUpvoted(false);
                    setDownvoted(false);
                }
            });
    };

    const upVote = async () => {
        if (downvoted) {
            item.votes = item.votes + 2;
        } else {
            item.votes = item.votes + 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .set({ voted: 1 });
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(true);
        setDownvoted(false);
    };

    const downVote = async () => {
        if (upvoted) {
            item.votes = item.votes - 2;
        } else {
            item.votes = item.votes - 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .set({ voted: -1 });
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(false);
        setDownvoted(true);
    };

    const unVote = async () => {
        if (upvoted) {
            item.votes = item.votes - 1;
        } else {
            item.votes = item.votes + 1;
        }
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .collection("votes")
            .doc(currentUserId)
            .delete();
        firebase
            .firestore()
            .collection("forums")
            .doc(item.forumId)
            .collection("forumPosts")
            .doc(item.postId)
            .update({ votes: item.votes });
        setVotes(item.votes);
        setUpvoted(false);
        setDownvoted(false);
    };

    useEffect(() => {
        getUser();
        checkVoted();
        setVotes(item.votes);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Text style={styles.regularFont}>{'Posted by '}</Text>
                    <Text
                        style={styles.username}
                        onPress={() => onViewProfile(currentUserId)}
                    >
                        {userData ? userData.name || "Anonymous User" : "Anonymous User"}
                    </Text>
                    <Text style={styles.regularFont}>
                        {' ·'} {moment(item.postTime.toDate()).fromNow()}
                    </Text>
                </View>
                <View style={styles.headerRight}>
                </View>
            </View>

            <Text style={styles.title} onPress={onPress}>
                {item.postTitle}
            </Text>
            <Text style={styles.text} onPress={onPress}>
                {item.postBody}
            </Text>

            <View style={styles.bottomContainer}>
                <View style={styles.voteContainer}>
                    <TouchableOpacity onPress={() => (upvoted ? unVote(): upVote())}>
                        <MaterialIcons
                            name='arrow-upward'
                            size={32}
                            color={upvoted ? 'lightgreen' : 'darkgray'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.score}>{item.votes}</Text>
                    <TouchableOpacity onPress={() => (downvoted ? unVote(): downVote())}>
                        <MaterialIcons
                            name='arrow-downward'
                            size={32}
                            color={downvoted ? 'crimson' : 'darkgray'}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.centerAlign}
                    activeOpacity={0.7}
                    onPress={onPress}
                >
                    <MaterialIcons
                        name='messenger-outline'
                        size={26}
                        color={'darkgray'}
                    />
                    <Text style={styles.commentText}>{item.commentCount}</Text>
                </TouchableOpacity>
                {currentUserId == item.userId ? (
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onDelete}
                        >
                            <MaterialIcons
                                name='delete'
                                size={26}
                                color={'darkgray'}
                            />
                        </TouchableOpacity>
                        <View style={{ width: 30 }}/>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onEdit}
                        >
                            <MaterialIcons
                                name='edit'
                                size={26}
                                color={'darkgray'}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.centerAlign}
                        activeOpacity={0.7}
                        onPress={onReport}
                    >
                        <MaterialIcons
                            name='report'
                            size={26}
                            color={'darkgray'}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ForumPost;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: "100%",
        marginBottom: 20,
        borderRadius: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingLeft: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {},
    bottomContainer: {
        flexDirection: 'row',
    },
    voteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
    },
    centerAlign: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '33%',
        paddingRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    text: {
        fontSize: 16,
        paddingLeft: 10,
    },
    score: {
        fontSize: 16,
        paddingLeft: 4,
        paddingRight: 4,
        color: 'darkgray',
    },
    commentText: {
        fontSize: 16,
        paddingLeft: 4,
        color: 'darkgray',
    },
    regularFont: {
        fontSize: 14,
    },
    username: {
        fontSize: 14,
        color: 'blue'
    },
});