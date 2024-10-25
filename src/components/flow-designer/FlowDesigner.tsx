import React, { createRef, useState } from 'react';

// import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input, HostListener, forwardRef, Output, EventEmitter } from '@angular/core';
// import { NG_VALUE_ACCESSOR } from '@angular/forms';
// import * as FileSaver from 'file-saver';
// import { IHelpDictionary, IHelpItem, IHelpComponent } from '../i-help/i-help.component';
// import { SliderComponent } from '../slider/slider.component';
// import { NodeSelection } from './device-images';
import { NodeSelection, Connector, FlowPoint, FPDiamond, FPImage, FPOval, FPRectangle, FPRenderer, FPLocation, FPUser, FPBarcode } from './FlowObjects.ts';
import Slider from '../slider/Slider.js';
import { TabCtrl, TabInfo } from '../tab-ctrl/TabCtrl.tsx';
import NodePanel from './NodePanel.js';
import CreationMenu from './CreationMenu.js';
import './FlowDesigner.css';
import Caption from './Caption.js';

const MENU_ACTIONS = {
  CLICKED: 'clicked',
  CANCELED: 'canceled'
}
type FPState = {
  menuShowing: 'none' | 'creation' | 'caption';
  state: string;
}

type FPProps = {
  nodeSelection: NodeSelection[];
  logoSrc: string;
}
export default class FlowDesignerComponent extends React.Component<FPProps, FPState> {
  
  constructor(props: FPProps) { 
    super(props);

    FPBarcode.loadImages();

    this.contextMenu = createRef();
    this.slider = createRef();  
    this.canvasRef = createRef();

    this.state = {menuShowing: 'none', state: ''};
  }

  menuReducer = (state, action) =>{
    this.menuClicked(state);
  }
  captionReducer = (state, action) =>{
    switch(action){
      case 'caption-changed':
        this.fpPending.text = state;
        break;
      case 'background-changed':
        this.fpPending.background = state;
        break;
      case 'color-changed':
        this.fpPending.color = state;
        break;
    }
  }

  onChange: any = () => {}
  onTouch: any = () => {}

  currentTab = 0;
  tabs:TabInfo []= [
    {
      enabled: true,
      title: "Services",
      show: true
    },
    {
      enabled: true,
      title: "Locations",
      show: true
    },
    {
      enabled: true,
      title: "Graphics",
      show: true
    }];

  graphicLogo = {text:'logo'};
  graphicStart = {text:'Start'};
  graphicEnd = {text:'End'};
  graphicOval = {text:'oval'};
  graphicDiamond = {text:'diamond'};
  graphicDiamondComment = {text:'Comment'};
  graphicRectangle = {text:'Comment'};
  graphicComment = {text:'Comment'};
  graphicLocation = {text:'Location'};

  get canvas (): any{
    return this.canvasRef?.current;
  }
  get ctx(){
    return this.canvas.getContext("2d");
  }
  _scale = 1;
  set scale(value:number)
  {
    this._scale = value;
    this.redraw(false);
  }
  get scale()
  {
    return this._scale;
  }z

  get showMenuBackground()
  {
    return this.fpPending instanceof FPOval
    ||this.fpPending instanceof FPDiamond
    ||this.fpPending instanceof FPRectangle;
  }

  writeValue(value: any){
    this.flowInfo = value;
  }

  registerOnChange(fn: any){
    this.onChange = fn
  }

  registerOnTouched(fn: any){
    this.onTouch = fn
  }

  // clicked = new EventEmitter();

  _nodeSelection: NodeSelection[] = [];
  set nodeSelection(value)
  {
    this._nodeSelection = value;
    let width = this.calculateSelectionWidth();
    if (width > 0)
      width += 10;
    this.selectionWidth = width + "px";
  }
  get nodeSelection()
  {
    return this._nodeSelection;
  }

  userRenderer:FPRenderer;

  set flowInfo(value:FlowDesignerData)
  {
    if (value != null)
      this.setupData(value);
  }
  get flowInfo():FlowDesignerData
  {
    return  {scale:this.scale, flowPoints:this.flowPoints, connectors:this.connectors};
  }

  selectionWidth = "fit-content";

  background = "white";
  showzoom = false;
  
  //@ViewChild("canvas", {static:true}) canvasRef:ElementRef;
  //@ViewChild("slider", {static:true}) slider:SliderComponent;


  // @ViewChild(IHelpComponent, {static: true})
  // iHelp:IHelpComponent;
  // helpDictionary = new FlowDesignerHelpDictionary();

  currentMenu;
  caption;
  contextMenu ;
  slider;  
  canvasRef;
  canvasDivRef = createRef<HTMLDivElement>();

  logoImg;


  flowPoints:FlowPoint[] = [];
  connectors:Connector[] = [];
  fpPending = new FlowPoint();

  calculateSelectionWidth()
  {
    let width = 0;
  
    if (this.nodeSelection && this.canvas)
    {
      this.nodeSelection.forEach( each =>{
        var mt = this.ctx?.measureText(each.name);
        width = Math.max(mt ? mt.width : 100, width);
      });
    }
    return width;
  }

  tabChange(event)
  {
    this.currentTab = event.newIndex;
  }
  
  setFocus()
  {
    setTimeout( () =>
    {      
      let canvasContainer = document.getElementById("canvas-div");
      if (canvasContainer != null)
      { 
        if (this.flowInfo.flowPoints.length == 0)
        {
          let r = canvasContainer.getBoundingClientRect();
          this.canvas.width = r.width;
          this.canvas.height = r.height;
        }
        
        let ctx = this.ctx;
        this.redraw(false);    
        //this.slider.doDrawing();  
      }
    }, 10);
  }

  pt(ev:MouseEvent)
  {
    let r = this.canvas.getBoundingClientRect(); // .getBoundingClientRect();
    return {x:(ev.clientX - r.left) / this.scale, y:(ev.clientY - r.top) / this.scale};
  }

  path(d)
  {
    return d.path;
  }

  fpClicked(ev, dbl:boolean)
  {
    if (false)
    {
      // let fps = this.onSwitch(ev);
      // if (fps.length > 0)
      // {      
      //   this.clicked.next({fp:fps[0], dbl:dbl, action:"switch"});
      //   ev.stopPropagation();
      //   return;
      // }
      // fps = this.onMedia(ev);
      // if (fps.length > 0)
      // {      
      //   this.clicked.next({fp:fps[0], dbl:dbl, action:"media"});
      //   ev.stopPropagation();
      //   return;
      // }
      // fps = this.atPoint(ev);
      // if (fps.length > 0)
      // {      
      //   this.clicked.next({fp:fps[0], dbl:dbl, action:"default"});
      //   ev.stopPropagation();
      // }
    }
    else if (dbl)
    {
      let sel = this.atPoint(ev);
      this.fpPending = sel[0];
      this.openFPMenu(sel[0], 'caption');
    }
  }

  test()
  {
    this.redraw(false);
  }

  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) 
  // {
  //   switch(event.key)
  //   {
  //     case "Delete":
  //       if (this.currentMenu == undefined)
  //       {
  //         for (var i = this.flowPoints.length; i > 0; i--)
  //         {
  //           let fp = this.flowPoints[i-1];
  //           if (fp.selected > 0)
  //           {
  //             for (var j = this.connectors.length; j > 0; j--)
  //             {
  //               let c = this.connectors[j-1];
  //               if (c.fp1 == fp || c.fp2 == fp)
  //               {
  //                 this.connectors.splice(j-1, 1);
  //               }
  //             }
  //             this.flowPoints.splice(i-1, 1);
  //           }
  //         }
  //         for (var j = this.connectors.length; j > 0; j--)
  //         {
  //           let c = this.connectors[j-1];
  //           if (c.selected > 0)
  //           {
  //             this.connectors.splice(j-1, 1);
  //           }
  //         }

  //         this.redraw(this.canvas.getContext("2d"), true);
  //       }
  //       break;
  //   }   
  // }

  checkCanvas()
  {
    let canvasDiv = this.canvasDivRef.current as HTMLElement;
    this.canvas.width = canvasDiv.clientWidth;
    this.canvas.height = canvasDiv.clientHeight;
    this.redraw(false);

    // if (!canvasDiv){
    //   let w = 0;
    //   let h = 0;
    //   this.flowPoints.forEach( each => {
    //     let r = each.selectedRect(ctx);
    //     w = Math.max(r.x + r.w, w);
    //     h = Math.max(r.y + r.h, h);
    //   })  

    //   w = Math.max (w * this.scale, canvasDiv.clientWidth);
    //   h = Math.max (h * this.scale, canvasDiv.clientHeight);

    //   if (w > this.canvas.width)
    //     this.canvas.width = w;
    //   if (h > this.canvas.height)
    //     this.canvas.height = h; 
    // }
  } 

  refresh()
  {
    // this.slider.doDrawing();
    this.redraw(false);    
  }  
  
  redraw(updateData:boolean)
  {
    const ctx = this.ctx;
    if (!ctx) return;
    //ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.font = FlowPoint.graphicFont;
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  

    this.flowPoints.forEach( each => {
      //ctx.save();
      //ctx.rotate(each.rotation * Math.PI / 180);   
      
      ctx.save();
      ctx.resetTransform();
      ctx.scale(this.scale, this.scale);

      if (each.rotation != 0)
      {
        let tmpX = each.x + each.w / 2;
        let tmpY = each.y + each.h / 2;
        ctx.translate(tmpX, tmpY);
        ctx.rotate(each.rotation * Math.PI / 180);
        ctx.translate(-tmpX, -tmpY);
      }  
      
      if (each.type == "FPUser")
        this.userRenderer.render(ctx, each);
    
      each.render(ctx);  

      ctx.resetTransform();
      ctx.scale(this.scale, this.scale);

      if (this.state.state == "connecting" || each.selected > 0)
        each.drawSelectionConnector(ctx);
         
      ctx.restore();    
    })  

    ctx.resetTransform();
    ctx.scale(this.scale, this.scale);

    this.connectors.forEach(each => {
      each.render(ctx, false);
    })

    if (updateData)
    {
      let data = this.flowInfo;
      this.onChange(data);
      this.onTouch(data);
    }
    //ctx.restore();
  }

  textEntry:string = "";
  mouseDown(ev:any)
  {
    if (true)
    {
      const ctx = this.ctx;

      this.checkCanvas();
      this.closeMenu();
      
      let startX = ev.clientX;
      let startY = ev.clientY;
      let rect = this.canvas.getBoundingClientRect();

      let c = this.getDotAtPoint(ev.clientX - rect.left, ev.clientY - rect.top, ctx);
      if (c)
      {
        this.createConnector(ev, c);
      }
      else
      {
        // if (!ev.ctrlKey)
        //   this.clearSelection();      

        if (c = this.getArrowAtPt(ev))
        {
          this.moveArrow(ev, c, false);
        }
        else if (c = this.getOriginAtPoint(ev))
        {
          this.moveArrow(ev, c, true);
        }
        else if (c = this.getSelectedConnectorAtPoint(ev, ctx))
        {
          this.bendConnector(ev, c);
        }
        else if (this.selectConnectors(ev, ctx).length > 0)
        {
          this.redraw(false);
        }
        else 
        {
          // no connectors are selected, test for flowPoints
          let atPoint = this.atPoint(ev);
          if (atPoint.length > 0)
          {      
            if (!ev.ctrlKey)
              this.clearSelection();
         
            atPoint.forEach( each => {
              if (ev.ctrlKey)
                each.selected = each.selected > 0 ? 0 : Date.now();
              else 
                each.selected = Date.now();
            })     
            this.redraw(false);
          }        
          else if (!ev.ctrlKey)
          {
            this.clearSelection();
          }
          if (!ev.ctrlKey || ev.ctrlKey)
          {
            let selected = this.getSelected(ev);
            if (selected.length == 0)
            {   
              document.onmousemove = (e) => {
                e.stopPropagation();
                e.preventDefault();

                this.redraw(false);
                ctx.strokeStyle = "red";
                ctx.strokeRect((startX - rect.left) / this.scale, 
                              (startY - rect.top) / this.scale, 
                              (e.clientX - startX) / this.scale, 
                              (e.clientY - startY) / this.scale);  
              }
              document.onmouseup = (e) => {
                let fp = new FPRectangle();
                fp.x = (startX - rect.left) / this.scale;
                fp.y = (startY - rect.top) / this.scale;
                fp.w = e.clientX - startX;
                fp.h = e.clientY - startY;  

                fp.x = Math.min(fp.x, fp.x + fp.w);
                fp.y = Math.min(fp.y, fp.y + fp.h);
                fp.w = Math.abs(fp.w);
                fp.h = Math.abs(fp.h);

                if (fp.w > 3 || fp.h > 3)
                {
                  this.fpPending = fp;
                  
                  e.preventDefault();
                  e.stopPropagation();
                  this.fpPending.text = "";
                  this.textEntry = "";
                  
                  this.openFPMenu(fp, "creation");
                }    
                else
                {
                  document.onclick = (e)=>
                  {
                    this.doSelect(e, ctx);
                    document.onclick = null;
                  }
                } 

                document.onmousemove = null;
                document.onmouseup = null;
              }    
            }
            else 
            {
              document.onmousemove = (e) => {
                e.stopPropagation();
                e.preventDefault();

                let moveX = (e.clientX - startX) / this.scale;
                let moveY = (e.clientY - startY) / this.scale;

                startX = e.clientX;
                startY = e.clientY;

                selected.forEach( each => {
                  each.x += moveX;
                  each.y += moveY;
                })
                this.redraw(false); 
              }
              document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
              }
              this.redraw(true);
            }
          }
        }
      }
    }
  }

  getDotAtPoint(x:number, y:number, ctx)
  {
    x /= this.scale;
    y /= this.scale;

    let ret:FlowPoint[] = [];
    this.flowPoints.forEach( each => {
      if (each.selected > 0)
        ret.push(each);
    });

    if (ret.length > 0)
    {
      for (var i = 0; i < ret.length; i++)
      {
        let fp = ret[i];
        for (var j = 0; j < 4; j++)
        {
          if (Connector.contains(x, y, fp, j, ctx))
          {
            let connector = new Connector();
            connector.fp1 = fp;
            connector.index1 = j;
            return connector;
          }
        }
      }
    }
  }

  getArrowAtPt(ev:MouseEvent)
  {
    for (var i = 0; i < this.connectors.length; i++)
    {
      if (this.connectors[i].arrowContains(this.pt(ev)))
        return this.connectors[i];
    }
    return undefined;
  }

  getOriginAtPoint(ev:MouseEvent)
  {    
    let p = this.pt(ev);
    for (var i = 0; i < this.connectors.length; i++)
    {
      let connector = this.connectors[i];
      let cc = connector.fp1?.connectorCenter(this.ctx, connector.index1);
      
      if (!!cc){
        let a1 = Math.abs(p.y - cc.y);
        let b1 = Math.abs(p.x - cc.x);
        
        if (Math.sqrt(a1*a1 + b1*b1) < 12)
          return connector;
      }
    }
    return undefined;
  }

  createConnector(ev:MouseEvent, connector:Connector)
  {
    let rect = this.canvas.getBoundingClientRect();
    let ctx = this.ctx;     
    
    var c = connector.fp1?.connectorCenter(ctx, connector.index1);
    
    this.setState({state: "connecting"});

    document.onmousemove = (e) => {
      e.stopPropagation();
      e.preventDefault();

      this.redraw(false);

      if (!!ctx && !!c) {
        ctx.strokeStyle = "black";
        ctx.beginPath();     
        ctx.moveTo(c.x, c.y);
        ctx.lineTo((e.clientX - rect.left) / this.scale, (e.clientY - rect.top) / this.scale);
        ctx.stroke();
      }
    }

    document.onmouseup = (e) => {      
      e.preventDefault();
      e.stopPropagation();
      document.onmousemove = null;
      document.onmouseup = null;

      this.flowPoints.forEach( fp => {
        for (var j = 0; j < 4; j++)
        {
          if (Connector.contains((e.clientX - rect.left) / this.scale, (e.clientY - rect.top) / this.scale, fp, j, ctx))
          {
            connector.fp2 = fp;
            connector.index2 = j;
            this.connectors.push(connector);
            break;
          }
        }
      });
      
      this.setState({state: "none"});
      this.redraw(true);
    }  
  }

  bendConnector(ev:MouseEvent, connector:Connector)
  {
    let rect = this.canvas.getBoundingClientRect();
    let ctx = this.canvas.getContext("2d");
  
    let startMoveX = (ev.clientX - rect.left);
    let startMoveY = (ev.clientY - rect.top);
    let startBX = connector.bx;
    let startBY = connector.by;

    document.onmousemove = (e) => {
      e.stopPropagation();
      e.preventDefault();  
         
      if (connector.bx == undefined)
      {
        connector.bx = (e.clientX - rect.left) / this.scale;
        connector.by = (e.clientY - rect.top) / this.scale;
        startBX = connector.bx;
        startBY = connector.by;
      }
      else
      {
        connector.bx = startBX + ((e.clientX - rect.left) - startMoveX) / this.scale;
        connector.by = startBY + ((e.clientY - rect.top) - startMoveY) / this.scale;
      }
      this.redraw(false);
    }

    document.onmouseup = (e) => {      
      e.preventDefault();
      e.stopPropagation();
      document.onmousemove = null;
      document.onmouseup = null;
      
      this.setState({state: 'none'});
      this.redraw(true);
    }  
  }

  moveArrow(ev:MouseEvent, connector:Connector, swap:boolean)
  {
    let rect = this.canvas.getBoundingClientRect();
    let ctx = this.canvas.getContext("2d");
    let saveFP1 = connector.fp1;
    let saveIndex1 = connector.index1;
    let saveFP2 = connector.fp2;
    let saveIndex2 = connector.index2;
       
    var c = (swap) ? connector.fp2?.connectorCenter(ctx, connector.index2)
                   : connector.fp1?.connectorCenter(ctx, connector.index1);
    
    connector.selected = Date.now();
    
    this.setState({state: 'connecting'});

    document.onmousemove = (e) => {
      e.stopPropagation();
      e.preventDefault();

      if (!!ctx && !!c) {
        this.redraw(false);

        ctx.strokeStyle = "black";
        ctx.beginPath();     
        
        ctx.moveTo(c.x, c.y);
        let newX = (e.clientX - rect.left) / this.scale;
        let newY = (e.clientY - rect.top) / this.scale;
        if (connector.bx == undefined)
        {
          ctx.lineTo(newX, newY);
        }
        else
        {
          ctx.bezierCurveTo(connector.bx, connector.by, connector.bx, connector.by, newX, newY);
        }
        ctx.stroke();
      }
    }

    document.onmouseup = (e) => {      
      e.preventDefault();
      e.stopPropagation();
      document.onmousemove = null;
      document.onmouseup = null;

      let newX = (e.clientX - rect.left) / this.scale;
      let newY = (e.clientY - rect.top) / this.scale;

      this.flowPoints.forEach( fp => {
        for (var j = 0; j < 4; j++)
        {
          if (Connector.contains(newX, newY, fp, j, ctx))
          {
            let origin = swap ? saveFP2 : saveFP1;
            let originIndex = swap ? saveIndex2 : saveIndex1;
            connector.fp1 = swap ? fp : origin;
            connector.index1 = swap ? j : originIndex;
            connector.fp2 = swap ? origin : fp;
            connector.index2 = swap ? originIndex : j;
          }
        }
      });
      
       this.setState({state: 'none'});
      this.redraw(true);
    }  
  }

  graphicDropped(item:string, rect)
  {
    var fpNew;
    switch (item)
    {
      case "Logo":
        fpNew = new FPImage();
        fpNew.asset =  "app/flow-designer/images/Conveyance-icon-red.png";
        fpNew.img = this.logoImg;
        break;
      case "Start":
      case "End":
      case "Oval":
        fpNew = new FPOval();
        break;
      case "Decision":
      case "Diamond":
      case "DiamondComment":
        fpNew = new FPDiamond();      
        break;
      case "Process":
      case "Comment":
      case "Rectangle":
        fpNew = new FPRectangle();
        break;     
    }

    fpNew.x = rect.x;
    fpNew.y = rect.y;
    fpNew.w = item == "Logo" ? Math.min(rect.w, rect.h) : rect.w;
    fpNew.h = item == "Logo" ? fpNew.w : rect.h;
    fpNew.text = item;
    this.fpPending = fpNew;
    this.flowPoints.push(fpNew);

    let ctx = this.canvas.getContext("2d");
    this.redraw(true);
    this.openFPMenu(fpNew, 'caption');    
  }

  menuClicked(item:string)
  {
    var fpNew;
    var text = "";
    switch (item)
    {
      case "Logo":
        fpNew = new FPImage();
        fpNew.asset =  "app/flow-designer/images/Conveyance-icon-red.png";
        fpNew.img = this.logoImg;
        break;
      case "Start":
        fpNew = new FPOval();
        text = "Start";
        break;
      case "End":
        fpNew = new FPOval();
        text = "End";
        break;
      case "Oval":
        fpNew = new FPOval();
        break;
      case "Decision":
        fpNew = new FPDiamond();     
        text = "Decision";   
        break;
      case "Process":
        fpNew = new FPRectangle();
        text = "Process";
        break;            
      case "Location":
        fpNew = new FPLocation();
        text = "Location";
        break;     
    }

    fpNew.x = this.fpPending.x;
    fpNew.y = this.fpPending.y;
    fpNew.w = item == "Logo" ? Math.min(this.fpPending.w, this.fpPending.h) : this.fpPending.w;
    fpNew.h = item == "Logo" ? fpNew.w : this.fpPending.h;
    fpNew.text = text; //this.fpPending.text;
    this.fpPending = fpNew;
    this.flowPoints.push(fpNew);
    this.redraw(true);
    this.closeMenu();
  }

  save()
  {
    let data = {flowPoints:this.flowPoints, connectors:this.connectors};
    var str = JSON.stringify(data, null, 2);
	  str = btoa( str );

    var blob = new Blob( [ str ], {
      type: 'application/octet-stream'
    });

    // FileSaver.saveAs(blob, "FlowDesigner.fd");
    

    /*
    var text = "hello world",
    blob = new Blob([text], { type: 'text/plain' }),
    anchor = document.createElement('a');

    anchor.download = "c:\\pdfs\\hello.txt";
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.href].join(':');
    anchor.click();
    */
    
  }

  fpByID(id:number)
  {
    for (var i = 0; i < this.flowPoints.length; i++)
    {
      if (this.flowPoints[i].id == id)
        return this.flowPoints[i];
    }
    return undefined;
  }

  loadDiagram(event)
  {
    // this.closeMenu();
    // var fileReader = new FileReader();  

    // fileReader.onload = (e)=> {

    //   var typedarray = atob(fileReader.result.toString());
    //   let data = JSON.parse(typedarray);
    //   this.flowPoints = [];
    //   data.flowPoints.forEach( each => {
    //     switch (each.type)
    //     {
    //       case 'FPOval':
    //         this.flowPoints.push(new FPOval(each));
    //         break;
    //       case 'FPRectangle':
    //         this.flowPoints.push(new FPRectangle(each));
    //         break;
    //       case 'FPImage':
    //         this.flowPoints.push(new FPImage(each));
    //         break;
    //       }
    //   });
    //   this.connectors = [];
    //   data.connectors.forEach( each => {
    //     let c = new Connector();
    //     c.fp1 = this.fpByID(each.fp1.id);
    //     c.index1 = each.index1;
    //     c.fp2 = this.fpByID(each.fp2.id);
    //     c.index2 = each.index2;
      
    //     this.connectors.push(c);
    //   });
    //   this.redraw(this.canvas.getContext("2d"), false);
    // }      

    // fileReader.readAsText(event.target.files[0]);
  }

  setupData(data:FlowDesignerData)
  {
    this.flowPoints = [];

    if (data.scale)
      this.scale = data.scale;

    data.flowPoints.forEach( each => {
      switch (each.type)
      {
        case 'FPDiamond':
          this.flowPoints.push(new FPDiamond(each));
          break;
        case 'FPLocation':
          this.flowPoints.push(new FPLocation(each));
          break;         
        case 'FPOval':
          this.flowPoints.push(new FPOval(each));
          break;
        case 'FPRectangle':
          this.flowPoints.push(new FPRectangle(each));
          break;
        case 'FPImage':
          this.flowPoints.push(new FPImage(each));
          break;
        case 'FPUser':
          {
            let fp = new FPUser(each);
            fp.userData = each.userData;                      
            this.flowPoints.push(fp);
          }
        }
    });
    this.connectors = [];
    data.connectors.forEach( each => {
      if (each.fp1 && each.fp2){
        let c = new Connector();
        c.fp1 = this.fpByID(each.fp1.id);
        c.index1 = each.index1;
        c.fp2 = this.fpByID(each.fp2.id);
        c.index2 = each.index2;
        c.bx = each.bx;
        c.by = each.by;
      
        this.connectors.push(c);
      }
    });
    this.redraw(false);
  }

  clearSelection()
  {
    this.flowPoints.forEach( each => {
      each.selected = 0;
    });
  }

  inputKey(ev:KeyboardEvent)
  {
    switch (ev.key)
    {
      case "Enter":
        this.fpPending.text = this.textEntry;
        this.closeMenu();
        break;
    }
  }

  closeMenu()
  {
    if (this.state.menuShowing !== 'none')
    {
      this.ctx.font = FlowPoint.graphicFont;
      let mt = this.ctx.measureText(this.fpPending.text);      

      switch (this.fpPending.type)
      {
      case "FPDiamond":
        if (mt.width >= this.fpPending.w)
          this.fpPending.w = mt.width + 80;
        else if (mt.width < this.fpPending.w && this.fpPending.w > 100)
          this.fpPending.w = Math.max(mt.width + 80, 100);

        if ((3 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) >= this.fpPending.h)
          this.fpPending.h = (3 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) + 3;
        break;
      case "FPRectangle":
      case "FPOval":   
        if (mt.width >= this.fpPending.w)
          this.fpPending.w = mt.width + 20;
        else if (mt.width < this.fpPending.w && this.fpPending.w > 100)
          this.fpPending.w = Math.max(mt.width + 20, this.fpPending.w);

        if ((2 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) >= this.fpPending.h)
          this.fpPending.h = (2 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) + 3;
        break;
      case "FPLocation":   
        if (mt.width >= this.fpPending.w)
          this.fpPending.w = mt.width + 20;
        else if (mt.width < this.fpPending.w && this.fpPending.w > 100)
          this.fpPending.w = Math.max(mt.width + 20, this.fpPending.w);

        if ((2 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) >= this.fpPending.h)
          this.fpPending.h = (2 * (mt.actualBoundingBoxAscent + mt.actualBoundingBoxDescent)) + 3;
        break;
      }
      this.setState({ menuShowing: 'none'});
    }
    
    const style = this.contextMenu.current.style;    
    style.display = 'none';

    this.fpPending = new FlowPoint();
  }

  openFPMenu(fp:FlowPoint, r:any)
  {
    this.openMenu((fp.x + fp.w / 2) * this.scale, (fp.y + fp.h / 2) * this.scale, r);
  }

  menuLeft = "";
  menuTop = "";

  openMenu(x:number, y:number, r:any)
  {
    // this.currentMenu = r;
    this.setState({menuShowing: r});
    const style = this.contextMenu.current.style;
    
    style.display = "block";
    style.left = x + 'px';
    style.top = y + 'px';
  }

  doSelect(ev:MouseEvent, ctx)
  {
    document.onclick = null;
    let r = this.pt(ev);
    let x = r.x;
    let y = r.y;

    if (!ev.ctrlKey)
    {
      this.flowPoints.forEach( each => {
        each.selected = 0;
      });
    }
    
    this.flowPoints.forEach( each => {
      if (each.contains(x, y, ctx))
        each.selected = each.selected ? 0 : Date.now();
    })
    this.redraw(false);
  }

  atPoint(ev:MouseEvent):FlowPoint[]
  {
    let ret:FlowPoint[] = [];
    let r = this.pt(ev);
    let x = r.x;
    let y = r.y;
    let ctx = this.ctx;

    this.flowPoints.forEach( each => {
      if (each.contains(x, y, ctx))
        ret.push(each);
    });

    return ret;
  }

  onSwitch(ev:MouseEvent):FlowPoint[]
  {
    let ret:FlowPoint[] = [];
    let r = this.pt(ev);
    let x = r.x;
    let y = r.y;

    this.flowPoints.forEach( each => {
      if (each instanceof FPUser && each.onSwitch(x, y))
        ret.push(each);
    });

    return ret;
  }

  onMedia(ev:MouseEvent):FlowPoint[]
  {
    let ret:FlowPoint[] = [];
    let r = this.pt(ev);
    let x = r.x;
    let y = r.y;

    this.flowPoints.forEach( each => {
      if (each instanceof FPUser && each.onMedia(x, y))
        ret.push(each);
    });

    return ret;
  }

  getSelectedConnectorAtPoint(ev:MouseEvent, ctx):Connector | undefined
  {
    let p = this.pt(ev);
    let selId = Date.now();
    
    for (var i = 0; i < this.connectors.length; i++) {
      let c = this.connectors[i];
      if (c.selected > 0 && c.intersectsRect(p.x, p.y, ctx, this.scale))
        return c;      
    }
    return undefined;
  }

  selectConnectors(ev:MouseEvent, ctx):Connector[]
  {
    let p = this.pt(ev);
    let ret:Connector[] = [];
    let selId = Date.now();
    
    this.connectors.forEach( c => {
      
      if (!ev.ctrlKey)
          c.selected = 0;
      if (c.intersectsRect(p.x, p.y, ctx, this.scale))
      {
        if (ev.ctrlKey)
          c.selected = c.selected ? 0 : selId++;
        else
          c.selected = selId++;
        ret.push(c);
      }
    });
    return ret;
  }  

  getSelected(ev?:MouseEvent): FlowPoint[]
  {
    let ret: FlowPoint[] = [];
    this.flowPoints.forEach( each => {
      if (each.selected > 0)
        ret.push(each);
    });
    if (ev && ret.length == 0)
    {
      ret = this.atPoint(ev);
      ret.forEach( each => {
        each.selected = Date.now();
      });
    }
    return ret;
  }

  deviceDrag(ev, d:NodeSelection)
  {
    ev.dataTransfer.setData("text", d.name);
    let data = ev.dataTransfer.getData("text");
    //console.log(data);
  }   

  graphicDrag(ev, text)
  {
    ev.dataTransfer.setData("text/json", {type:text});
    let data = ev.dataTransfer.getData("text");
  }   

  allowDrop(ev) {
    ev.preventDefault();
  }

  onDragStart(event, text) {
    event.stopPropagation();

    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text", text);
  }

  deviceDrop(ev) {
    ev.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    let evX = (ev.clientX - rect.left) / this.scale;
    let evY = (ev.clientY - rect.top) / this.scale;
    var text = ev.dataTransfer.getData("text");
    if (text && text.length > 0)
    {
      var fp: any = undefined;

      switch(text)
      {
        case "Logo":
          this.graphicDropped(text, {x:evX - 15, y:evY - 15, w:100, h:30});
          break;
        case "Oval":
          this.graphicDropped(text, {x:evX - 50, y:evY - 15, w:100, h:30});
          break;
        case "Start":
          this.graphicDropped(text, {x:evX - 50, y:evY - 15, w:100, h:30});
          break;
        case "End":
          this.graphicDropped(text, {x:evX - 50, y:evY - 15, w:100, h:30});
          break;
        case "Decision":
        case "Diamond":
        case "DiamondComment":
        case "Process":
          this.graphicDropped(text, {x:evX - 50, y:evY - 15, w:100, h:30});
        break;
        case "Comment":
        case "Rectangle":
          break;

        case "Code39":
        case "Code128":
        case "EAN_13":
        case "UPC_A":
        case "Finisher":
          fp = new FPLocation();
          fp.w = 90;
          fp.h = 43;
          fp.x = (ev.clientX - rect.left - fp.w / 2) / this.scale;
          fp.y = (ev.clientY - rect.top - fp.h / 2) / this.scale;
          fp.text = text;          
          // fp.asset = text;
          this.flowPoints.push(fp); 
          this.fpPending = fp;         
          this.openFPMenu(fp, 'caption'); 
          break;
        case "DataMatrix":
          fp = new FPLocation();
          fp.w = 32;
          fp.h = 42;
          fp.x = (ev.clientX - rect.left - fp.w / 2) / this.scale;
          fp.y = (ev.clientY - rect.top - fp.h / 2) / this.scale;
          fp.text = text;          
          fp.asset = text;
          this.flowPoints.push(fp); 
          this.fpPending = fp;         
          this.openFPMenu(fp, 'caption'); 
          break;
        case "HandHeldScanner":
        case "Laminator":
          fp = new FPLocation();
          fp.w = 32;
          fp.h = 42;
          fp.x = (ev.clientX - rect.left - fp.w / 2) / this.scale;
          fp.y = (ev.clientY - rect.top - fp.h / 2) / this.scale;
          fp.text = text;          
          fp.asset = text;
          this.flowPoints.push(fp); 
          this.fpPending = fp;         
          this.openFPMenu(fp, 'caption'); 
          break;
        default:          
          fp = new FPImage();
          fp.w = 80;
          fp.h = 32;
          fp.x = (ev.clientX - rect.left - fp.w / 2) / this.scale;
          fp.y = (ev.clientY - rect.top - fp.h / 2) / this.scale;
          fp.text = text;          
          fp.asset = data;
          this.flowPoints.push(fp);
          break;
      }
    }
    else
    {
      var data = ev.dataTransfer.getData("text/json");
      if (data && data.length > 0)
      {
        let obj = JSON.parse(data);
        let rect = this.canvas.getBoundingClientRect();
        let fp = new FPUser();
        fp.userData = obj;
        fp.w = 80;
        fp.h = 32;
        fp.x = (ev.clientX - rect.left - fp.w / 2) / this.scale;
        fp.y = (ev.clientY - rect.top - fp.h / 2) / this.scale;
        fp.text = obj.name;
       
        this.flowPoints.push(fp);
      }
    }
    let ctx = this.ctx;
    this.redraw(true);  
  }

  textFromPath(path:string)
  {
    let s = path.lastIndexOf("/");
    let test = path.substring(s);
    for (var i = 0; i < this.nodeSelection.length; i++)
    {
      s = this.nodeSelection[i].path.lastIndexOf("/");
      if (test == this.nodeSelection[i].path.substring(s))
      {
        return this.nodeSelection[i].name;
      }
    }
    return "";
  }

  dropType(path:string)
  {
    let s = path.lastIndexOf("/");
    let d = path.lastIndexOf(".");
    return path.substring(s+1, d);
  }

  showInfo(event?)
  {
    // this.iHelp.show(this.helpDictionary.get("site-map message"));
  }

  onWheelEvent(event:WheelEvent)
  {
    if (event.ctrlKey)
    {
      event.stopPropagation();
      event.preventDefault();

      let tmp = this.scale;
      
      if(event.deltaY > 0)
        tmp -= 0.01;
      else
        tmp += 0.01;

      if (tmp <= 0.1)
        tmp = 0.1;
      if (tmp >= 2)
        tmp = 2;
    
      this.scale = tmp;
    }
  }  

  render() {
    return (
    <>
    {/* <i-help></i-help> */}
      <div className="fd-container">
        <div className="fd-scale">
        {/* <Slider ref={this.slider} title={Zoom}" [show]="showzoom" [minimum]="0.1" [maximum]="2" [(ngModel)]="scale"></app-slider> */}
        </div>
  
      <div className="fd-selection">
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <TabCtrl tabs={this.tabs} small={true} onTabChange={ (ev:number) => this.tabChange(ev)} />
          <i className="fa fa-info-circle fd-info" aria-hidden="true" onClick={ (ev) => this.showInfo(ev)}></i>
        </div>
        <span style={{width:'100%',borderTop:'solid 1px black',marginBottom:'10px'}}></span>

        { this.currentTab == 2 && <NodePanel nodeSelection={this.nodeSelection} path={this.path} deviceDrag={this.deviceDrag}/> }

        { this.currentTab == 1 &&
          <div>
            <img src="./assets/images/HandHeldScanner.gif" className="fd-graphic" />
            <img src="./assets/images/Laminator.gif" className="fd-graphic" />
            <img src="./assets/images/Finisher.gif" className="fd-graphic" />
            <img src="./assets/barcode/Code39.gif" className="fd-graphic" />
            <img src="./assets/barcode/Code128.gif" className="fd-graphic" />
            <img src="./assets/barcode/EAN_13.gif" className="fd-graphic" />
            <img src="./assets/barcode/DataMatrix.gif" className="fd-graphic-square" />
            <img src="./assets/barcode/UPC_A.gif" className="fd-graphic" />
          </div>
        }
    
        { this.currentTab == 0 &&
          <div className='fd-menu'>
            <img src={require('./images/Start.jpg')} className="fd-graphic" onDragStart={(ev)=>this.onDragStart(ev, 'Start')}/>
            <img src={require('./images/End.jpg')} className="fd-graphic" onDragStart={(ev)=>this.onDragStart(ev, 'End')}/>
            {/* <img src={require('./images/Diamond.jpg')} className="fd-graphic" onDragStart={(ev)=>this.onDragStart(ev, 'Decision')}/> */}
            <img src={require('./images/Decision.jpg')} className="fd-graphic" onDragStart={(ev)=>this.onDragStart(ev, 'Decision')}/>
            <img src={require('./images/Process.jpg')} className="fd-graphic" onDragStart={(ev)=>this.onDragStart(ev, 'Process')}/>
          </div> 
        }
      </div>
      <div ref={this.canvasDivRef} className="fd-canvas-div" style={{ borderLeft: '3px solid #555'}}>
        <canvas ref={this.canvasRef} onMouseDown={ (ev) => this.mouseDown(ev)} onDragOver={ (ev) => this.allowDrop(ev)}  onDrop={ (ev) => this.deviceDrop(ev)} onClick={ (ev) => this.fpClicked(ev,false)} onDoubleClick={ (ev) => this.fpClicked(ev,true)}></canvas>
        <div ref={this.contextMenu} className="fd-context">
          { this.state.menuShowing === 'creation' && <CreationMenu menuClicked={this.menuReducer} />}
          { this.state.menuShowing === 'caption' && <Caption dispatch={this.captionReducer} originalCaption={this.fpPending.text} />}
        </div>  
      </div>
  </div>
  

{/* <ng-template #creationmenu>
  <ul className="fd-ul">
    <!-- li (click)="menuClicked('Logo')">Conveyance Logo</li -->
    <li (click)="menuClicked('Start')">Start</li>
    <li (click)="menuClicked('End')">End</li>
    <li (click)="menuClicked('Decision')">Decision</li>
    <li (click)="menuClicked('Process')">Process</li>
  </ul>  
</ng-template>

<ng-template #caption>
  <div className="fd-caption">
    <label>Name</label>
    <input type="text" id="bob"(change)="change()" [(ngModel)]="fpPending.text" className="fd-select" placeholder="Your comment here">
    
    <label>Text color</label>
    <select className="fd-select" [(ngModel)]="fpPending.color" (change)="test()">
      <ng-container *ngIf="showMenuBackground">
        <option [ngValue]="'white'">white</option>
      </ng-container>
      <option [ngValue]="'black'">black</option>
      <option [ngValue]="'red'">red</option>
      <option [ngValue]="'green'">green</option>
      <option [ngValue]="'blue'">blue</option>
      <option [ngValue]="'yellow'">yellow</option>
      <option [ngValue]="'lightgray'">gray</option>
    </select>
    
    <ng-container *ngIf="showMenuBackground">
      <label>Background color</label>
      <select className="fd-select" [(ngModel)]="fpPending.background" (change)="test()">
        <option [ngValue]="'none'">none</option>
        <option [ngValue]="'red'">red</option>
        <option [ngValue]="'green'">green</option>
        <option [ngValue]="'blue'">blue</option>
        <option [ngValue]="'yellow'">yellow</option>
        <option [ngValue]="'lightgray'">gray</option>
      </select>
    </ng-container>

    <ng-container *ngIf="fpPending.type != 'FPImage'">
      <label>Rotation</label>
      <select className="fd-select" [(ngModel)]="fpPending.rotation" (change)="test()">
        <option [ngValue]="0">0</option>
        <option [ngValue]="90">90</option>
        <option [ngValue]="180">180</option>
        <option [ngValue]="270">270</option>
      </select>
    </ng-container>
  </div>
</ng-template>

<ng-template #upload> 
  <div style="margin-bottom:10px">
  <i className="fa fa-times dlg-template-close" aria-hidden="true" (click)="closeMenu()"></i>
  <h4>Select file to open</h4>
  <upload-button [label]="'Select Flow Designer File'" (fileSelected)="loadDiagram($event)" [accepted]="'.fd'"></upload-button>
  </div>
</ng-template> */}
</> 
    );
  }

}

export class FlowDesignerData
{
  scale = 1.0;
  flowPoints: FlowPoint[] = [];
  connectors: Connector[] = [];
}

// class FlowDesignerHelpDictionary implements IHelpDictionary {
//   dictionary = new Map<string, IHelpItem>();
//   constructor()
//   {
//     this.dictionary.set ("site-map message", 
//                         { 
//                           title:"Site-map instructions",
//                           text: "Drag items into the right panel to create site-map.<br>"
//                               + "Select item and drag blue dots to draw connection lines with arrows to show processing direction.<br>"
//                               + "Use graphics to show points of interest that may be outside the scope of Conveyance processing.<br>"
//                               + "To delete items select items and hit the delete key. Deleting printers or graphics deletes all "
//                               + "attached connectors." 
//                         });                        
//   }
  
//   get(key:string):IHelpItem {
//     return this.dictionary.get(key);
//   }
// }


// const InsideLoop = ({nodeSelection, path, deviceDrag}) => {
//     return (      
//       { nodeSelection.map ( d => {     
//           { d.class == 'image' &&        
//               <img src={ path(d) } style={{width:'64px', height:'32px'}} onDrag={ (ev) => deviceDrag(ev, d)} draggable />
//           }
//           { d.class == 'button' && 
//             <button className="fd-button">{d.name}</button>      
//           }
//         })
//       }    
//     )
//   }