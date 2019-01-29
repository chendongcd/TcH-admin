import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import Bread from '../Layout/Bread'
export default class PageHeader extends PureComponent {

  getTitle=(app)=>{
    if(app.locationPathname==='/'){
      return '首页'
    }
    if(app.locationPathname==='/login'){
      return ''
    }
    if(app.locationPathname==='/404'){
      return '404'
    }
    let current = app.menu.filter(a=>a.route===app.locationPathname)
    return current[0].title?current[0].title:current[0].name
  }

  render() {
    const {
      className,
      loading = false,
      wide = false,
      app
    } = this.props;
    const clsString = classNames(styles.pageHeader, className);
    let title = this.getTitle(app)
    return (
      <div className={clsString}>
        <div className={wide ? styles.wide : ''}>
          <Skeleton
            loading={loading}
            title={false}
            active
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}
          >
            <Bread menu={app.menu} location={app.location}/>
            <div className={styles.detail}>
              <div className={styles.main}>
                <div className={styles.row}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                </div>
              </div>
            </div>
          </Skeleton>
        </div>
      </div>
    );
  }
}
