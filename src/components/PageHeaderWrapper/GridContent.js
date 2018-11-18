import React, { PureComponent } from 'react';
import styles from './GridContent.less';

export default class GridContent extends PureComponent {
  render() {
    const { children } = this.props;
    const  contentWidth= 'Fluid';
    let className = `${styles.main}`;
    if (contentWidth === 'Fixed') {
      className = `${styles.main} ${styles.wide}`;
    }
    return <div className={className}>{children}</div>;
  }
}
