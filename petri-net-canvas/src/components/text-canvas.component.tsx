import React from "react";

import {BaseCanvasComponent} from "./base-canvas.component";
import {TextDetectionService} from "../services/text-detection.service";
import {Coordinates, PNNode} from "../model/petri-net.interfaces";

class TextCanvasComponent extends BaseCanvasComponent <{coordinates: Coordinates, callBack: TextCanvasCallBack, node: PNNode<any>},{text: string, position: Coordinates}>{

    private readonly callBack: TextCanvasCallBack;
    private readonly node: PNNode<any>;

    constructor(props: {coordinates: Coordinates, callBack: TextCanvasCallBack, node: PNNode<any>}){
        super(props);
        this.state = {
            text: 'foo',
            position: props.coordinates
        }
        this.callBack = props.callBack;
        this.node = props.node;
   }

    onClick() {
        TextDetectionService.detectText(this.canvasRef.current).then(
            text =>  {
                this.setState({text: text});
                this.callBack(text, this.node);
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
            <div className='backdrop'>
                <button onClick={() => this.onClick()}>Done</button>
                <span>{this.state.text}</span>
            </div>
        </div>);
    }

    componentDidMount() {
        super.componentDidMount();

        this.canvasCtx.canvas.width = 400;
        this.canvasCtx.canvas.height = 200;
        this.canvasCtx.strokeStyle = '#FFF';
        this.canvasCtx.lineWidth = 3;
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
export type TextCanvasCallBack = (string, PNNode) => void ;

export default TextCanvasComponent;