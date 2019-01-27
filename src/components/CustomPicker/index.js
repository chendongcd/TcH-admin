import React from 'react'
import moment from 'moment';

import {
  DatePicker,
} from 'antd';
const modeValue={
  date: 0,
  month: 1,
  year: 2,
  decade: 3
};

export default class MyDatePicker extends React.Component {
  static defaultProps={
    topMode: "year",
    format: "YYYY"
  };
  constructor(props) {
    super(props);
    this.state={
      value: null,
      mode: this.props.topMode,
      preMode: this.props.topMode
    };
    this.isOnChange = false;
  }

  /**
   *
   * @param {*} value
   * @param {要打開面板} mode
   */
  onPanelChange(value, mode){
    // console.log(`onPanelChange date:${value} mode:${mode}`);
    //mode==null默認是從year返回到month
    mode = mode || "month";
    let open = true;
    //1. 往上打開，沒有任何問題，直接打開
    if(modeValue[this.state.mode] > modeValue[mode] && modeValue[this.props.topMode] > modeValue[mode]) {
      //向下
      open = false;
      mode = this.props.topMode;
    }
    //只關閉窗口和賦值，當前的mode不變
    this.setState({
      value, open, mode,
      preMode: this.state.mode
    });
    this.props.setValue(value)
  }
  /**
   * 在date的情況下選擇直接退出
   */
  onChange(value, dateStr){
    // console.log(`onChange date:${value} dateStr:${dateStr}`);
    this.isOnChange = true;
    this.setState({
      open: false,
      value
    });
    this.props.setValue(value)
  }

  resetValue = ()=>{
    this.setState({
      value:null
    });
    this.props.setValue(null)
  }

  render() {
    // console.log(`state:${JSON.stringify(this.state)}`);
    return (
      <DatePicker
        value={this.state.value}
        placeholder={this.props.placeholder}
        mode={this.state.mode}
        open={this.state.open}
        format={this.props.format}
        onFocus={()=>!this.isOnChange&&(this.isOnChange=!this.isOnChange,this.setState({open:true}))}
        onChange={this.onChange.bind(this)}
        onPanelChange={this.onPanelChange.bind(this)}
        onOpenChange={(open)=>this.setState({open})}
      />
    );
  }

}

