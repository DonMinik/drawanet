import React, {Component} from "react";

class DownloadComponent extends Component {

    onClick() {

    }

    render() {
       return (
           <div className='download-component'>
               <h2 >download your drawing</h2>
               <button onClick={() => this.onClick()} type="button" className="download-button" style={{width: '100px'}}/>
           </div>
       );
    }
}

export default DownloadComponent;