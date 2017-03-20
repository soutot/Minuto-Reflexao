import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';
import {
  // ***** CARD *****
  //children: [jsx] anything between <Card></Card> component
  Card,

  // ***** CARDSECTION *****
  //children: [jsx] anything between <CardSection></CardSection> component
  //customStyle: [string] custom style to overwrite default component style
  CardSection,

  // ***** TEXTBUTTON *****
  //children: [jsx] anything between <ErrorMessage></ErrorMessage> component
  //onPress: [function] on button press event handler
  TextButton,

  // ***** BUTTON ****
  //children: [jsx] anything between <Button></Button> component
  //onPress: [function] on button press event handler
  Button,
  Spinner
} from '../common';
import { getMessage, toggleLoading } from '../../actions';

const { width, height } = Dimensions.get('window');

class SingleMessage extends Component {

  componentWillMount() {
    if (this.props.messageText === '') {
      this.props.toggleLoading(true);
      this.props.getMessage();
    }
  }

  onShareButtonPress() {
    const message = this.props.messageText + ' | Baixe grátis o App Minuto de Reflexão';
    const url = 'https://facebook.github.io/react-native/docs/share.html';

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: url,
      contentDescription: message,
    };

    // ShareDialog.canShow(shareLinkContent).then(
    //   (canShow) => {
    //     if (canShow) {
    //       return ShareDialog.show(shareLinkContent);
    //     }
    //   }
    // );

     Share.share({
      message,
      //url,
    });
    //.catch((error) => this.setState({ result: 'error: ' + error.message }));
  }

  _onLayoutDidChange = (e) => {
    const layout = e.nativeEvent.layout;
    this.setState({ size: { width: layout.width, height: layout.height } });
  }

  renderNotFoundMessage() {
    if (this.props.displayLoading) {
      return <Spinner />;
    }
    return (
      <Text style={{ textAlign: 'center', fontSize: 18, color: '#ddd' }}>
        Nenhuma mensagem disponível.
        {'\n'}
        Você pode alterar as configurações de categorias exibidas em seu Perfil.
      </Text>
    );
  }

  render() {
    const styles = {
      containerStyle: {
        backgroundColor: '#ddd',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      },
      textStyle: {
        textAlign: 'center',
        fontSize: 18,
        color: '#ddd',
      },
      shareButtonStyle: {
        textAlign: 'center',
        fontSize: 18,
      },
      boxHeaderStyle: {
        justifyContent: 'center',
      },
      messageStyle: {
        justifyContent: 'center',
        backgroundColor: 'transparent',
      },
      buttonsContainerStyle: {
        paddingBottom: 100,
        justifyContent: 'center',
      },
    };

    const {
      containerStyle,
      textStyle,
      shareButtonStyle,
      boxHeaderStyle,
      messageStyle,
      buttonsContainerStyle,
    }
      = styles;

    this.state = { 
      size: { width, height },
    };

    if (this.props.messageText !== '') {
      return (
        <Image style={[this.state.size]} source={require('../../images/woman-sit-water-body.png')}>
          <View onLayout={this._onLayoutDidChange} style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ flex: 0, borderBottomWidth: 1, borderColor: '#ddd', marginBottom: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 18, color: '#007acc', backgroundColor: '#FFF', padding: 5 }}>
                 Categoria: {this.props.category}
              </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingBottom: 200, paddingRight: 5, paddingLeft: 5 }}>
              <Text style={{ textAlign: 'center', fontSize: 18, color: '#ddd' }}>
                "{this.props.messageText}"
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 14, color: '#ddd' }}>
                --
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 14, color: '#ddd' }}>
                {this.props.author}
              </Text>
            </ScrollView>

            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <TextButton 
                style={{ textAlign: 'center', fontSize: 18, position: 'relative', paddingTop: 10 }}
                onPress={this.onShareButtonPress.bind(this)}
              >
                Compartilhar
              </TextButton>
              
            </View>
          </View>
        </Image>
      );
    }
    return (
      <Image 
        style={[this.state.size]} 
        source={require('../../images/woman-walking-sunset-beach.png')}
      >
        <View onLayout={this._onLayoutDidChange} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <CardSection style={{ justifyContent: 'center' }}>
            {this.renderNotFoundMessage()}
          </CardSection>
        </View>
      </Image>
    );
  }
}

const mapStateToProps = ({ auth, message, common }) => {
  const { user } = auth;
  const { messageText, likes, author, category } = message;
  const { displayLoading } = common;

  return { user, messageText, likes, author, category, displayLoading };
};

export default connect(mapStateToProps, { getMessage, toggleLoading })(SingleMessage);
