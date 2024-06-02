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
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation,useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import Navbar from '../composant/Navbar';


export default function Selection() {
  // Variables d'état pour stocker les données  des sélections et jeton
  const nav = useNavigation();
  const [token, setToken] = useState('');
  const[id, setId] = useState('');
  const route = useRoute();
  const [date, setDate] = useState('');
  const [nom, setNom] = useState('');
  const [sels, setSels] = useState([]);
  const [selectedSel, setSelectedSel] = useState(null);
  
  
  // Variables d'état pour les modales
  const [modalVisibleSel, setModalVisibleSel] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
 

// Fonction pour ouvrir la modale d'ajout de sélection
   const openModal = () => {
    setModalVisible(true);
  };

// Fonction pour fermer la modale d'ajout de sélection
  const closeModal = () => {
    setModalVisible(false);
  };

 // Fonction pour ouvrir la modale de supression de sélection
  const handleCardPress = (Sel) => {
    setSelectedSel(Sel);
    setModalVisibleSel(true);
  };

// Fonction pour gérer le changement de date
  const handleDateChange = (text) => {
     setDate(text);
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Format de date : DD/MM/AAAA
    if (dateRegex.test(text)) {
     
    }
  };


// Fonction pour récupérer le jeton d'utilisateur depuis AsyncStorage
  const getToken = async() =>{
    const a = await AsyncStorage.getItem('token');
    if(a !== null){
        setToken(a);
    }
    else{
      nav.navigate('Login');
    }
}

// Utiliser  useEffect pour exécuter getToken() et setSels() 
  useEffect(() => {
     setSels([]); // Réinitialiser la liste des sélections
    const joueurId = route.params?.joueurId;
    if (joueurId) {
      setId(joueurId);
    }
    getToken();
  }, [route.params]);

// Utiliser  useEffect pour exécuter ListSels() lorsque l'identifiant du joueur change
  useEffect(() => {
    if (id) {
      
      ListSels();
    }
  }, [id]);
  
  // Fonction pour récupérer la liste des sélections depuis le serveur
  const ListSels= async () => {
    try {
      const response = await fetch('http://10.192.37.187:1234/listSel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,   // Utiliser le jeton d'authentification
        },
         body:JSON.stringify({id}),
      });

      const data = await response.json();
      if(response.status == 400 || response.status == 404){
          alert(data.erreur);  // afficher le message d'erreur
      }else{
        setSels(data.data);  // remplir le tableau avec les informations 
      }
    
    } catch (error) {
    
    }
  };

  // Fonction pour ajouter une sélection
  const AddSel = async () => {
    try {
      const response = await fetch('http://10.192.37.187:1234/addSel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,// Utiliser le jeton d'authentification
        },
        body:JSON.stringify({id,date,nom}),
      });

    
     const data = await response.json();
      if(response.status == 400 || response.status == 404){
          alert(data.erreur);  // afficher le message d'erreur
      }else{
       setDate(''); setNom(''); // vider le formulaire
       closeModal(); // fermer la modale après l'ajout
       ListSels();// Rafraîchir la liste des sélections après l'ajout
      }
    } catch (error) {
    
    }
  };


// Fonction pour supprimer une sélection
  const handleButtonPress = async () => {
    // renseigner la date selectionner
     const date = selectedSel.date;
   
    try {
      const response = await fetch('http://10.192.37.187:1234/deleteSel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Utiliser le jeton d'authentification
        },
        body:JSON.stringify({id,date}),
      });

    
     const data = await response.json();
      if(response.status == 400 || response.status == 404){
          alert(data.erreur);
      }else{
       setModalVisibleSel(false);  // fermer la modale de supression
       setSels([]); // Réinitialiser la liste des sélections
       ListSels(); // Rafraîchir la liste des sélections après  la suppression
      }
    } catch (error) {
    
    }
  };
 

 
// Rendre l'interface utilisateur 
  return (
    <ImageBackground
      style={{ flex: 1,height:'100%' }}
      resizeMode='cover'
    >
     
      <ScrollView style={styles.scrollView}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Nom</Text>
          </View>
          {sels.map((sel, index) => (
            <TouchableOpacity onPress={() => handleCardPress(sel)}>
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{sel.date}</Text>
              <Text style={styles.tableCell}>{sel.nom}</Text>
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

       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
           <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une Selection</Text>
             <TextInput style={styles.input} placeholder="Date" placeholderTextColor="#aaa" value={date} onChangeText={handleDateChange} keyboardType="date" />
             <TextInput style={styles.input} placeholder="Nom" placeholderTextColor="#aaa" value={nom} onChangeText={setNom}/>
             <TouchableOpacity style={styles.closeButton} onPress={AddSel}>
              <Text style={styles.closeButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
           </TouchableWithoutFeedback>
        </View>
       </TouchableWithoutFeedback>
      </Modal>


      {selectedSel && (
        <Modal
          visible={modalVisibleSel}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisibleSel(false)}>
          <TouchableWithoutFeedback   onPress={() => setModalVisibleSel(false)}>
          <View style={styles.modalContainer1}>
              <TouchableWithoutFeedback>
            <View style={styles.modalContent1}>
              <Text style={styles.modalTitle1}>
                Date Selection Selectionner  : {selectedSel.date}
              </Text>
                <TouchableOpacity
                  style={styles.closeButton2}
                  onPress={handleButtonPress}>
                  <Text style={styles.closeButtonText}>Supprimer</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                  style={styles.closeButton1}
                 onPress={() => setModalVisibleSel(false)}>
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
