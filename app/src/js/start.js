import React, {Component} from 'react'

import styles from '../css/greeter.css'

const class1 = 'class1'

class Greeter extends Component{
  render() {
    let date = new Date()
    return (
      <div className={styles.class1}>
        {date.toString()}
      </div>
    )
  }
}

export default Greeter
