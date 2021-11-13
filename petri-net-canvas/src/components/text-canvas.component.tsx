import React from "react";
import Tesseract from 'tesseract.js';

import {BaseCanvasComponent} from "./base-canvas.component";
/**
 * TODO:
 * -  needs offset
 * - use service
 */
class TextCanvasComponent extends BaseCanvasComponent <{},{text: string}>{

    private initialized = false;
    constructor(props: any) {
        super(props);
        this.state = {
            text: 'foo'
        }
   }
    get canvasCtx() {
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
        this.recognizeWriting();
    }


    private recognizeWriting(){
        const canvas: HTMLCanvasElement = this.canvasRef?.current;
        const ctx = canvas.getContext('2d');
        const src =  ctx.getImageData(0, 0, canvas.width, canvas.height);

        Tesseract.recognize(
            src,'eng',
            {
                logger: m => console.log(m)
            }
        )
            .catch (err => {
                console.error(err);
            })
            .then(result => {
                // Get Confidence score
                let confidence = result.confidence
                // Get full output
                let text = result.text
                debugger
                this.setState({text: text});
                // setPin(patterns);
            })
        /*
               // @ts-ignore
                this.textDetectionService.detectText(canvas).then(text =>
                       this.text = text ? text: '')
        */
    }
/*
    drawImage(url) {
        const canvas: HTMLCanvasElement = this.canvasRef?.current;
        let ctx = canvas.getContext('2d')
        let image = new Image()
        image.src = url
        image.crossOrigin = "Anonymous";
        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)

            let src = ctx.getImageData(0, 0, canvas.width, canvas.height)

            Tesseract.recognize(src).progress((p) => {
                console.log( p.progress);
            }).then((r) => {
                this.setState({text: text});
            })
        }
    } */

    render() {
        return(<div>
            <canvas className='text-canvas'
                ref={this.canvasRef}
                //onClick={e => this.onClick(e)}
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