import { StyleSheet, View, Button } from 'react-native';
import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

import EditScreenInfo from '../../components/EditScreenInfo';

export default function TabOneScreen() {

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
      android: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    }).then((status) => {
      console.log('Notification permissions:', status);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      console.log('NOTIF', notification);
      const count = await Notifications.getBadgeCountAsync();
      console.log('COUNT', count);
      await Notifications.setBadgeCountAsync(count + 1);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
      console.log('responseListener', response);
      alert(response.notification.request.content.data.data);
      await Notifications.setBadgeCountAsync(0);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current as Notifications.Subscription);
      Notifications.removeNotificationSubscription(responseListener.current as Notifications.Subscription);
    };
  }, []);

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'You have a new message 📬',
        body: 'Hello, world! This is a test notification 🚀',
        data: { data: 'secret message' },
      },
      trigger: { seconds: 2 },
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Press to schedule a notification" onPress={schedulePushNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
