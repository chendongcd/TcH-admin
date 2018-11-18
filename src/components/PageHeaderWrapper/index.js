import React from 'react';
import PageHeader from '../PageHeader';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '../Layout/MenuContext';
import {connect} from 'dva';

const PageHeaderWrapper = ({ children, contentWidth='Fluid', wrapperClassName, top, ...restProps }) => (

  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PageHeader
          wide={contentWidth === 'Fixed'}
          home={"首页"}
          {...value}
          key="pageheader"
          {...restProps}
          itemRender={item => {
            return item.name;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);
export default connect(({app}) => ({app}))(PageHeaderWrapper);

