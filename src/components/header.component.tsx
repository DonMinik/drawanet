import React, {Component} from "react";

class HeaderComponent extends Component {

    render() {
        return (
            <div>
                <a href="../index.js" style={{textDecoration: "none"}}>
                    <h1 style={{color: "#000"}}>I<span style={{color: "#FF0000"}}> &#10084;</span> Petri Nets</h1>
                </a>

                <h2> Draw a petri net - Hold down left mouse button to draw places, transitions, arcs, and tokens. <br/> Click right mouse button to remove places, transitions, and tokens.
                </h2>
            </div>
        );
    }
}

export default HeaderComponent