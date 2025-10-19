import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  StatusBar,
  TextInput,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

const { height: s_height, width: s_width } = Dimensions.get("window");//store window height and width in s_heigthand weight

export default function Home() {
  const [isMenu, setIsMenu] = useState(false);
  const[isArrow,setIsArrow]=useState(false)
  const [light,setLight]=useState(true)//true=light
  //arrow animation
  const arrowHeight = useRef(new Animated.Value(70)).current; // initial height
  const [theme,settheme]=useState({
    bgColor:"white",
    TtColor:"#757778ff",
    menu:"white",
    menuIcon:require("./images/menu-light.png"),
    arrowIcon:require("./images/icons8-double-up-96.png"),
  })
  useEffect(()=>{
    settheme((e)=>({
      bgColor:light?"white":"#22272bff",
      TtColor:light?"#757778ff":"#e2e5e6ff",
      menu:light?"white":"#22272bff",
      menuIcon:light?require("./images/menu-light.png"):require("./images/menu-dark.png"),
      arrowIcon:light?require("./images/icons8-double-arrow-100.png"):require("./images/icons8-double-arrow-100.png"),

    }))
  },[light])

const toggleArrow = () => {
  if (!isArrow) {
    Animated.timing(arrowHeight, {
      toValue: 700, // final height
      duration: 500,
      useNativeDriver: false, // **must be false** for height
    }).start(() => setIsArrow(true));
  } else {
    Animated.timing(arrowHeight, {
      toValue: 70, // back to initial
      duration: 500,
      useNativeDriver: false,
    }).start(() => setIsArrow(false));
  }
};

  // Animation values
  const slideAnim = useRef(new Animated.Value(-s_width*0.7)).current;
  const backdropOpacity = slideAnim.interpolate({
    inputRange: [-s_width*0.7, 0],//slideAnim values as input
    outputRange: [0, 0.7],//opacity values as output 
  });//interpolate maps one value to other , ilke when value -s_width*0.7 then opacity will be 0 and 0->0.7
  

  const toggleMenu = () => {
    if (!isMenu) {
      setIsMenu(true);
      Animated.timing(slideAnim, {
        // it is function in React Native that animates a value over time
        toValue:0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue:-s_width*0.7,
        duration: 500,
        useNativeDriver: true,
      }).start(() =>setIsMenu(false));//after start run completed  then it set value false it like callback
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.bgColor}]}>
      {/* Header */}
      <View style={{paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,}}>
        <View style={[styles.header, { paddingLeft: 15}]}>
        <TouchableOpacity onPress={toggleMenu}>
         
          {light?(<Image
            source={require("./images/menu-light.png")}
            style={{ height: 20, width: 22, alignSelf: "flex-end" }}
          />):(<Image
            source={require("./images/menu-dark.png")}
            style={{ height: 20, width: 25, alignSelf: "flex-end" }}
          />)}
        </TouchableOpacity>
        <Text
          style={{
            paddingLeft: 20,
            color:theme.TtColor,
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Bus
          <Text style={{ color: "#30bcf8ff", fontWeight: "bold", fontSize: 20 }}>
            Tracker
          </Text>
        </Text>
        <TouchableOpacity style={styles.rightAlign} onPress={()=>setLight(!light)}>
          {light?(<Image
            source={require("./images/icons8-sun-50.png")}
            style={{ height: 26, width: 25, alignSelf: "flex-end" }}
          />):(<Image
            source={require("./images/icons8-do-not-disturb-ios-100.png")}
            style={{ height: 20, width: 20, alignSelf: "flex-end" }}
          />)}
        </TouchableOpacity>
      </View>
            </View>
      {/* Backdrop + Animated Menu */}
      {isMenu && (
        <>
        {/* to see animation we must use animated.view */}
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity,backgroundColor:theme.bgColor }]}
          >
            <TouchableOpacity
              style={{ height: "100%", width: "100%" }}
              onPress={toggleMenu}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.menu,
              {
                transform: [{ translateX: slideAnim }],//transform is a style property in React Native that lets you move, rotate, scale, or skew a component.
                //transulateX Moves the component horizontally
                backgroundColor:theme.bgColor
              },
            ]}
          > 
          {/*name */}
            <TouchableOpacity style={{marginBottom:20,padding:15,borderColor:"rgba(223, 218, 218, 1)", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight :10,backgroundColor:"#30bcf8ff"}}>
              <View style={{flexDirection:"row",paddingTop:25}}>
                <TouchableOpacity style={{height:50,width:50 }} > <Image
                source={{ uri: "https://www.intsocialcapital.org/wp-content/uploads/2022/01/blank-profile-picture-973460_1280.png" }}
                style={{ height: 55, width: 55,borderRadius:50,borderWidth:2,borderColor:"rgba(223, 218, 218, 1)" }}
              /></TouchableOpacity>
              <View style={{paddingRight:20,paddingLeft:20}}>
                <Text style={[styles.name,{color:theme.menu}]} numberOfLines={1} ellipsizeMode="tail">Mouna K</Text>
                <Text style={{color:theme.menu ,fontSize:13}}>23ata31112</Text>
              </View>

              </View>
              
            </TouchableOpacity>
          
           
          </Animated.View>
        </>
      )}

      {/* main body */}
      <View style={{ position: "relative", zIndex: 1, height: "85%", width: "100%",backgroundColor:theme.bgColor }}>
        <Image
          source={{
            uri: "https://preview.redd.it/zj23e4w876p81.png?width=1080&crop=smart&auto=webp&s=b8be04cdcdee17d074c441bb7d663d5023dc82b9",
          }}
          style={{ height: "100%", width: "100%" }}
        />
      </View>

      {/* search bar */}
      <View style={{ position: "absolute", top:"14%", zIndex: 1, left: "12%"}}>
        <TextInput
          style={[styles.searchbar, { flex: 1, paddingLeft: 50 ,height:45 ,fontSize:14,backgroundColor:theme.bgColor,color:theme.TtColor}]}
          placeholder="Search" placeholderTextColor={theme.TtColor}
        />
        <TouchableOpacity style={{ position: "absolute", left: 15, paddingTop: 12 }}>
          <Image
            source={require("./images/icons8-search-96.png")}
            style={{ height: 20, width: 25 }}
          />
        </TouchableOpacity>
      </View>

      {/* bottom bar */}
    <Animated.View style={[styles.bottombar, { height: arrowHeight,backgroundColor:theme.bgColor }]}>

        <TouchableOpacity onPress={toggleArrow}>
         {isArrow? (<Image
            source={require("./images/icons8-double-down-100.png")}
            style={{ height: 29, width: 27, alignSelf: "center" }}
          />
         ):(<Image
            source={theme.arrowIcon}
            style={{ height: 29, width: 27, alignSelf: "center" }}
          />)}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  header: {
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#63c4f5ff",
    shadowOpacity: 0.2,
   // bacgourd color
    padding: 10,
  },
  rightAlign: {
    flex: 1,
    width: 30,
    justifyContent: "center",
  },
  searchbar: {
    elevation: 10, // shadow
    borderWidth: 2,
    borderColor: "#e4eaebff",
    width: 300,
   
    //backgroundColor: "white",
    borderRadius: 40,
  },
  bottombar: {
    
    position:"absolute",
    width:s_width,
   
    borderWidth: 2,
    bottom:0,
    elevation:10,
    shadowColor:"black",
    borderColor: "#c2c4c4ff",
    //backgroundColor: "white",
    paddingTop: 10,
    zIndex:990
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    height: s_height,
    width: s_width,
    backgroundColor: "black",
    zIndex: 998,
  },
  menu: {
    position: "absolute",
    height: "100%",
    width: s_width * 0.7,
    //backgroundColor: "white",
    elevation: 50,
    shadowColor: "black",
    shadowOpacity: 1,
    zIndex: 999,
     
    
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 15,
  },
  name:{
    color:"#eaf1f1ff",
    width:170,
    fontWeight: "bold", 
    fontSize: 22 , 
   
  }
});
