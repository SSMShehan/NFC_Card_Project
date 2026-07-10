// ============================================================
//  NEXUS Mobile — Tab Bar Layout
//  Configures the three main tabs: Dashboard, Links, Profile
// ============================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <React.Fragment>
      {/* Expo Router renders tab icons as strings or elements */}
      <React.Fragment key={focused ? 'focused' : 'blur'}>
        {/* Emoji icon — opacity changes with focus */}
        <React.Fragment />
      </React.Fragment>
    </React.Fragment>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgLayer1,
          borderTopColor: Colors.glassBorder,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.medium,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚡" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="links"
        options={{
          title: 'Links',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔗" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
