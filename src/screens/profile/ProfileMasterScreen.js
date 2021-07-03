import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet
} from 'react-native'
import CommentScreen from '../home/CommentScreen'
import AccountSettingsScreen from './AccountSettingsScreen'
import AddBioScreen from './AddBioScreen'
import AddFacultyScreen from './AddFacultyScreen'
import BusinessMajorsScreen from './BusinessMajorsScreen'
import ChangeNameScreen from './ChangeNameScreen'
import ChangePasswordScreen from './ChangePasswordScreen'
import CHSMajorsScreen from './CHSMajorsScreen'
import ComputingMajorsScreen from './ComputingMajorsScreen'
import DesignMajorsScreen from './DesignMajorsScreen'
import DummyScreen from './DummyScreen'
import EngineeringMajorsScreen from './EngineeringMajorsScreen'
import ProfilePersonalScreen from './ProfilePersonalScreen'
import ProfilePostsScreen from './ProfilePostsScreen'
import UpdateEmailScreen from './UpdateEmailScreen'
import MatchHistoryScreen from './MatchHistoryScreen'
import EditPostScreen from '../home/EditPostScreen'
import ChatScreen from '../home/ChatScreen'
import ViewProfileScreen from './ViewProfileScreen'
import GroupInfoScreen from '../home/GroupInfoScreen'
import EditGroupScreen from '../home/EditGroupScreen'

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator()

function ProfileHomeTabs () {
  return (
    <Tab.Navigator
      tabBarOptions={{
        pressColor: '#ffa500',
        pressOpacity: 'ffa500',
        indicatorStyle: { backgroundColor: '#ff8c00' },
        labelStyle: { fontSize: 14 }
      }}
    >
      <Tab.Screen name='Personal' component={ProfilePersonalScreen} />
      <Tab.Screen name='Posts' component={ProfilePostsScreen} />
      <Tab.Screen name='Matches' component={MatchHistoryScreen} />
    </Tab.Navigator>
  )
}

const ProfileMasterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='ProfileHomeTabs'
          component={ProfileHomeTabs}
        />
        <Stack.Screen
          name='AccountSettingsScreen'
          component={AccountSettingsScreen}
        />
        <Stack.Screen name='DummyScreen' component={DummyScreen} />
        <Stack.Screen name='UpdateEmailScreen' component={UpdateEmailScreen} />
        <Stack.Screen name='AddFacultyScreen' component={AddFacultyScreen} />
        <Stack.Screen name='BusinessMajorsScreen' component={BusinessMajorsScreen} />
        <Stack.Screen name='CHSMajorsScreen' component={CHSMajorsScreen} />
        <Stack.Screen name='ComputingMajorsScreen' component={ComputingMajorsScreen} />
        <Stack.Screen name='DesignMajorsScreen' component={DesignMajorsScreen} />
        <Stack.Screen name='EngineeringMajorsScreen' component={EngineeringMajorsScreen} />
        <Stack.Screen name='AddBioScreen' component={AddBioScreen} />
        <Stack.Screen name='CommentScreen' component={CommentScreen} />
        <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
        <Stack.Screen name='ChangeNameScreen' component={ChangeNameScreen} />
        <Stack.Screen name='EditPostScreen' component={EditPostScreen} />
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} />
        <Stack.Screen name='ChatScreen' component={ChatScreen} />
        <Stack.Screen name='GroupInfoScreen' component={GroupInfoScreen} />
        <Stack.Screen name='EditGroupScreen' component={EditGroupScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  },
  title: {
    fontSize: 32,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#000000'
  }
})

export default ProfileMasterScreen
