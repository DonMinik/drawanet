import React from "react";

import {BaseCanvasComponent} from "./base-canvas.component";
import {TextDetectionService} from "../services/text-detection.service";
import {Coordinates} from "../model/petri-net.interfaces";

class TextCanvasComponent extends BaseCanvasComponent <{coordinates: Coordinates},{text: string}>{

    private position: Coordinates;
    constructor(props: {coordinates: Coordinates}) {
        super(props);
        this.state = {
            text: 'foo'
        }
        this.position = {x: props.coordinates.x, y: props.coordinates.y}
   }

    onClick(e: React.MouseEvent<HTMLButtonElement>) {
        TextDetectionService.detectText(this.canvasRef.current).then(
            text =>  {
                this.setState({text: text})
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
            <button onClick={e => this.onClick(e)}>Done</button>
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

        const canvasStyle =   this.canvasRef.current.style;
        canvasStyle.position = 'absolute';
        canvasStyle.top = String(this.position.y) + 'px';
        canvasStyle.left = String(this.position.x) + 'px';
        canvasStyle.zIndex = String(20);
    }
}

export default TextCanvasComponent;