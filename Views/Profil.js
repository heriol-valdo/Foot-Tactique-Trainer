import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Image } from 'react-native';
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../composant/Navbar';

const Profil = () => {

  // Variables d'état pour stocker les données du profil utilisateur
  const [nom, setNom] = useState('Nom');
  const [prenom, setPrenom] = useState('Prenom');
  const [email, setEmail] = useState('Email');
  const [token, setToken] = useState(); // Jeton d'utilisateur
  const nav = useNavigation(); 

  // Fonction pour récupérer les détails du profil depuis le serveur
  const listProfil = async () => {
      try {
        const response = await fetch('http://10.192.37.187:1234/profil', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Utiliser le jeton d'authentification
          },
        });

        const data = await response.json();
         if (data.data.length > 0) {
            const profil = data.data[0];
            setNom(profil.firstname); // Mettre à jour le nom
            setPrenom(profil.lastname); // Mettre à jour le prénom
            setEmail(profil.email); // Mettre à jour l'email
          }
          
      } catch (error) {}
    };
 
    // Fonction pour récupérer le jeton de AsyncStorage lorsque le composant est monté
    const getToken = async() =>{
      const a = await AsyncStorage.getItem('token');
      if(a !== null){
          setToken(a); // Stocker le jeton
      } else {
        nav.navigate('Login'); // Rediriger vers l'écran de connexion si aucun jeton n'est trouvé
      }
    }

    // Utiliser  useEffect pour exécuter les fonctions getToken() et listProfil() 
    useEffect(() => {
       getToken();
       listProfil();
    });

  // Rendre l'interface utilisateur du profil
  return (
      <ImageBackground resizeMode='cover' style={styles.phoneImage}>
        <View style={styles.foot}>
         <ImageBackground resizeMode='contain' source={require('../assets/foor.png')} style={styles.logo}>
          <View style={styles.foottitle} > 
             <Image  source={require('../assets/trainer.png')}  />
          </View>
         </ImageBackground>
        </View>

         <View style={styles.cram}>
         <Image resizeMode='cover' style={{height:200, width:200}} source={require('../assets/rom.png')} />
        </View>

        <View style={styles.phone}>
          <Text style={styles.loginTitle}>Mon Profil</Text>
          <Text style={styles.loginTitle}>{nom}</Text>
           <Text style={styles.loginTitle}>{prenom}</Text>
           <Text style={styles.loginTitle}>{email}</Text>
        </View>

      <View style={{justifyContent:'flex-end', flex:1}}>
      <Navbar/> 
      </View>
  
      </ImageBackground>
  );
};



const styles = StyleSheet.create({
  foot: {
    marginTop:150,
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foottitle: {
     paddingRight :10,
     paddingBottom :10,
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
   cram: {
    marginTop:40,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneImage: {

      flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    marginTop:40,
    width: '80%',
    padding: 20,
  
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
     marginLeft: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },

  
});

export default Profil;
