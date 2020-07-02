import { Block, Text } from "galio-framework";
import React from "react";
import {
  Dimensions, ImageBackground,
  KeyboardAvoidingView, StatusBar, StyleSheet
} from "react-native";
import { Button, Icon, Input } from "../components";
import { argonTheme, Images } from "../constants";
import { login } from '../controllers/api.controller';

const { width, height } = Dimensions.get("screen");

class Onboarding extends React.Component {
  state={
      email:'',
      password:''
    }
  
handleLogin = () =>
  {
    let user={
      email: this.state.email,
      password: this.state.password
    }
    //console.log("apreto login",user)
    this.validarLogin(user);
  }

  validarLogin = async (user) =>
  {
    let rdo = await login(user);
    //console.log("rdo:",rdo)
    if (rdo.rdo===0)
    {
      //alert("se ha validado el usuarios");
      this.props.navigation.navigate("Home")//Rutea a Home
    }
    else{
      alert("ocurrio un error: " + rdo.mensaje)
    }

  }
  render() {

    const {navigation} =this.props;
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AB" size={20}>
                  Acceder
                </Text>
                
              </Block>
              <Block flex>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Email"
                        onChangeText={value => this.setState({ email: value })}
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
                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
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
                    
                    <Block middle>
                      <Button 
                        color="primary" 
                        style={styles.createButton}
                        onPress={this.handleLogin}
                        >
                        
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          INGRESAR
                        </Text>
                      </Button>

                      
                    </Block>
{}

                   <Block middle>
                      <Button 
                        color="primary" 
                        style={styles.createButton}
                        onPress={() => navigation.navigate("App")}
                        >
                        
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          CREAR CUENTA
                        </Text>
                      </Button>

                    </Block>
{/* 
                    <Block>
                    <Button
                  style={styles.button}
                  color={argonTheme.COLORS.SECONDARY}
                  onPress={() => navigation.navigate("App")}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
                  Get Started
                </Button>

                </Block> */}
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
    width: width * 0.9,
    height: height * 0.78,
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
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
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
    marginTop: 25
  }
});

export default Onboarding;
