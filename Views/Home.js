import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import Navbar from '../composant/Navbar';

export default function Home() {
   // Variables d'état pour stocker les données  des joueurs et jeton
  const nav = useNavigation();
  const [token, setToken] = useState('');
  const [Joueurs, setJoueurs] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [age, setAge] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [selectedJoueur, setSelectedJoueur] = useState(null);

  // Variables d'état pour verifier l'email
  const [isEmailValid, setIsEmailValid] = useState(true);
 
  
  // Variables d'état pour les modales
  const [modalVisibleStat, setModalVisibleStat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

// Fonction pour ouvrir la modale d'ajout d'un joueur
  const openModal = () => {
    setModalVisible(true);
  };

// Fonction pour fermer la modale d'ajout d'un joueur
  const closeModal = () => {
    setModalVisible(false);
  };

 // Fonction pour ouvrir la modale selection d'une action 
  const handleCardPress = (item) => {
    setSelectedJoueur(item);
    setModalVisibleStat(true);
  };

// Fonction pour rediriger vers la page Statistique
  const handleButtonPress = () => {
    setModalVisibleStat(false);
    nav.navigate('Statistique', { joueurId: selectedJoueur.id });
  };

// Fonction pour rediriger vers la page Trophees
  const handleButtonPressTrophees = () => {
    setModalVisibleStat(false);
    nav.navigate('Trophees', { joueurId: selectedJoueur.id });
  };

// Fonction pour rediriger vers la page Selections
  const handleButtonPressSelection = () => {
    setModalVisibleStat(false);
    nav.navigate('Selections', { joueurId: selectedJoueur.id });
  };

// Fonction pour verifier si l'email est valide
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


// Fonction pour gérer le changement d'email
  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

// Fonction pour gérer le changement d'Age
  const handleAgeChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAge(numericValue);
  };

// Fonction pour gérer le changement de telephone
  const handleTelephoneChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setTelephone(numericValue);
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

// Fonction pour récupérer la liste des joueurs depuis le serveur
  const ListJoueurs = async () => {
    try {
      const response = await fetch(
        'http://10.192.37.187:1234/listplayeur',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Utiliser le jeton d'authentification
          },
        }
      );

      const data = await response.json();
      setJoueurs(data.data);  // remplir le tableau avec les informations 
    } catch (error) {}
  };

 // Fonction pour afficher chaque joueur dans une carte
  const renderJoueurs = ({ item }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={styles.card}>
        <Image
          // source={{ uri: `https://localhost:1234${item.image}` }}
          source={require('../assets/player.png')}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>{item.firstname}</Text>
        <Text style={styles.cardTitle}>{item.lastname}</Text>
        <Text style={styles.cardTitle}>{item.age}</Text>
      </View>
    </TouchableOpacity>
  );

// Utiliser  useEffect pour exécuter getToken() et ListJoueurs();
  useEffect(() => {
    ListJoueurs();
    getToken();
  });

 // Fonction pour ajouter un joueur
  const AddJoueur = async () => {
    try {
      const response = await fetch(
        'http://10.192.37.187:1234/addPlayer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`, // Utiliser le jeton d'authentification
          },
          body: JSON.stringify({ nom, prenom, age, telephone, email, adresse }),
        }
      );

      const data = await response.json();

      if (response.status == 400 || response.status == 404) {
        alert(data.erreur); // afficher le message d'erreur 
      } else {
        closeModal(); // fermer la modale après l'ajout
        setAdresse('');setEmail('');setNom('');setPrenom('');setAge('');setTelephone(''); // vider le formulaire 
        ListJoueurs(); // Rafraîchir la liste des sélections après l'ajout
      }
    } catch (error) {}
  };


// Rendre l'interface utilisateur 
  return (
    <ImageBackground
      style={{ flex: 1, height: '100%' }}
      resizeMode="cover"
      // source={require('../assets/login.png')}
    >
      <View style={styles.flat}>
        <FlatList
          data={Joueurs}
          renderItem={renderJoueurs}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>

      <View style={{ justifyContent: 'flex-end', flex: 1 }}>
        <Navbar />
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ajouter un Joueur</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  placeholderTextColor="#aaa"
                  value={nom}
                  onChangeText={setNom}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Prenom"
                  placeholderTextColor="#aaa"
                  value={prenom}
                  onChangeText={setPrenom}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={handleAgeChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telephone"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={telephone}
                  onChangeText={handleTelephoneChange}
                />
                <TextInput
                  style={[styles.input, !isEmailValid && styles.errorInput]}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={handleEmailChange}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Adresse"
                  placeholderTextColor="#aaa"
                  value={adresse}
                  onChangeText={setAdresse}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={AddJoueur}>
                  <Text style={styles.closeButtonText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {selectedJoueur && (
        <Modal
          visible={modalVisibleStat}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisibleStat(false)}>
          <TouchableWithoutFeedback   onPress={() => setModalVisibleStat(false)}>
          <View style={styles.modalContainer1}>
              <TouchableWithoutFeedback>
            <View style={styles.modalContent1}>
              <Text style={styles.modalTitle1}>
                Joueur Selectionner : {selectedJoueur.firstname}
              </Text>
                <TouchableOpacity
                  style={styles.closeButton1}
                  onPress={handleButtonPress}>
                  <Text style={styles.closeButtonText}>Matchs joués</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                  style={styles.closeButton1}
                  onPress={handleButtonPressTrophees}>
                  <Text style={styles.closeButtonText}>TROPHÉES</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                  style={styles.closeButton1}
                  onPress={handleButtonPressSelection}>
                  <Text style={styles.closeButtonText}>Selections</Text>
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

  flat: {
    width: '100%',
  },

  card: {
    width: 170,
    height: 300,
    backgroundColor: '#263B06', // Fond blanc
    borderRadius: 10, // Bords arrondis
    padding: 10, // Espacement intérieur
    margin: 7, // Espacement extérieur
    shadowColor: '#000', // Couleur de l'ombre
    shadowOffset: { width: 0, height: 2 }, // Position de l'ombre
    shadowOpacity: 0.25, // Opacité de l'ombre
    shadowRadius: 3.84, // Rayon de l'ombre
    elevation: 5, // Élévation pour les ombres sur Android
  },
  cardTitle: {
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20, // Espace entre le titre et l'image
  },
  cardImage: {
    marginTop: 15,
    marginBottom:15,
    width: '100%', // Occupe toute la largeur du parent
    height: 120, // Hauteur de l'image
    borderRadius: 10, // Bords arrondis pour l'image
    resizeMode: 'contain', // Ajustement de l'image
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

  closeButton1: {
    backgroundColor: 'black',
    padding: 10,
    margin: 20,
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
