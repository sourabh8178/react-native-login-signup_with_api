import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faCheckCircle, faWallet, faSignOutAlt, faUsers, faShield, faLock, faBan, faCreditCard, faUserFriends, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
const ProfileSetting = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.menu}>
        <Text style={styles.menuHead}>Account</Text>
          <MenuItem icon={faEdit} label="Edit My Porfile" onPress={() => navigateTo('EditMyProfile')} />
          <MenuItem icon={faCheckCircle} label="Verified Account" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faWallet} label="Wallet: $2.3" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faSignOutAlt} label="Logout" onPress={() => navigateTo('Search')} />
        </View>

        <View style={styles.menu}>
        <Text style={styles.menuHead}>Subscription</Text>
          <MenuItem icon={faUsers} label="Subscription Price" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faUsers} label="My Subscribers" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faUsers} label="My Subscriptions" onPress={() => navigateTo('Search')} />
        </View>

        <View style={styles.menu}>
        <Text style={styles.menuHead}>Privacy and Security</Text>
          <MenuItem icon={faShield} label="Privacy and Security" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faLock} label="Password" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faUserFriends} label="Block Countries" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faBan} label="Restricted Users" onPress={() => navigateTo('Search')} />
        </View>

        <View style={styles.menu}>
        <Text style={styles.menuHead}>Payments</Text>
          <MenuItem icon={faWallet} label="Payments" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faCreditCard} label="Payments Received" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faCreditCard} label="Payout Method" onPress={() => navigateTo('Search')} />
          <MenuItem icon={faCreditCard} label="Withdrawals" onPress={() => navigateTo('Search')} />
        </View>
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.subMenu} onPress={onPress}>
    <Text style={styles.menuItemText}>
      <FontAwesomeIcon icon={icon} size={20} color="black" /> {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuHead: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menu: {
    marginBottom: 20,
    paddingLeft: "6%",
    paddingBottom: 25,
    paddingTop: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  subMenu: {
    // paddingVertical: 10,
    fontSize: 18,
    paddingBottom: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuItemText: {
    fontSize: 20,
    // color: 'black',
    fontWeight: 'bold'
  },
});

export default ProfileSetting;
