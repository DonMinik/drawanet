import React, {Component} from "react";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import HelpComponent from "./help.component";

class HeaderComponent extends Component<any, {showHelp: boolean}> {

    help: any;

    constructor(props: any) {
        super(props);
        this.state = {
            showHelp: false
        }
    }

    showHelp() {
        this.help = <HelpComponent callBack={() => this.closeHelp()}/>
        this.setState({showHelp: true});
    }

    closeHelp() {
        this.setState({showHelp: false});
    }

    render() {
        return (
            <div>
                <a href="../index.js" style={{textDecoration: "none"}}>
                    <h1 style={{color: "#000"}}>I<span style={{color: "#FF0000"}}> &#10084;</span> Petri Nets</h1>
                </a>

                <h2> Draw a petri net <FontAwesomeIcon icon={ faQuestionCircle} onClick={() => this.showHelp()}/></h2>
                { this.state.showHelp ? this.help
                    : null
                }
            </div>
        );
    }
}

export default HeaderComponent