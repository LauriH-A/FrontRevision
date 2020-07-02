import { Block, Checkbox, Text } from "galio-framework";
import React from "react";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Button, Icon, Input } from "../components";
import { argonTheme, Images } from "../constants";
import { register, getGenres } from "../controllers/api.controller";

const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    genres: [],
  };

    setGeneros = async () => {//setear generos del state
      try {
        const resp = await getGenres();
        this.setState( {genres : resp.genres});
      } catch (error) {
        console.log(error);
      }
    }

    componentDidMount(){
      this.setGeneros();
    }

   handleRegister = async () => {
    console.log("user", this.state.name);
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      //opcional, Generos seleccionados
    };
    try {
      await register(user);//Llamo al servicio
      this.props.navigation.navigate("Home");
      alert("Te Logueaste/Registraste con exito");
    } catch (error) {
      console.log("error", error);
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
              <Block flex={0.1} middle style={styles.socialConnect}>
                <Text bold size={16} color={argonTheme.COLORS.WHITE}>
                  Crear Cuenta
                </Text>
              </Block>
              <Block flex>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                      <Input
                        borderless
                        placeholder="Ingresa tu nombre"
                        onChangeText={(value) => this.setState({ name: value })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="bell"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>

                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                      <Input
                        borderless
                        placeholder="Ingresa tu Email"
                        onChangeText={(value) =>
                          this.setState({ email: value })
                        }
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
                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                      <Input
                        password
                        borderless
                        placeholder="Nueva Password"
                        secureTextEntry={true}
                        underlineColorAndroid={"transparent"}
                        onChangeText={(value) =>
                          this.setState({ password: value })
                        }
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

                    <Block
                      flex
                      style={[
                        { flexDirection: "column", alignContent: "stretch" },
                      ]}
                    >
                      <Text style={styles.registerContainer.header}>
                        ¿Que categorías te interesan?:
                      </Text>
                      {
                        this.state.genres.map((g)=>( //Funcion map Por cada genero crea un checkbox
                          <Checkbox color="primary" label={g.name} />
                        ))
                      }
                    </Block>

                    <Block middle>
                      <Button
                        color="PRIMARY"
                        style={styles.createButton}
                        onPress={this.handleRegister}
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
                        onPress={() => navigation.navigate("Profile")}
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
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.PRIMARY,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
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
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.5,
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    backgroundColor: "#fff",
  },
});

export default Register;
