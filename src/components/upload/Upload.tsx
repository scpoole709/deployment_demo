import React, { Component, createRef } from 'react';
import './Upload.css';

type UploadProps = {
   label: string,
   accepted: string,
   selectedFileName?: string,
   fileSelected: any;
}
type UploadState = {
  selectedFileName
}
export default class Upload extends Component<UploadProps, UploadState> {

  constructor(props:UploadProps){
    super(props);
    this.state = {selectedFileName: props.selectedFileName};
  }
  clickFile(event)
  {
    let ff = this.fileField.current as HTMLInputElement;
    ff.click();
  }
  fileField = createRef<HTMLInputElement>();
  render() {
    return (
      
        <div className="ub-fileinputs">
          <input ref={this.fileField} className="ub-real-file" type="file" id="myfile" name="myfile" accept={this.props.accepted} onChange={(ev) => this.props.fileSelected(ev)} />
	        <div className="ub-fake-file">
		        {/* <input type="text" className="ub-input" value={this.state.selectedFileName} onChange={(ev) => this.props.fileSelected(ev)} placeholder="Browse for file" /> */}
		        <button type="button" onClick={(ev) => this.clickFile(ev)}>{this.props.label}</button>
	        </div> 
        </div>      
    )
  }
}


// import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';

// @Component({
//   selector: 'upload-button',
//   templateUrl: './upload-button.component.html',
//   styleUrls: ['./upload-button.component.css']
// })
// export class UploadButtonComponent implements OnInit {

//   @ViewChild('filefield') filefield;
//   @Input() label = "Select a file";
//   @Input() accepted = ".pdf";
//   @Output() fileSelected = new EventEmitter<any>();
//   @Input() selectedFileName = "";

//   constructor() { }

//   ngOnInit() {
//   }

//   selected(event)
//   {
//     var file = event.target.files[0];
//     this.selectedFileName = file.name;
//     this.fileSelected.next(event);
//   }

//   clickFile(event)
//   {
//     let ff = <HTMLInputElement>this.filefield.nativeElement;
//     ff.click();
//   }
// }
