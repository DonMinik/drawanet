import {BaseCanvasComponent} from "./base-canvas.component";
import React from "react";

abstract class ResizableCanvasComponent<P, S extends ResizeableCanvasState> extends BaseCanvasComponent<P, S> {

    protected constructor(props) {
        super(props);
    }

    checkParentMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!this.isWithinCanvas({x: e.clientX, y: e.clientY}) && this.state.isResize) {
            this.resizeCanvas(e.movementY);
        }
    }

    onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        if (this.isAtBottomLine(e)) {
            this.setState({isResize: true});
        } else {
            super.onMouseDown(e);
        }
    }

    private isAtBottomLine(e: React.MouseEvent<HTMLCanvasElement>) {
        return e.clientY > this.canvasPositionBottom - 20 && this.isWithinCanvas({x: e.clientX, y: e.clientY});
    }

    onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (this.state.isResize) {
            this.canvasCtx.canvas.style.cursor = 'grabbing'
            this.resizeCanvas(e.movementY);
        } else {
            this.isAtBottomLine(e) ?
                this.canvasCtx.canvas.style.cursor = 'grab' :
                this.canvasCtx.canvas.style.cursor = 'default';
            super.onMouseMove(e);
        }
    }

    private resizeCanvas(delta: number) {
        this.canvasRef.current.height += delta;
        this.canvasRef.current.style.height = String(this.canvasRef.current.height) + 'px';
        this.setBaseDrawingParameters(); // not sure why but otherwise these properties get lost
    }

    protected abstract setBaseDrawingParameters();
}

export default ResizableCanvasComponent;

export interface ResizeableCanvasState {
    isResize: boolean
}