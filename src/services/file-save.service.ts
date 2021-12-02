import {PetriNet} from "../model/petri-net.interfaces";
import FileSaver from "file-saver";

export class FileSaveService {
    static saveFile(net: PetriNet){
        const file = this.buildFile(net);
        FileSaver.saveAs(file);
    }

    private static buildFile(net: PetriNet) {
        const fileContent = ['.type pn \n']
        fileContent.push('.transitions \n');
        net.transitions.forEach(transition => {
            fileContent.push(transition.exportName);
            fileContent.push('\n');
        });
        fileContent.push('.places \n');
        net.places.forEach(place => {
            fileContent.push(place.exportName);
            fileContent.push(' ' + place.tokens.length);
            fileContent.push('\n');
        });
        fileContent.push('.arcs \n');
        net.arcs.forEach(arc => {
            fileContent.push(arc.start.exportName + ' ' + arc.end.exportName);
            fileContent.push('\n');
        });
        return new File(fileContent, "pn.txt", {type: "text/plain;charset=utf-8"});
    }
}