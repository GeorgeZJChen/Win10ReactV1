import React, {Component} from 'react'

import styles from '../css/greeter.css';

const class1 = 'class1'

class Greeter extends Component{
  render() {
    return (
      <div className={styles.class1}>
        Hello World!
      </div>
    );
  }
}

export default Greeter
