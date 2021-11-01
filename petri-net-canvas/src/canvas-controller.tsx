import {Component} from "react";

class CanvasController extends Component<any, any>{

    constructor(props) {
        super(props)
    }

     mouseUp() {
         alert('mouse UP');
     }

     onMouseDown() {
         alert('mouse down');
     }

     render() {
        return (<canvas></canvas>);
     }
 }
 export default CanvasController;

