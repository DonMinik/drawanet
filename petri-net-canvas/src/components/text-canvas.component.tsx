import React from "react";

import {BaseCanvasComponent} from "./base-canvas.component";
import {TextDetectionService} from "../services/text-detection.service";

class TextCanvasComponent extends BaseCanvasComponent <{},{text: string}>{

    private initialized = false;
    constructor(props: any) {
        super(props);
        this.state = {
            text: 'foo'
        }
   }
    protected get canvasCtx() {
        const _ctx = this.canvasRef?.current?.getContext('2d');
        if (!this.initialized) {
            if(_ctx) {
                _ctx.canvas.width = 400;
                _ctx.canvas.height = 200;
                _ctx.strokeStyle = '#FFF';
                _ctx.lineWidth = 1;
                _ctx.fillStyle = '#FFFFFF';
            }
            this.initialized = true;
        }
        return _ctx;
    }

    onClick(e: React.MouseEvent<HTMLButtonElement>) {
        TextDetectionService.detectText(this.canvasRef.current).then(
            text =>  {
                debugger
                this.setState({text: text})
            }
        )
    }
    render() {
        return(<div>
            <canvas className='text-canvas'
                ref={this.canvasRef}

                      onMouseDown={(e) => this.onMouseDown(e)}
                    onMouseUp={(e) => this.onMouseUp(e)}
                  onMouseMove={(e) => this.onMouseMove(e)}

            />
            <button onClick={e => this.onClick(e)}>Done</button>
            <span>{this.state.text}</span>
        </div>);
    }


}

export default TextCanvasComponent;