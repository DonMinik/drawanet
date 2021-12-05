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
                    <p>Hold down left mouse button to <b>draw</b> places, transitions, arcs, and tokens.</p>
                    <p>Elements you draw are not movable. The <b>size</b> of places and transitions is defined by the first one
                        you draw. Keep this in mind if you need space for a large net. You can increase the drawing space by
                        dragging the bottom line of it, though.</p>
                    <p><b>Tokens</b> can be added by clicking within a place.</p>
                    <p>Start <b>arc</b> <i>within</i> a place or transition and end the line <i>within</i> another.</p>
                    <p>Use double click <b>to name</b> a place or transition and write the name into the black field by drawing character. Close
                        by clicking outside the field.</p>
                    <p>Currently only capital letters and numbers is supported. If your writing is recognized
                        incorrectly please try to write the character as close to printed characters as possible.</p>
                    <p>To draw <b>arc weights</b> draw the same arc twice or multiple times.</p>
                    <p>If you need to <b>delete</b> any element just cross out the element you wish to delete.(Tokens can be
                        removed with a single click.) </p>
                </div>
                <div className='backdrop' onClick={() => this.onClick()}/>
            </div>
        );
    }
}

export type HelpCallback = () => void;
export default HelpComponent;