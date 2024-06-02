import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, StyleSheet,Text,View } from 'react-native';
import Login from './Views/Login';
import Profil from './Views/Profil';
import Home from './Views/Home';
import Statistique from './Views/Statistique';
import Trophees from './Views/Trophees';
import Selections from './Views/Selection';


const App = () => {

  const Stack = createStackNavigator();  // Crée une pile de navigation

  return (
   <>
   
   <NavigationContainer>
    <Stack.Navigator  initialRouteName='Acceuil'> 
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login}  />  
      <Stack.Screen options={{headerShown: false}} name="Profil" component={Profil} />
      <Stack.Screen  name="Acceuil" component={Home}  
       options={{
            headerStyle: {  // Personnalise le contenu du titre de l'en-tête avec une image et du texte
              backgroundColor: '#458D25', 
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontWeight: 'bold', 
            },
              headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Image
                  source={require('./assets/joueur.png')}
                  style={styles.logo}
                />
                <Text style={styles.headerTitle}>Listes des Joueurs</Text>
              </View>
            ),
             headerLeft: () => null, // Masque le composant à gauche de l'en-tête
          }}/>
      <Stack.Screen  name="Statistique" component={Statistique}  
       options={{
            headerStyle: { // Personnalise le contenu du titre de l'en-tête avec une image et du texte
              backgroundColor: '#458D25', 
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontWeight: 'bold', 
            },
              headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Image
                  source={require('./assets/joueur.png')}
                  style={styles.logo}
                />
                <Text style={styles.headerTitle2}>Matchs joués</Text>
              </View>
            ),
             headerLeft: () => null, // Masque le composant à gauche de l'en-tête
          }}/>

      <Stack.Screen  name="Trophees" component={Trophees}  
            options={{
                  headerStyle: { // Personnalise le contenu du titre de l'en-tête avec une image et du texte
                    backgroundColor: '#458D25',
                  },
                  headerTintColor: '#fff', 
                  headerTitleStyle: {
                    fontWeight: 'bold', 
                  },
                    headerTitle: () => (
                    <View style={styles.headerTitleContainer}>
                      <Image
                        source={require('./assets/trof.png')}
                        style={styles.logo}
                      />
                      <Text style={styles.headerTitle2}>TROPHÉES</Text>
                    </View>
                  ),
                  headerLeft: () => null, // Masque le composant à gauche de l'en-tête
                }}/>
      <Stack.Screen  name="Selections" component={Selections}  
            options={{
                  headerStyle: { // Personnalise le contenu du titre de l'en-tête avec une image et du texte
                    backgroundColor: '#458D25', 
                  },
                  headerTintColor: '#fff', 
                  headerTitleStyle: {
                    fontWeight: 'bold', 
                  },
                    headerTitle: () => (
                    <View style={styles.headerTitleContainer}>
                      <Image
                        source={require('./assets/sel.png')}
                        style={styles.logo}
                      />
                      <Text style={styles.headerTitle2}>Selections</Text>
                    </View>
                  ),
                  headerLeft: () => null,  // Masque le composant à gauche de l'en-tête
                }}/>
    </Stack.Navigator>
   </NavigationContainer>
   
   </>
  );


}

const styles = StyleSheet.create({
 headerTitleContainer: {
    flexDirection: 'row',
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
    marginRight :52,
   
  },
  headerTitle: {
    color: '#fff', 
    fontSize: 25, 
    marginRight :72,
    
  },

  headerTitle2: {
    marginRight :92,
    color: '#fff', 
    fontSize: 25, 
  },
});

export default App;


