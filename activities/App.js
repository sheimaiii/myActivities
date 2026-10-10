import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar
} from 'react-native';
import TaskItem from './TaskItem';
import { styles } from './styles';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Learn React Native state hooks', completed: false, priority: 'high' },
    { id: '2', title: 'Build custom TouchableOpacity buttons', completed: true, priority: 'medium' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleAddTask = () => {
    if (!inputText.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: inputText.trim(),
      completed: false,
      priority: 'medium'
    };
    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const handleToggleTask = (id) => {
    setTasks(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>{tasks.filter(t => !t.completed).length} items remaining</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a new task..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={() => handleToggleTask(item.id)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found. Add one above!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}