import Tesseract from "tesseract.js";

export class TextDetectionService {

    constructor() {

    }

    async detectText(canvas: HTMLCanvasElement ): Promise<any> {

        const ctx = canvas.getContext('2d');
        const src =  ctx.getImageData(0, 0, canvas.width, canvas.height);

        return Tesseract.recognize(
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
                return text
                debugger
               // this.setState({text: text});
                // setPin(patterns);
            })
    }
}