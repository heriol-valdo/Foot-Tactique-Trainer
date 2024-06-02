import {StyleSheet,Text, TouchableOpacity, View} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';



export default function Navbar() {
    const nav = useNavigation();

    const eraseToken = async () => {
        await AsyncStorage.removeItem('token');
      };

      const getToken = async() =>{
        const a = await AsyncStorage.getItem('token');
        if(a == null){
            nav.navigate('Login')
        }
      
    }

    const [activeIcon, setActiveIcon] = useState("list");
    const handleIconClick = (iconName) => {
      setActiveIcon((prevIcon) => (prevIcon === iconName ? iconName : iconName));
    };

      useEffect(() => {
      getToken();
      }); 
  return (
     <>
    
         <View style={styles.nav}>
        <TouchableOpacity style={styles.touchable}  onPress={() =>{ handleIconClick("user");nav.navigate('Profil');}}>
            <FontAwesome5 name="user" size={24}  color={activeIcon === "user" ? "green" : "white"}/>
            <Text style={{ color: activeIcon === "user" ? "green" : "white" }}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable}   onPress={() =>{ handleIconClick("list"); nav.navigate('Acceuil'); }}>
            <FontAwesome5 name="list" size={24} color={activeIcon === "list" ? "green" : "white"}/>
            <Text style={{ color: activeIcon === "list" ? "green" : "white" }}>Listes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={() =>{ handleIconClick("power-off");  eraseToken();}}>
            <FontAwesome5 name="power-off" size={24} color={ "white"}/>
            <Text style={{ color:  "white" }}>Logout</Text>
        </TouchableOpacity>
        </View>
    
     </>
  );
}

const styles = StyleSheet.create({
    nav: {
      width:'100%',
      backgroundColor:'black',
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'flex-end',
      height:80,
      paddingBottom:25
    },
    touchable:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        color : 'green'
    }
  });