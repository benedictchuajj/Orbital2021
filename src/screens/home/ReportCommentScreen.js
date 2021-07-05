import * as firebase from 'firebase'
import React from 'react'
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import ReportPostTopTab from '../../components/ReportPostTopTab'

export default function ReportCommentScreen ({ props, navigation, route, goBack }) {
  const currentUserId = firebase.auth().currentUser.uid
  const comment = route.params.comment
  console.log(comment)

  const majors = [
    { name: 'Spam' },
    { name: 'Sexual Activity' },
    { name: 'Hate Speech' },
    { name: 'Violence' },
    { name: 'Bullying/Harassment' },
    { name: 'False Information' }
  ]

  const ItemView = ({ item }) => {
    return (
      <Text
        style={styles.itemStyle}
        onPress={() => {
          firebase
            .firestore()
            .collection('reports')
            .doc('userComments')
            .collection('reported')
            .doc(comment.commentId)
            .collection('reporters')
            .doc(currentUserId)
            .set({ reason: item.name, postId: comment.postId })
          Alert.alert('Thank you!', 'Your report has been submitted.')
          navigation.goBack()
        }}
      >
        {item.name}
      </Text>
    )
  }
  const ItemSeparatorView = () => {
    return (
    // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8'
        }}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ReportPostTopTab onPress={() => navigation.goBack()} />
        <FlatList
          data={majors}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  itemStyle: {
    padding: 10,
    fontSize: 20
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#ff8c00',
    backgroundColor: '#FFFFFF'
  },
  title: {
    height: 60,
    lineHeight: 60,
    width: '100%',
    backgroundColor: '#ff8c00',
    color: '#ffffff',
    fontSize: 30,
    paddingLeft: 15,
    marginBottom: 10
  }
})
