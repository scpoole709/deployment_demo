// import { Connector, FlowPoint } from "./FlowObjects";

// export function getDotAtPoint(fd, x, y,  ctx)
//   {
//     x /= fd.scale;
//     y /= fd.scale;

//     let ret:any[] = [];
//     fd.flowPoints.forEach( each => {
//       if (each.selected > 0)
//         ret.push(each);
//     });

//     if (ret.length > 0)
//     {
//       for (var i = 0; i < ret.length; i++)
//       {
//         let fp = ret[i];
//         for (var j = 0; j < 4; j++)
//         {
//           if (Connector.contains(x, y, fp, j, ctx))
//           {
//             let connector = new Connector();
//             connector.fp1 = fp;
//             connector.index1 = j;
//             return connector;
//           }
//         }
//       }
//     }
//   }
  
//   export function redraw(ctx:CanvasRenderingContext2D, 
//                          connectors,
//                          flowPoints,
//                          userRenderer,
//                          state)
//   {
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     ctx.font = FlowPoint.graphicFont;
//     ctx.fillStyle = this.background;
//     ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);  

//     flowPoints.forEach( each => {
      
//       ctx.save();
//       ctx.resetTransform();
//       ctx.scale(this.scale, this.scale);

//       if (each.rotation != 0)
//       {
//         let tmpX = each.x + each.w / 2;
//         let tmpY = each.y + each.h / 2;
//         ctx.translate(tmpX, tmpY);
//         ctx.rotate(each.rotation * Math.PI / 180);
//         ctx.translate(-tmpX, -tmpY);
//       }  
      
//       if (each.type == "FPUser")
//         userRenderer.render(ctx, each);
    
//       each.render(ctx);  

//       ctx.resetTransform();
//       ctx.scale(this.scale, this.scale);

//       if (state == "connecting" || each.selected > 0)
//         each.drawSelectionConnector(ctx);
         
//       ctx.restore();    
//     })  

//     ctx.resetTransform();
//     ctx.scale(this.scale, this.scale);

//     connectors.forEach(each => {
//       each.render(ctx, this.readonly);
//     })
//   }
  
//   export function getArrowAtPt(ev, connectors)
//   {
//     for (var i = 0; i < connectors.length; i++)
//     {
//       if (connectors[i].arrowContains(this.pt(ev)))
//         return connectors[i];
//     }
//     return undefined;
//   }

//   export function getOriginAtPoint(ev:MouseEvent, ctx)
//   {
//     let p = this.pt(ev);
//     for (var i = 0; i < this.connectors.length; i++)
//     {
//       let connector = this.connectors[i];
//       let cc = connector.fp1.connectorCenter(ctx, connector.index1);
      
//       let a1 = Math.abs(p.y - cc.y);
//       let b1 = Math.abs(p.x - cc.x);
      
//       if (Math.sqrt(a1*a1 + b1*b1) < 12)
//         return connector;
//     }
//     return undefined;
//   }

  
  