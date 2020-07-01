import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { login } from '../controllers/api.controller';

const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  state = {
    nombre:'',
    mail: '',
    password: '',
    genres:[]
  }


  handleLogin() {
    let user = {
      nombre:this.state.nombre,
      email: this.state.mail,
      password: this.state.password
    }
    console.log("Hace login/Registra", user)
    this.validarLogin(user);

  }


  async validarLogin(user) {
    console.log("validar login", user)
    let rdo = await login(user);


    console.log("rdo:", rdo)
    if (rdo.rdo === 0) {
      alert("Te Logueaste/Registraste con exito");
    }
    else {
      alert("ocurrio un error: " + rdo.mensaje)
    }

  }
  ///////Categorías de peliculas elegidas
//   checkItem = (item) => {
//     const { checked } = this.state;
//     console.log(item)
//     if (!checked.includes(item)) {
//       this.setState({ checked: [...checked, item] });
      
//     } else {
//       this.setState({ checked: checked.filter(a => a !== item) });
//     }
//     console.log(checked)
// };



  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.10} middle style={styles.socialConnect}>
                <Text bold size={16} color={argonTheme.COLORS.WHITE}>Crear Cuenta</Text>
              </Block>
              <Block flex>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 5}}>
                      <Input
                        borderless
                        placeholder="Ingresa tu nombre"
                        onChangeText={value => this.setState({ mail: value })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_user_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>


                    <Block width={width * 0.8} style={{ marginBottom: 5}}>
                      <Input
                        borderless
                        placeholder="Ingresa tu Email"
                        onChangeText={value => this.setState({ mail: value })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 5}}>
                      <Input
                        password
                        borderless
                        placeholder="Nueva Password"
                        secureTextEntry={true}
                        underlineColorAndroid={'transparent'}
                        onChangeText={value => this.setState({ password: value })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>

                    <Block flex style={[{flexDirection: 'column', alignContent: 'stretch'}]}>
                    <Text style={styles.registerContainer.header}>¿Que categorías te interesan?:</Text>
                    
                    {/* <Checkbox color="primary" onChange={() => checkItem(item)} label="Acción"/> */}
                    <Checkbox color="primary" label="Aventura"/>
                    <Checkbox color="primary" label="Animación"/>
                    <Checkbox color="primary"  label="Comedia"/>
                    <Checkbox color="primary"  label="Crimen"/>
                    <Checkbox color="primary"  label="Documental"/>
                    <Checkbox color="primary"  label="Drama"/>
                    <Checkbox color="primary"  label="Familia"/>
                    <Checkbox color="primary"  label="Fantasía"/>
                    <Checkbox color="primary" label="Historia"/>
                    <Checkbox color="primary"  label="Terror"/>
                    <Checkbox color="primary"  label="Música"/>
                    <Checkbox color="primary"  label="Misterio"/>
                    <Checkbox color="primary"  label="Romance"/>
                    <Checkbox color="primary"  label="Ciencia ficción"/>
                    </Block>

                    <Block middle>
                      <Button
                        color="PRIMARY"
                        style={styles.createButton}
                        onPress={this.handleLogin.bind(this)}
                      >
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          Registrar
                        </Text>
                      </Button>
                    </Block>

                    <Block middle>
                      <Button 
                        color="primary" 
                        style={styles.createButton}
                        onPress={()=> navigation.navigate("Profile")}
                        >
                        
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          VOLVER
                        </Text>
                      </Button>

                      
                    </Block>
{}
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.95,
    height: height * 0.98,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.PRIMARY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  // socialButtons: {
  //   width: 110,
  //   height: 40,
  //   backgroundColor: "#fff",
  //   shadowColor: argonTheme.COLORS.BLACK,
  //   shadowOffset: {
  //     width: 0,
  //     height: 4
  //   },
  //   shadowRadius: 8,
  //   shadowOpacity: 0.1,
  //   elevation: 1
  // },
  // socialTextButtons: {
  //   color: argonTheme.COLORS.PRIMARY,
  //   fontWeight: "800",
  //   fontSize: 14
  // },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginBottom: 12
  },
  header:{
        fontSize:24,
        color:'#fff',
        backgroundColor: "#fff",
    }
  
});

export default Register;
