import React, { useState, useEffect, useId } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default function App() {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await AsyncStorage.getItem('tasks');
    if (data !== null) {
      setTasks(JSON.parse(data));
    }
  }

  async function addTask() {
    if (input.trim() === '') return; // Prevent adding empty tasks
    const task = { id: Date.now(), name: input };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setInput('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tarefas</Text>
      <View style={styles.viewInputBtn}>
        <TextInput
          style={styles.inputTask}
          value={input}
          placeholder="Adicionar Tarefa"
          onChangeText={(text) => setInput(text)}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => <Item title={item.name} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  viewInputBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  inputTask: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '90%',
    marginBottom: 10,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});