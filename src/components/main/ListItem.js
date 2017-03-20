import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  // ***** CARDSECTION *****
  // children: [jsx] anything between <CardSection></CardSection> component
  // customStyle: [string] custom style to overwrite default component style
  CardSection,

  // ***** TEXTBUTTON *****
  // children: [jsx] anything between <TextButton></TextButton> component
  // onPress: [function] on button press event handler
  TextButton,
} from '../common';
import { setUserCategory } from '../../actions';

class ListItem extends Component {
  onTextButtonPress(category) {
    const userCategories = this.props.userCategories ? this.props.userCategories : [];

    let pushCategory = true;
    if (userCategories.length > 0) {
      userCategories.forEach((userCategory, i) => {
        if (category === userCategory.category) {
          userCategories.splice(i, 1);
          pushCategory = false;
          return;
        }
      });
    }

    if (pushCategory) {
      userCategories.push({ category });
    }

    //this.props.setUserCategory(userCategories, pushCategory);
    this.props.setUserCategory(userCategories, !this.props.checkCategory);
  }

  toggleSelectedCategories(userCategories, category) {
    let hasCategory = false;
    const { textStyle, hasCategoryStyle } = styles;
    if (userCategories) {
      userCategories.forEach((userCategory) => {
        if (category === userCategory.category) {
          hasCategory = true;
          return;
        }
      });
    }
    if (hasCategory) {
      return [textStyle, hasCategoryStyle];
    }

    return textStyle;
  }

  render() {
    const { category } = this.props.category;
    const userCategories = this.props.userCategories;

    return (
      <View>
        <CardSection>
          <TextButton
            onPress={this.onTextButtonPress.bind(this, category)}
            style={this.toggleSelectedCategories(userCategories, category)}
          >
            {category}
          </TextButton>
        </CardSection>

      </View>
    );
  }
}

const styles = {
  textStyle: {
    fontSize: 18,
    paddingLeft: 15,
    color: 'gray',
  },
  hasCategoryStyle: {
    color: 'green',
  },
};

const mapStateToProps = (state) => {
  const { userCategories, checkCategory } = state.auth;

  return { userCategories, checkCategory };
};

export default connect(mapStateToProps, { setUserCategory })(ListItem);
