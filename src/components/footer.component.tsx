import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBug} from "@fortawesome/free-solid-svg-icons";

class FooterComponent extends Component {
    render() {
        return (
            <div>
                <h2 style={{textAlign: "right"}}>
                    ... and I know you do too!
                    <br/><br/>
                    <a href="https://github.com/DonMinik/drawanet/issues" target="_blank"  rel="noopener noreferrer">report a bug <FontAwesomeIcon
                        icon={faBug}/></a>
                    <br/><br/>
                    <a href="http://www.fernuni-hagen.de/mi/fakultaet/lehrende/bergenthum/index.shtml">Robin
                        Bergenthum</a> and <a href="https://www.fernuni-hagen.de/sttp/team/benjamin.meis.shtml">Benjamin
                    Meis</a> <br/>
                    Fakultät für Mathematik und Informatik <br/>
                    Fernuni in Hagen, Germany <br/>
                    <a href="https://www.fernuni-hagen.de/service/impressum.shtml">Impressum</a> &middot;
                    <a href="https://www.fernuni-hagen.de/service/datenschutz.shtml">Datenschutz</a>
                </h2>
            </div>
        );
    }
}

export default FooterComponent;