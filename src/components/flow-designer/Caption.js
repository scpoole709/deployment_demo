import React, { useEffect, useRef, useState } from 'react'
import './FlowDesigner.css';

const Caption = ({dispatch, originalCaption, originalClr, originalBG}) => {
  const inputRef = useRef(null);
  const bgRef = useRef(null);
  const txtRef = useRef(null);

  // first time in, set input to original value
   useEffect(() => {
    inputRef.current.value = originalCaption;

   }, []);

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
      <select onChange={(ev) => dispatch(ev.target.value, "text-changed")}>
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
        <option value="lightgray">gray</option>
      </select>

      <label>Background color</label>
      <select onChange={(ev) => dispatch(ev.target.value, "background-changed")}>
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
