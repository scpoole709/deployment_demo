import React, { useEffect, useRef } from 'react'
import './FlowDesigner.css';

const Caption = ({dispatch, originalCaption, originalClr, originalBG}) => {
  const inputRef = useRef(null);
  const bgRef = useRef(null);
  const txtRef = useRef(null);

  // first time in, set input to original value
   useEffect(() => {
    inputRef.current.value = originalCaption;
    bgRef.current.value = originalBG;
    txtRef.current.value = originalClr;
   });

  return (
    <div className="fd-caption">
      <label>Name</label>
      <input
        ref={inputRef}
        type="text"
        onChange={(ev) => dispatch(ev.target.value, "caption-changed")}
        placeholder="Your comment here"
      />

      <label>Text color</label>
      <select ref={txtRef} onChange={(ev) => dispatch(ev.target.value, "color-changed")}>
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
        <option value="lightgray">gray</option>
        <option value="white">white</option>
      </select>

      <label>Background color</label>
      <select ref={bgRef} onChange={(ev) => dispatch(ev.target.value, "background-changed")}>
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
        <option value="lightgray">gray</option>
      </select>

    {/*

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
</ng-template> */}
    </div>
  );
}

export default Caption
