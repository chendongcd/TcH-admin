import React from 'react';
import GridContent from './GridContent';
import styles from './index.less';
import {connect} from 'dva';

const PageHeaderWrapper = ({ children, contentWidth='Fluid', wrapperClassName, top, ...restProps }) => (

  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);
export default connect(({app}) => ({app}))(PageHeaderWrapper);

