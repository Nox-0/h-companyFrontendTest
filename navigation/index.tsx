import React from 'react';
import {StyleSheet, Text, SafeAreaView, ScrollView, StatusBar, Pressable} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

interface Props {
  icon: string;
}

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} horizontal={true}>
        <Pressable disabled={true} style={styles.pressable}>
          <Ionicons name={"search"} size={20}/>
        </Pressable>
        <Pressable disabled={true} style={styles.pressable}>
          <Text>All 424</Text>
        </Pressable>
        <Pressable disabled={true} style={[styles.pressable, styles.current]}>
          <Text style={styles.current}>0 Abnormal 1</Text>
        </Pressable>
        <Pressable disabled={true} style={styles.pressable}>
          <Text>On Heat</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10 + StatusBar.currentHeight,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  button: {
    padding: 20,
  },
  pressable: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor: "#f0ecec",
    marginHorizontal: 5,
  },
  current: {
    color: '#fff',
    backgroundColor: "#000",
  }
});

export default App;
