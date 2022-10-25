import React, { Component } from 'react';

type MyState = {
  count: number;
};
export default class Counter extends Component<any, MyState> {
  override state: MyState = {
    count: 0,
  };

  incrementCounter = () => {
    this.setState({ count: this.state.count + 1 });
  };

  override render() {
    return (
      <div>
        <button onClick={this.incrementCounter}>Increment</button>
        <span>{this.state.count}</span>
      </div>
    );
  }
}
