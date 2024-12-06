import React, { Component } from 'react';
import './TabCtrl.css';

type TabCtrlProps = {
  small: boolean;
  tabs: TabInfo[];
  currentTab?: number;
  onTabChange: any;
  onTabRemoved?: any;
  tooltip?:string;
}
type TabCtrlState = {
  currentTab: number;
}

export class TabCtrl extends Component<TabCtrlProps, TabCtrlState> {

  constructor(props: TabCtrlProps){
    super(props);
    this.state = { currentTab: props.currentTab ? props.currentTab : 0};

    
    this.tbbg = "tb-li-bg";
    this.tbbgActive = "tb-li-active-bg";
    this.tbTxt = "tb-li-tx";
    this.tbTxtActive = "tb-li-active-tx";
  }

  onChange: any = () => {}
  onTouch: any = () => {}

  writeValue(value: any){
    let text = value
  }

  registerOnChange(fn: any){
    this.onChange = fn
  }

  registerOnTouched(fn: any){
    this.onTouch = fn
  }

  liClass(i:number){
    return (this.currentTab == i) ? 'tb-li-active' : 'tb-li';
  }

  render() {
    return (
       <ul className={ this.props.small ? 'tb-ul-small' : 'tb-ul'}>
        { this.props.tabs.map( (t, i) => (                
          <li className={this.liClass(i)}  onClick={ (ev) => this.setActive(ev, i)} key={i}>
            {t.title}
            <i className="fa fa-times i-tab" aria-hidden="true"></i>
          </li>
        ))}
      </ul>
    )
  }


  allowTabRemoval = false;

  set currentTab(value:number)
  {
    this.setState({currentTab: value});
    this.onChange(value);
  }
  get currentTab():number
  {
    return this.state.currentTab;
  }

  bg;
  tbbg;
  tbbgActive;
  tbTxt;
  tbTxtActive;

  colorSubject;

  ngOnInit() {    

    // this.colorSubject = this.colorSvc.getColorSchemeChange().subscribe( cm => {
    //   this.bg = cm.getColor("tool-workspace-bg");
    this.tbbg = "tb-li-bg";
    this.tbbgActive = "tb-li-active-bg";
    this.tbTxt = "tb-li-tx";
    this.tbTxtActive = "tb-li-active-tx";
    // });
    // this.colorSvc.postColorSchemeChange();
  }

  ngOnDestroy(): void {
    this.colorSubject.unsubscribe();
  }

  getTabState():boolean[]
  {
    let ret:boolean[] = [];
    this.props.tabs.forEach( tab => {
      ret.push(tab.show);
    });
    return ret;
  }

  setTabState( value:boolean[])
  {
    this.props.tabs.forEach( (tab, i) => {
      if (value[i] != undefined)
        tab.show = value[i];
    });
  }

  addTab(v:any, index?:number)
  {
    let ti = new TabInfo();

    if (Object.prototype.toString.call(v) == '[object String]')
    {
      ti.title = v;
      ti.show = true;
      ti.enabled = true;
    }
    else
    {
      ti.title = (v['title']) ? v['title'] : "Tab " + index;
      ti.tooltip = (v['tooltip']) ? v['tooltip'] : undefined;
      ti.show = (v['show'] == false) ? false : true;  
      ti.enabled = (v['enabled'] == 'false') ? false : true;
    }
    ti.index = (index == undefined) ? this.props.tabs.length : index;
    this.props.tabs.push(ti);
  }

  removeTab(event:MouseEvent, index:number)
  {
    event.stopPropagation();
    if (index < this.props.tabs.length)
    {
      this.props.tabs.splice(index, 1);

      this.props.onTabRemoved("" + index);

      if (this.currentTab > index)
        this.currentTab--;
      else if (this.currentTab == index)
      {
        if (this.currentTab >= this.props.tabs.length)
          this.currentTab--;
      }

      if (this.currentTab >= 0)
          this.setActive(null, this.currentTab);     
    }    
  }

  setActive (event, iIndex)
  {
    if (event)
      event.stopPropagation();
      
    if (iIndex >= 0 && iIndex < this.props.tabs.length && this.props.tabs[iIndex].enabled)
    {
      let tce = new TabChangeEvent();
      tce.newIndex = iIndex;
      tce.oldIndex = this.currentTab;
      tce.tabCtrl = this;

      this.props.tabs[iIndex].show = true;
      this.currentTab = iIndex;
      this.props.onTabChange(tce);
    }
  }

  showTab(iIndex:number, fTF:boolean)
  {
    if (this.props.tabs == undefined)
      console.log("undefined");
    if (iIndex >= this.props.tabs.length)
      console.log("too long");
    this.props.tabs[iIndex].show = fTF;
  }

  isShowing(iIndex)
  {
    return this.props.tabs[iIndex].show;
  }

  getBG(iIndex)
  {
    return (iIndex == this.props.currentTab) ? this.tbbgActive : this.tbbg;
  }

  getTxt(iIndex)
  {
    return (iIndex == this.props.currentTab) ? this.tbTxtActive : this.tbTxt;
  }

  getValidTab (prospect:number)
  {
    if (prospect == undefined || prospect < 0 || prospect > this.props.tabs.length || this.props.tabs[prospect].show == false)
    {
      for (var i = 0; i < this.props.tabs.length; i++)
      {
        if (this.props.tabs[i].show)
          return i;         
      }
      return 0;
    }
    return prospect;
  }
}

export class TabChangeEvent
{
  tabCtrl:TabCtrl;
  oldIndex:number;
  newIndex:number;
}

export class TabInfo{
  enabled:boolean;
  title:string;
  tooltip?:string = "";
  index?:number;
  show:boolean = true;
}
