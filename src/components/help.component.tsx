import React, {Component} from "react";

class HelpComponent extends Component<{ callBack: HelpCallback }, any> {

    private readonly callBack: HelpCallback;

    constructor(props: { callBack: HelpCallback }) {
        super(props);
        this.callBack = props.callBack;
    }

    onClick() {
        this.callBack();
    }

    render() {
        return (
            <div>
                <div className='help'>
                        <p>Hold down left mouse button to draw places, transitions, arcs, and tokens.</p>
                        <p>Tokens can be added by clicking within a place</p>
                        <p>Start arc within a place or transition and end the line within another.</p>
                        <p>Use double click to name a place or transition and write the name into the black field. The close by clicking outside the field.</p>
                        <p>To draw arc weights draw the same arc twice or multiple times.</p>
                        <p>If you need to delete any element just cross out the element you wish to delete.(Tokens can be removed with a single click.) </p>
                </div>
                <div className='backdrop' onClick={() => this.onClick()}/>
            </div>
        );
    }
}

export type HelpCallback = () => void;
export default HelpComponent;