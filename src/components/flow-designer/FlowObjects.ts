export class FlowPoint
{
  static graphicFont = "10pt Arial";
  static mediumFont = "9pt Arial";
  static smallFont = "8pt Arial";
  static tinyFont = "4pt Arial";

  constructor(data?)
  {
    if (data)
    {
      this.id = data.id;
      this.type = data.type;
      this.text = data.text;
      this.asset = data.asset;
      this.x = data.x;
      this.y = data.y;
      this.w = data.w;
      this.h = data.h;
      this.rotation = data.rotation ? data.rotation : 0;
    }
    else
    {
      this.id = Date.now();
    }
  }
  id:number;
  type:string;
  selected:number;
  text:string = "";
  color:string = "black";
  background:string = "red";
  asset:string;
  x:number;
  y:number;
  w:number;
  h:number;
  rotation:number = 0;
  userData: any = undefined;

  render(ctx){}
  connectors;
  active:boolean = false;

  drawSelectionConnector(ctx)
  {
    let r = this.selectedRect(ctx);
    this.drawConnector(ctx, 0, r);
    this.drawConnector(ctx, 1, r);
    this.drawConnector(ctx, 2, r);
    this.drawConnector(ctx, 3, r);
  }

  drawConnector(ctx, index:number, rect?)
  {
    let r = Connector.rad;
    if (rect === undefined)
      rect = this.selectedRect(ctx);

    let c = this.connectorCenter(ctx, index, rect);

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, r, r, 0, 0, 2 * Math.PI);
    ctx.fill();
  }

  connectorCenter( ctx, index:number, rect?)
  {
    let r = Connector.rad;
    if (rect === undefined) 
      rect = this.selectedRect(ctx);

    switch(this.rotation)
    {
      case 0:
      case 180:
      default:
        switch(index)
        {
          case 0: return {x:rect.x - r, y: rect.y + rect.h/2};
          case 1: return {x:rect.x + rect.w/2, y:rect.y - r};
          case 2: return {x:rect.x + rect.w + r, y:rect.y + rect.h/2};
          case 3: return {x:rect.x + rect.w/2, y:rect.y + rect.h + r};
          default: return {x:0, y:0};
        }
      case 90:
      case 270:
        switch(index)
        {
          case 0: return {x:rect.x + (rect.w / 2) - (rect.h / 2) - r, y: rect.y + rect.h/2};
          case 1: return {x:rect.x + rect.w/2, y:rect.y + (rect.h / 2) - (rect.w / 2) - r};
          case 2: return {x:rect.x + (rect.w / 2) + (rect.h / 2) + r, y:rect.y + rect.h/2};
          case 3: return {x:rect.x + rect.w/2, y:rect.y + (rect.h / 2) + (rect.w / 2) + r};
          default: return {x:0, y:0};
        }
    }
  }

  connectorRect( ctx, index:number)
  {
    let r = 2 * Connector.rad;
    let c = this.connectorCenter(ctx, index);
    return {x:(c.x - r), y: c.y - r, w:2*r, h:2*r};
  }

  textRect(ctx:CanvasRenderingContext2D)
  {
    let rect = {x:this.x, y:this.y + this.h, w:this.w, h:this.h};
    if (this.text)
    {
      let fm = ctx.measureText(this.text);      
      let dx = this.w - fm.width;
      let dy = this.h + fm.actualBoundingBoxAscent;
      rect.x = this.x + dx/2;
      rect.y = this.y + dy/2;
      rect.w = fm.width;
      rect.h = fm.actualBoundingBoxAscent + fm.actualBoundingBoxDescent;
    }
    return rect;
  }

  drawText(ctx:CanvasRenderingContext2D)
  {
    if (this.text)
    {
      ctx.font = FlowPoint.mediumFont;
      let r = this.textRect(ctx);
      ctx.fillStyle = this.color;      
      ctx.fillText(this.text, r.x, r.y);
    }
  }

  drawSubtitleText(ctx:CanvasRenderingContext2D, sub:string)
  {
    ctx.font = FlowPoint.mediumFont;
    let r = this.textRect(ctx);
    let mt = ctx.measureText(sub);
    r.y += mt.actualBoundingBoxAscent * 2;
    ctx.fillStyle = this.color;      
    ctx.fillText(sub, r.x, r.y);
  }

  selectedRect(ctx)
  {
    let r = {x:this.x, y:this.y, w:this.w, h:this.h};
    if (this.text && this.type === "FPUser")
    {
      ctx.font = FlowPoint.graphicFont;
      let fm = ctx.measureText(this.text);         
      let dx = this.w - fm.width;

      r.x = Math.min(this.x + dx/2 - 2, this.x - 2);
      r.w = Math.max(fm.width + 4, this.w + 4);
      r.y -= 2;
      r.h += 4;            
    }
    else if (this.text && this.type === "FPImage")
    {
      ctx.font = FlowPoint.graphicFont;
      let fm = ctx.measureText(this.text);         
      let dx = this.w - fm.width;

      r.x = Math.min(this.x + dx/2 - 2, this.x - 2);
      r.w = Math.max(fm.width + 4, this.w + 4);
      r.y -= 2;
      r.h += fm.actualBoundingBoxAscent + fm.actualBoundingBoxDescent + 5;            
    }
    else
    {
      r.x -= 2;
      r.y -= 2;
      r.w += 4;
      r.h += 4;
    }
    return r;
  }

  drawSelected(ctx:CanvasRenderingContext2D)
  {
    if (this.selected > 0)
    {
      let r = this.selectedRect(ctx);
      ctx.setLineDash([8,3]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.setLineDash([]);

      //this.drawSelectionConnector(ctx, r);
    }
  }

  contains(x, y, ctx?)
  {
    switch (this.rotation)
    {
      case 0:
      case 180:
      default:
        return ((x >= this.x) && (y >= this.y) && (x <= this.x + this.w) && (y <= this.y + this.h));
      case 90:
      case 270:      
        return (x >= (this.x + (this.w / 2) - (this.h / 2)) 
             && y >= (this.y + (this.h / 2) - (this.w / 2))
             && x <= (this.x + (this.w / 2) + (this.h / 2))
             && y <= (this.y + (this.h / 2) + (this.w / 2)));
    }
  }

  borderRadius = 15;
  drawFrame(ctx:CanvasRenderingContext2D, x, y, w, h)
  {
    let r = this.borderRadius;
    
    ctx.strokeStyle = "black";
    if (this.selected > 0)
    {
      ctx.setLineDash([8,3]);
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.bezierCurveTo(x + w, y, x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.bezierCurveTo (x + w, y + h, x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.bezierCurveTo(x, y + h, x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.bezierCurveTo(x, y, x, y, x + r, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawTitlebar(ctx:CanvasRenderingContext2D, x, y, w, h)
  {
    let r = this.borderRadius;
    
    ctx.fillStyle = "lightskyblue";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.bezierCurveTo(x + w, y, x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y + r);
    ctx.bezierCurveTo(x, y, x, y, x + r, y);
    ctx.fill();
  }
}

export class FPRectangle extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPRectangle";
    }
  }

  render(ctx)
  {
    if (this.background !== "none")
    {
      ctx.fillStyle = this.background;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    else
    {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }
}

export class FPDiamond extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPDiamond";
    }
    else
    {
      this.color = data.color;
      this.background = data.background;
    }
  }

  render(ctx)
  {
    var Xcenter = this.x + this.w / 2,
    Ycenter = this.y + this.h / 2;

    ctx.strokeStyle = this.background === "none" ? "black" : this.background;
    ctx.fillStyle = this.background;

    ctx.beginPath();
    ctx.moveTo (Xcenter, this.y);          
    ctx.lineTo (this.x + this.w, Ycenter);
    ctx.lineTo (Xcenter, this.y + this.h);
    ctx.lineTo (this.x, Ycenter);
    ctx.lineTo (Xcenter, this.y);    

    ctx.stroke();

    if (this.background !== "none")
    {
      ctx.fillStyle = this.background;
      ctx.fill();
    }
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }
}

export class FPPolygon extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPRectangle";
    }  
    else
    {
      this.color = data.color;
      this.background = data.background;
    }
  }

  render(ctx)
  {
    // hexagon
    var numberOfSides = 4,
    sizeY = Math.min(this.x,this.y),
    sizeX = Math.min(this.x,this.y),
    Xcenter = this.x + this.w / 2,
    Ycenter = this.y + this.h / 2;

    sizeY /= 2;
    sizeX /= 2;
    ctx.beginPath();
    ctx.moveTo (Xcenter +  sizeX * Math.cos(0), Ycenter +  sizeY *  Math.sin(0));          

    for (var i = 1; i <= numberOfSides;i += 1) {
      ctx.lineTo (Xcenter + sizeX * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + sizeY * Math.sin(i * 2 * Math.PI / numberOfSides));
    }

    ctx.stroke();
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }
}

export class FPOval extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPOval";
    }
    else
    {
      this.color = data.color;
      this.background = data.background;
    }
  }

  render(ctx)
  {
    ctx.strokeStyle = this.background === "none" ? "black" : this.background;
    ctx.fillStyle = this.background;
    
    ctx.beginPath();
    ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
    ctx.stroke();
    if (this.background !== "none")
    {     
      ctx.fill();
    }
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }
}

export class FPLocation extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPLocation";
    }
    else
    {
      this.color = data.color;
      this.background = data.background;
    }
  }

  render(ctx)
  {
    var img;
    let imgW = 80;
    let imgH = 24;

    switch(this.asset)
    {
      case "HandHeldScanner":
        img = FPBarcode.imgHandHeldScanner;
        break;
      case "Laminator":
        img = FPBarcode.imgLaminator;
        break;   
      case "Finisher":
        img = FPBarcode.imgFinisher;
        break;
        case "Code39":
        img = FPBarcode.imgCode39;
        break;
      case "Code128":
        img = FPBarcode.imgCode128;
        break;
      case "EAN_13":
        img = FPBarcode.imgEAN13;
        break;
      case "DataMatrix":
        img = FPBarcode.imgDataMatrix;
        imgW = imgH;
        break;
      case "UPC_A":
        img = FPBarcode.imgUPCA;
        break;
      default:
        img = FPBarcode.imgDefault;
        break;
    }

    let imageY = 2;
    if (this.text)
    {      
      ctx.font = FlowPoint.graphicFont;
      let fm = ctx.measureText(this.text);      
      let dx = this.w - fm.width;
      let dy = fm.actualBoundingBoxAscent + fm.actualBoundingBoxDescent + 2;
      imageY = dy + 2;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x + dx/2, this.y + dy);
    }

    this.drawFrame(ctx, this.x, this.y, this.w, this.h);

    let xOffset = (this.w - imgW) / 2;
   
    ctx.drawImage(img, this.x + xOffset + 1, this.y + imageY, imgW, imgH);    
  }

  renderRect(ctx)
  {
    if (this.background !== "none")
    {
      ctx.fillStyle = this.background;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    else
    {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }

  renderold(ctx)
  {
    // ctx.beginPath();
    // ctx.lineJoin = 'miter';
    // ctx.moveTo(120, 20);
    // ctx.quadraticCurveTo(117.5, 30, 148, 68);
    // ctx.arc(120, 88, 34.5, 5.75, 3.66, false);
    // ctx.quadraticCurveTo(117.5, 35, 120, 20);
    // ctx.closePath();
    // ctx.strokeStyle = '#000';
    // ctx.lineWidth = 2;
    // ctx.fillStyle = '#77CCEE';

    let x = this.x; //120;
    let y = this.y; // 20;

    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y + 10, x + 28, y + 48);
    ctx.arc(x, y + 68, 34.5, 5.75, 3.66, false);
    ctx.quadraticCurveTo(x, y + 10, x, y);
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#77CCEE';
    ctx.stroke();
    if (this.background !== "none")
    {     
      //ctx.fill();
    }
    // ctx.strokeStyle = this.background === "none" ? "black" : this.background;
    // ctx.fillStyle = this.background;
    
    // ctx.beginPath();
    // ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
    // ctx.stroke();
    
    
    this.drawSelected(ctx);
    this.drawText(ctx);
  }
}

export class FPImage extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPImage";
    }
    
    this.background = "none";
  }

  render(ctx)
  {
    let img = document.createElement("IMG") as HTMLImageElement;
    img.src = this.asset;
    
    if (this.background !== "none")
    {
      ctx.fillStyle = this.background;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
   
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
    
    this.drawSelected(ctx);

    if (this.text)
    {      
      ctx.font = FlowPoint.graphicFont;
      let fm = ctx.measureText(this.text);      
      let dx = this.w - fm.width;
      let dy = this.h + fm.actualBoundingBoxAscent + 3;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x + dx/2, this.y + dy);
    }
  }
}

export class FPLogo extends FPImage
{
  
}

export class FPUser extends FlowPoint
{
  constructor(data?)
  {
    super(data);
    if (data === undefined)
    {
      this.type = "FPUser";
      this.background = "none";
    }
    else
    {
      this.background = data.background;
      this.color = data.color;
    }
  }

  switchRect = {x:0, y:0, w:0, h:0};
  mediaRect = {x:0, y:0, w:0, h:0};

  textRect(ctx:CanvasRenderingContext2D)
  {
    let rect = {x:this.x, y:this.y + this.h, w:this.w, h:this.h};
    if (this.text)
    {
      let fm = ctx.measureText(this.text);      
      let dx = this.w - fm.width;
      let dy = this.h + fm.actualBoundingBoxAscent;
      rect.x = this.x + dx/2;
      rect.y = this.y + dy/2;
      rect.w = fm.width;
      rect.h = fm.actualBoundingBoxAscent + fm.actualBoundingBoxDescent;
    }
    return rect;
  }

  render(ctx)
  {
    //this.drawSelected(ctx);
/*
    if (this.text)
    {
      let fm = ctx.measureText(this.text);      
      let dx = this.w - fm.width;
      let dy = 32 + fm.actualBoundingBoxAscent;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x + dx/2, this.y + this.h - 3);
    } */
  }

  onSwitch(x, y)
  {
    return ((x >= this.switchRect.x - 4) 
         && (y >= this.switchRect.y - 4) 
         && (x <= this.switchRect.x + this.switchRect.w + 8) 
         && (y <= this.switchRect.y + this.switchRect.h + 8));      
  }

  onMedia(x, y)
  {
    return ((x >= this.mediaRect.x - 4) 
         && (y >= this.mediaRect.y - 4) 
         && (x <= this.mediaRect.x + this.mediaRect.w + 8) 
         && (y <= this.mediaRect.y + this.mediaRect.h + 8));      
  }
}

export class Connector
{
  static rad = 4;
  fp1:FlowPoint | undefined;
  index1:number;
  fp2:FlowPoint | undefined;
  index2:number;
  selected:number;
  color:string;

  arrowPts:{x1:number, y1:number, x2:number, y2:number, x3:number, y3:number};
  
  bx;
  by;  

  connectorIndex = -1;
  cycle = 0;
  render(ctx, readonly:boolean, testStraight?:boolean)
  {
    if (this.fp1 === undefined || this.fp2 === undefined)
      return;

    // draw the line
    let c1 = this.fp1.connectorCenter(ctx, this.index1);
    let c2 = this.fp2.connectorCenter(ctx, this.index2);
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = this.selected > 0 ? "red" : "black";
    ctx.lineWidth = this.selected > 0 ? 5 : 1;

    if (this.bx && this.by)
    {
      ctx.moveTo(c1.x, c1.y);
      ctx.bezierCurveTo(this.bx, this.by, this.bx, this.by, c2.x, c2.y);
      ctx.stroke();

      /*
      let p1x = c1.x;
      let p1y = c1.y;
      let bx = this.bx;
      let by = this.by;
      let p2x = c2.x;
      let p2y = c2.y;

      for (var t = 5; t < 1; t += 0.05)
      {
        // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
        let testX = (Math.pow((1-t),3) * p1x) + (3 * Math.pow(1-t, 2) * t * bx) + (3 * (1-t) * t *t * bx) + Math.pow(t,3) * p2x;
        let testY = (Math.pow((1-t),3) * p1y) + (3 * Math.pow(1-t, 2) * t * by) + (3 * (1-t) * t *t * by) + Math.pow(t,3) * p2y;
  
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.ellipse(testX, testY, 3, 3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }*/
    }
    else
    {
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }   
    
    // draw the circles at the ends of the line
    this.fp1.drawConnector(ctx, this.index1);
    this.fp2.drawConnector(ctx, this.index2);

    ctx.strokeStyle = "black";
    ctx.lineJoin = ctx.lineCap = "round";
    ctx.lineWidth = 1;

    // draw the arrows
    if (!readonly || (!this.fp1.active && !this.fp2.active))
    {
      var x1, y1, x2, y2;

      if (this.bx === undefined)
      {
        x1 = c1.x;
        y1 = c1.y;
        x2 = c2.x;
        y2 = c2.y;
      }
      else
      {
        let t = 0.95;
        x1 = (Math.pow((1-t),3) * c1.x) + (3 * Math.pow(1-t, 2) * t * this.bx) + (3 * (1-t) * t *t * this.bx) + Math.pow(t,3) * c2.x;
        y1 = (Math.pow((1-t),3) * c1.y) + (3 * Math.pow(1-t, 2) * t * this.by) + (3 * (1-t) * t *t * this.by) + Math.pow(t,3) * c2.y;
        t = 0.99;
        x2 = (Math.pow((1-t),3) * c1.x) + (3 * Math.pow(1-t, 2) * t * this.bx) + (3 * (1-t) * t *t * this.bx) + Math.pow(t,3) * c2.x;
        y2 = (Math.pow((1-t),3) * c1.y) + (3 * Math.pow(1-t, 2) * t * this.by) + (3 * (1-t) * t *t * this.by) + Math.pow(t,3) * c2.y;
      }
  
      let angInRadians = Math.atan2(y2 - y1, x2 - x1);
  
      let cos = Math.cos(angInRadians);
      let sin = Math.sin(angInRadians);
      this.drawArrow(x1, y1, x2, y2, sin, cos, 25, ctx);
    }
    else
    {
      let factor = 10;
      this.connectorIndex++;
      let indexFactor = this.connectorIndex % factor;

      if (this.bx === undefined)
      {
        x1 = c1.x;
        y1 = c1.y;
        x2 = c2.x;
        y2 = c2.y;
      }
      else
      {
        let t = 0.05 + (indexFactor * 0.1);
        x1 = (Math.pow((1-t),3) * c1.x) + (3 * Math.pow(1-t, 2) * t * this.bx) + (3 * (1-t) * t *t * this.bx) + Math.pow(t,3) * c2.x;
        y1 = (Math.pow((1-t),3) * c1.y) + (3 * Math.pow(1-t, 2) * t * this.by) + (3 * (1-t) * t *t * this.by) + Math.pow(t,3) * c2.y;
        t += 0.04;
        x2 = (Math.pow((1-t),3) * c1.x) + (3 * Math.pow(1-t, 2) * t * this.bx) + (3 * (1-t) * t *t * this.bx) + Math.pow(t,3) * c2.x;
        y2 = (Math.pow((1-t),3) * c1.y) + (3 * Math.pow(1-t, 2) * t * this.by) + (3 * (1-t) * t *t * this.by) + Math.pow(t,3) * c2.y;
      }

      let angInRadians = Math.atan2(y2 - y1, x2 - x1);

      let cos = Math.cos(angInRadians);
      let sin = Math.sin(angInRadians);
 

      let hypTotal = Math.floor(Math.hypot(Math.abs(x2 - x1), Math.abs(y2 - y1)));

      let indexList: number[] = [];      
      let cycleFactor = this.cycle % factor;       

      let display = (indexFactor + cycleFactor) % 8;
      indexList.push(display);
      
      if (display === (factor - 1))
      {
        indexList.push(0);   
        this.cycle++;
      }
        
      for (var d = 0; d < indexList.length; d++)
      {            
        let i = indexList[d];    
          
        let hyp = hypTotal - (i * ((hypTotal-15) / factor));

        this.drawArrow(x1, y1, x2, y2, sin, cos, hyp, ctx);
      }
    }
  }

  drawArrow(x1, y1, x2, y2, sin, cos, hyp, ctx)
  {
    let y3 = y2 - (hyp - 15) * sin;
    let x3 = x2 - (hyp - 15) * cos;

    let dy = hyp * sin;
    let dx = hyp * cos;

    y2 -= dy;
    x2 -= dx;
      
    var px = y1 - y2; // as vector at 90 deg to the line
    var py = x2 - x1;
    const len = 7 / Math.hypot(px, py);
    px *= len;  // make leng 10 pixels
    py *= len; 

    this.arrowPts = {x1:x2+px, y1:y2+py, x2:x2-px, y2:y2-py, x3:x3, y3:y3};

    // draw line the start cap and end cap.
    ctx.beginPath();

    ctx.moveTo(x2 + px, y2 + py); // the end perp line
    ctx.lineTo(x2 - px, y2 - py);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x2 + px, y2 + py);
    ctx.fill();
    ctx.stroke();
  }

  arrowContains(pt)
  {
    let pts = this.arrowPts;
    let lowX = Math.min(pts.x1, Math.min(pts.x2, pts.x3));
    let highX = Math.max(pts.x1, Math.max(pts.x2, pts.x3));
    let lowY = Math.min(pts.y1, Math.min(pts.y2, pts.y3));
    let highY = Math.max(pts.y1, Math.max(pts.y2, pts.y3));
    return pt.x >= lowX && pt.x <= highX && pt.y >= lowY && pt.y <= highY;
  }

  static contains(x:number, y:number, fp:FlowPoint, index:number, ctx):boolean
  {
    let r = fp.connectorRect(ctx, index);
    return ((x >= r.x) && (y >= r.y) && (x <= r.x + r.w) && (y <= r.y + r.h)); 
  }

  intersects(a,b,c,d,p,q,r,s) 
  {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } 
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;

    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }

  intersectsRect(x, y, ctx, scale)
  {
    if (this.fp1 === undefined || this.fp2 === undefined)
      return;

    let c1 = this.fp1.connectorCenter(ctx, this.index1);
    let c2 = this.fp2.connectorCenter(ctx, this.index2);

    let x1 = c1.x; // / scale;
    let y1 = c1.y; // / scale;
    let x2 = c2.x; // / scale;
    let y2 = c2.y; // / scale;

    if (this.bx === undefined)
    {      
      let ex1 = x - 3;
      let ex2 = x + 3;
      let ey1 = y -3;
      let ey2 = y + 3;

      if (this.intersects(x1, y1, x2, y2, ex1, ey1, ex2, ey2))
        return true;
      if (this.intersects(x1, y1, x2, y2, ex1, ey2, ex2, ey1))
        return true;
    
      return false;
    }
    else
    {
      return this.testBezierPt(x, y, x1, y1, this.bx, this.by, x2, y2);
    }
  }

  testBezierPt(x, y, p1x, p1y, bx, by, p2x, p2y):boolean
  {
    let foundX;
    let foundY;
    var lastXT;
    var lastYT;
    for (var t = 0.0; t <= 1.0; t += 0.05)
    {
      // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
      let oneMinusT = 1 - t;
      let testX = (Math.pow(oneMinusT,3) * p1x) + (3 * Math.pow(oneMinusT, 2) * t * bx) + (3 * oneMinusT * t *t * bx) + Math.pow(t,3) * p2x;
      let testY = (Math.pow(oneMinusT,3) * p1y) + (3 * Math.pow(oneMinusT, 2) * t * by) + (3 * oneMinusT * t *t * by) + Math.pow(t,3) * p2y;

      if (lastXT)
      {      
        let lowX = Math.min(lastXT, testX);
        let highX = Math.max(lastXT, testX);
        let lowY = Math.min(lastYT, testY);
        let highY = Math.max(lastYT, testY);
        if (x >= lowX && x <= highX) 
        {
          foundX = t;
        }
        if (y >= lowY && y <= highY) 
        {
          foundY = t;
        }
        if (foundX && foundY && Math.abs(foundX - foundY) < 0.1)
        {
          return true;
        }
      }
      lastXT = testX;
      lastYT = testY;
    }

    return false;
  }

  testNoBezier(ctx):boolean
  {
    if (!this.fp1 || !this.fp2) return false;
    let c1 = this.fp1.connectorCenter(ctx, this.index1);
    let c2 = this.fp2.connectorCenter(ctx, this.index2);
    let p1x = c1.x;
    let p1y = c1.y;
    let bx = this.bx;
    let by = this.by;
    let p2x = c2.x;
    let p2y = c2.y;

    let tarray:number[] = [];
    for (var t = 0.1, i = 0; t <= 1.0; t += 0.2, i++)
    {
      // P = (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
      let oneMinusT = 1 - t;
      let testX = (Math.pow(oneMinusT,3) * p1x) + (3 * Math.pow(oneMinusT, 2) * t * bx) + (3 * oneMinusT * t *t * bx) + Math.pow(t,3) * p2x;
      let testY = (Math.pow(oneMinusT,3) * p1y) + (3 * Math.pow(oneMinusT, 2) * t * by) + (3 * oneMinusT * t *t * by) + Math.pow(t,3) * p2y;

      let adj = testX - p1x;

      tarray.push( adj === 0 ? 0 : (testY - p1y) / adj);
    }

    let s = 0;
    for (i = 0; i < tarray.length; i++)
    {
      if (i > 0)
      {
        s += Math.abs(tarray[i-1] - tarray[i]);
      }
    }
    console.log("s: " + s);
    return s < 0.01;  
  }
}

export interface FPRenderer
{
  render(ctx:CanvasRenderingContext2D, fp:FlowPoint);
}

export class FPBarcode
{
  static imgCode39;
  static imgCode128;
  static imgEAN13;
  static imgDataMatrix;
  static imgUPCA;
  static imgDefault;
  static imgHandHeldScanner;
  static imgLaminator;
  static imgFinisher;

  static loadImages()
  {
    this.imgHandHeldScanner = document.createElement("IMG");
    this.imgHandHeldScanner.src = "./assets/images/HandHeldScanner.gif";
    this.imgLaminator = document.createElement("IMG");
    this.imgLaminator.src = "./assets/images/Laminator.gif";
    this.imgFinisher = document.createElement("IMG");
    this.imgFinisher.src = "./assets/images/Finisher.gif";
    this.imgCode39 = document.createElement("IMG");
    this.imgCode39.src = "./assets/barcode/Code39.gif";
    this.imgCode128 = document.createElement("IMG");
    this.imgCode128.src = "./assets/barcode/Code128.gif";
    this.imgEAN13 = document.createElement("IMG");
    this.imgEAN13.src = "./assets/barcode/EAN_13.gif";
    this.imgDataMatrix = document.createElement("IMG");
    this.imgDataMatrix.src = "./assets/barcode/DataMatrix.gif";
    this.imgUPCA = document.createElement("IMG");
    this.imgUPCA.src = "./assets/barcode/UPC_A.gif";
    this.imgDefault = document.createElement("IMG");
    this.imgDefault.src = "./assets/images/scanner.gif";
  }
}

export class NodeSelection {
  name:string;
  path:string;
  selected:boolean;
  class:string;
}
