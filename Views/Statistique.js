import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../composant/Navbar';

export default function Statistique() {
   // Variables d'état pour stocker les données  des statistiques et jeton
  const nav = useNavigation();
  const route = useRoute();
  const [token, setToken] = useState('');
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [lieu, setLieu] = useState('');
  const [but, setBut] = useState('');
  const [rouge, setRouge] = useState('');
  const [jaune, setJaune] = useState('');
  const [stats, setStats] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);

  // Variables d'état pour les modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleStat, setModalVisibleStat] = useState(false);
  

// Fonction pour ouvrir la modale d'ajout de statistique
  const openModal = () => {
    setModalVisible(true);
  };

// Fonction pour fermer la modale d'ajout de statistique
  const closeModal = () => {
    setModalVisible(false);
  };

 // Fonction pour ouvrir la modale de supression de statistique
  const handleCardPress = (stat) => {
    setSelectedStat(stat);
    setModalVisibleStat(true);
  };

// Fonction pour vérifier input but
  const handleButChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '').substr(0, 2);
    setBut(numericValue);
  };

// Fonction pour vérifier input jaune
  const handleJauneChange = (text) => {
    const numericValue = text.replace(/[^0-2]/g, '').charAt(0);
    setJaune(numericValue);
  };

// Fonction pour vérifier input rouge
  const handleRougeChange = (text) => {
    const numericValue = text.replace(/[^0-1]/g, '').charAt(0);
    setRouge(numericValue);
  };

// Fonction pour gérer le changement de date
  const handleDateChange = (text) => {
    setDate(text);
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Format de date : DD/MM/AAAA
    if (dateRegex.test(text)) {
     
    }
  };

// Fonction pour récupérer le jeton d'utilisateur depuis AsyncStorage
  const getToken = async () => {
    const a = await AsyncStorage.getItem('token');
    if (a !== null) {
      setToken(a);
    } else {
      nav.navigate('Login');
    }
  };

// Utiliser  useEffect pour exécuter getToken() et setStats() 
  useEffect(() => {
     setStats([]); // Réinitialiser la liste des statistiques
    const joueurId = route.params?.joueurId;
    if (joueurId) {
      setId(joueurId);
    }
    getToken();
  }, [route.params]);

// Utiliser  useEffect pour exécuter ListStats() lorsque l'identifiant du joueur change
  useEffect(() => {
    if (id) {
      ListStats();
    }
  }, [id]);

  // Fonction pour récupérer la liste des selections depuis le serveur
  const ListStats = async () => {
    try {
      const response = await fetch('http://10.192.37.187:1234/listStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,   // Utiliser le jeton d'authentification
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (response.status === 400 || response.status === 404) {
        alert(data.erreur);  // afficher le message d'erreur
      } else {
        setStats(data.data); // remplir le tableau avec les informations
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des statistiques');
    }
  };

// Fonction pour ajouter une statistique
  const AddStat = async () => {
    try {
      const response = await fetch('http://10.192.37.187:1234/addStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Utiliser le jeton d'authentification
        },
        body: JSON.stringify({ id, date, lieu, but, rouge, jaune }),
      });

      const data = await response.json();
      if (response.status === 400 || response.status === 404) {
        alert(data.erreur); // afficher le message d'erreur
      } else {
       // vider le formulaire
        setDate('');
        setJaune('');
        setLieu('');
        setRouge('');
        setBut('');
        
        closeModal();  // fermer la modale après l'ajout
        ListStats(); // Rafraîchir la liste des statistiques après l'ajout
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de la statistique');
    }
  };

// Fonction pour supprimer une statistique
  const handleButtonPress = async () => {
      // renseigner la date selectionner
    const date = selectedStat.date;
    try {
      const response = await fetch('http://10.192.37.187:1234/deleteStat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,  // Utiliser le jeton d'authentification
        },
        body: JSON.stringify({ id, date }),
      });

      const data = await response.json();
      if (response.status === 400 || response.status === 404) {
        alert(data.erreur); // afficher le message d'erreur
      } else {
         setModalVisibleStat(false); // fermer la modale de supression
         setStats([]); // Réinitialiser la liste des statistiques
         ListStats();  // Rafraîchir la liste des statistique après  la suppression
       
       
      }
    } catch (error) {
       Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression de la statistique');
    }
  };

// Rendre l'interface utilisateur 
  return (
    <ImageBackground style={{ flex: 1, height: '100%' }} resizeMode='cover'>
      <ScrollView style={styles.scrollView}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Lieu</Text>
            <Text style={styles.tableHeaderCell}>Buts</Text>
            <Image source={require('../assets/jaune.png')} style={styles.cardImage} />
            <Image source={require('../assets/rouge.png')} style={styles.cardImage} />
          </View>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} onPress={() => handleCardPress(stat)}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{stat.date}</Text>
                <Text style={styles.tableCell}>{stat.lieu}</Text>
                <Text style={styles.tableCell}>{stat.but}</Text>
                <Text style={styles.tableCell}>{stat.jaune}</Text>
                <Text style={styles.tableCell}>{stat.rouge}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{ justifyContent: 'flex-end', flex: 1 }}>
        <Navbar />
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ajouter une Statistique</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Date (DD/MM/AAAA)"
                  placeholderTextColor="#aaa"
                  value={date}
                  onChangeText={handleDateChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Lieu"
                  placeholderTextColor="#aaa"
                  value={lieu}
                  onChangeText={setLieu}
                />
                <TextInput
                  style={styles.input}
                  placeholder="But"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={but}
                  onChangeText={handleButChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Jaune"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={jaune}
                  onChangeText={handleJauneChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Rouge"
                  placeholderTextColor="#aaa"
                  value={rouge}
                  onChangeText={handleRougeChange}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.closeButton} onPress={AddStat}>
                  <Text style={styles.closeButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {selectedStat && (
        <Modal
          visible={modalVisibleStat}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisibleStat(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisibleStat(false)}>
            <View style={styles.modalContainer1}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent1}>
                  <Text style={styles.modalTitle1}>
                    Date Statistique Selectionner : {selectedStat.date}
                  </Text>
                  <TouchableOpacity style={styles.closeButton2} onPress={handleButtonPress}>
                    <Text style={styles.closeButtonText}>Supprimer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeButton1}
                    onPress={() => setModalVisibleStat(false)}
                  >
                    <Text style={styles.closeButtonText}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  closeButton1: {
    backgroundColor: 'black',
    padding: 10,
    margin: 20,
  },
  closeButton2: {
    backgroundColor: 'red',
    padding: 10,
    margin: 20,
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle1: {
    fontSize: 20,
    marginBottom: 20,
  },
  cardImage: {
    marginTop: 7,
    height: 30,
    resizeMode: 'contain',
  },
  scrollView: {
    maxHeight: 400,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#458D25',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'black',
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
});
