import React, { Component } from 'react';
import { AppRegistry, Button, Text, View } from 'react-native';

  function DisplayResult(props) {
    return <Text>{props.showThis}</Text>
  }

export default class FlexDimensionsBasics extends Component {
  constructor(props) {
    super(props);
    this.getSounds = this.getSounds.bind(this);
    this.state = { audio: null, message: "Welcome", status: "init", count: 0 };
  }
  render() {
    return (
      // Try removing the `flex: 1` on the parent View.
      // The parent will not have dimensions, so the children can't expand.
      // What if you add `height: 300` instead of `flex: 1`?
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "powderblue" }}>
          <Text>{this.state.message}</Text>
        </View>
        <View style={{ flex: 2, backgroundColor: "skyblue" }}>
          <DisplayResult showThis={this.state.count}/>
        </View>
        <View style={{ flex: 3, backgroundColor: "steelblue" }}>
          <Button
            onPress={this.getSounds}
            title="GetSounds"
            color="#841584"
            accessibilityLabel="Get Sounds"
          />
        </View>
      </View>
    );
  }
  getSounds(){
    const count = 1 + this.state.count;
    this.setState({count});
  }
}









