import React from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  increment,
  decrement,
} from "../../modules/transport";

const Home = props => (
  <div>
    <h1>Home</h1>
    <p>Count: {props.count}</p>
    <p>
      <button onClick={props.increment}>
        Increment
      </button>
    </p>
    <p>
      <button onClick={props.decrement}>
        Decrementing
      </button>
    </p>
    <p>
      <button onClick={() => props.changePage()}>
        Go to about page via redux
      </button>
    </p>
  </div>
);

const mapStateToProps = state => ({
  count: state.transport.count,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      decrement,
      changePage: () => push("/about-us")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
