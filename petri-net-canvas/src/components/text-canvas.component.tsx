import React from "react";

import {BaseCanvasComponent} from "./base-canvas.component";
import {TextDetectionService} from "../services/text-detection.service";
import {Coordinates} from "../model/petri-net.interfaces";

class TextCanvasComponent extends BaseCanvasComponent <{coordinates: Coordinates, callBack: TextCanvasCallBack},{text: string, position: Coordinates}>{

    private readonly callBack: TextCanvasCallBack;

    constructor(props: {coordinates: Coordinates, callback: TextCanvasCallBack}){
        super(props);
        this.state = {
            text: 'foo',
            position: props.coordinates
        }
        this.callBack = props.callback;
   }

    onClick() {
        TextDetectionService.detectText(this.canvasRef.current).then(
            text =>  {
                this.setState({text: text});
                this.callBack(text);
            }
        )

    }

    render() {
        return(<div >
            <canvas className='text-canvas'
                ref={this.canvasRef}
                onMouseDown={(e) => this.onMouseDown(e)}
                onMouseUp={(e) => this.onMouseUp(e)}
                onMouseMove={(e) => this.onMouseMove(e)}
            />
            <div className='backdrop'/>
            <button onClick={() => this.onClick()}>Done</button>
            <span>{this.state.text}</span>
        </div>);
    }

    componentDidMount() {
        super.componentDidMount();

        this.canvasCtx.canvas.width = 400;
        this.canvasCtx.canvas.height = 200;
        this.canvasCtx.strokeStyle = '#FFF';
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.fillStyle = '#FFFFFF';
        this.setPosition(this.state.position)

    }

    private setPosition(coordinates: Coordinates){
        const canvasStyle = this.canvasRef.current.style;
        canvasStyle.position = 'absolute';
        canvasStyle.top = String(coordinates.y) + 'px';
        canvasStyle.left = String(coordinates.x) + 'px';
        canvasStyle.zIndex = String(20);
    }
}
export type TextCanvasCallBack = (string) => void ;

export default TextCanvasComponent;