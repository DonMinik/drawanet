import React, {Component} from "react";

class HelpComponent extends Component<{ callBack: HelpCallback}, any> {

    private readonly callBack: HelpCallback;

    constructor(props: { callBack: HelpCallback}) {
        super(props);
        this.callBack = props.callBack;
    }

    onClick() {
        this.callBack();
    }

    render() {
        return(
            <div >
                <div className='help'>
                    Hold down left mouse button to draw places, transitions, arcs, and tokens. <br/>
                    Use double click to name a place or transition.
                </div>
                <div className='backdrop' onClick={() => this.onClick()}>

                </div>
            </div>
        );
    }
}

export type HelpCallback = () => void;
export default HelpComponent;