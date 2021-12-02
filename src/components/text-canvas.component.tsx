import React from "react";

import {BaseCanvasComponent} from "./base-canvas.component";
import {TextDetectionService} from "../services/text-detection.service";
import {Coordinates, PNNode} from "../model/petri-net.interfaces";

class TextCanvasComponent extends BaseCanvasComponent <{coordinates: Coordinates, callBack: TextCanvasCallBack, node: PNNode<any>},{text: string, position: Coordinates}>{

    private readonly callBack: TextCanvasCallBack;
    private readonly node: PNNode<any>;
    private static readonly CANVAS_HEIGHT = 200;
    private static readonly CANVAS_WIDTH = 400;

    constructor(props: {coordinates: Coordinates, callBack: TextCanvasCallBack, node: PNNode<any>}){
        super(props);
        this.state = {
            text: '',
            position: props.coordinates
        }
        this.callBack = props.callBack;
        this.node = props.node;
   }

    onClick() {
        TextDetectionService.detectText(this.canvasRef.current).then(
            text => {
                this.node.text = text;
                this.setState({text: text});
                this.callBack();
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
            <div className='backdrop' onClick={() => this.onClick()}>

            </div>
        </div>);
    }

    componentDidMount() {
        super.componentDidMount();

        this.canvasCtx.canvas.width = TextCanvasComponent.CANVAS_WIDTH;
        this.canvasCtx.canvas.height = TextCanvasComponent.CANVAS_HEIGHT;
        this.canvasCtx.strokeStyle = '#FFF';
        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.fillStyle = '#FFF';
        this.setPosition()

    }

    private setPosition(){
        const x  = this.state.position.x + TextCanvasComponent.CANVAS_WIDTH > window.innerWidth ? this.state.position.x - TextCanvasComponent.CANVAS_WIDTH : this.state.position.x;
        const y  = this.state.position.y + TextCanvasComponent.CANVAS_HEIGHT > window.innerHeight ? this.state.position.y - TextCanvasComponent.CANVAS_HEIGHT : this.state.position.y;
        this.setState({position: {x: x, y: y}});

        const canvasStyle = this.canvasRef.current.style;
        canvasStyle.position = 'absolute';
        canvasStyle.top = String(this.state.position.y) + 'px';
        canvasStyle.left = String(this.state.position.x) + 'px';
        canvasStyle.zIndex = String(20);
    }
}
export type TextCanvasCallBack = () => void ;

export default TextCanvasComponent;