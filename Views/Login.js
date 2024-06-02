import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground,TouchableOpacity, Image } from 'react-native';
import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {

    // Variables d'état pour stocker les saisies utilisateur, les données et le jeton
    const [email, setEmail] = useState(''); // Saisie de l'email
    const [password, setPassword] = useState(''); // Saisie du mot de passe
    const [data, setData] = useState(''); // Données de réponse du serveur
    const [token, setToken] = useState(''); // Jeton d'utilisateur
    const nav = useNavigation(); 

    // Fonction pour récupérer le jeton de AsyncStorage 
    const getToken = async () => {
        const a = await AsyncStorage.getItem('token');
        if (a !== null) {
            setToken(a);
            nav.navigate('Acceuil'); // Naviguer vers l'écran d'accueil si le jeton existe
        }
    }

    // Fonction pour stocker le jeton dans AsyncStorage
    const storeToken = async (value) => {
        await AsyncStorage.setItem('token', value);
        setToken(value);
    }

    //  useEffect pour exécuter la fonction getToken 
    useEffect(() => {
        getToken();
    });

    // Fonction pour gérer la connexion
    const login = async () => {
        try {
            const response = await fetch('http://10.192.37.187:1234/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // Envoyer l'email et le mot de passe au serveur
            });

            // Vérifier le statut de la réponse
            if (response.status === 400 || response.status === 404) {
                const errorData = await response.json();
                alert(errorData.erreur || 'Mauvais mot de passe ou mauvais mail'); // Afficher le message d'erreur
            } else {
                const responseData = await response.json();
                storeToken(responseData.token); // Stocker le jeton
            }
        } catch (error) {
            alert(error.message || 'Une erreur s\'est produite'); // Afficher le message d'erreur
        }
    };

    // Rendre l'interface utilisateur de connexion
    return (
        <ImageBackground resizeMode='contain'  style={styles.phoneImage}>
            <View style={styles.foot}>
                <ImageBackground resizeMode='contain' source={require('../assets/foor.png')} style={styles.logo}>
                    <View style={styles.foot}>
                       <Image  source={require('../assets/trainer.png')}  />
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.phone}>
                <Text style={styles.loginTitle}>BIENVENUE</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    autoCapitalize='none'
                    onChangeText={setEmail} // Mettre à jour l'état de l'email lors du changement de texte
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    placeholderTextColor="#aaa"
                    onChangeText={setPassword} // Mettre à jour l'état du mot de passe lors du changement de texte
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.closeButton1}
                        onPress={login}>
                        <Text style={styles.closeButtonText}>SE CONNECTER</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
  closeButton1: {
    backgroundColor: 'black',
    padding: 10,
    margin: 20,
    alignContent :'center',
    alignItems : 'center',
  },
  closeButtonText: {
    paddingLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  
  },
  foot: {
    paddingRight :10,
     paddingBottom :10,
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneImage: {
    paddingRight :80,
     height: '100%',
      flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    marginTop:80,
    width: '80%',
    padding: 20,
    marginLeft:100,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
      marginLeft:120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
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
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
});

export default Login;
