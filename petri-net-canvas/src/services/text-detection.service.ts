import Tesseract,  from "tesseract.js";
import preprocessImage from "../utils/preprocess";

export class TextDetectionService {

    constructor() {

    }

    async detectText(canvas: HTMLCanvasElement ): Promise<any> {
        const ctx = canvas.getContext('2d');

        ctx?.putImageData(preprocessImage(canvas),0,0);
        const dataUrl = canvas.toDataURL("image/jpeg");

        return Tesseract.recognize(
            dataUrl,'eng',
            {
                logger: m => console.log(m)
            }
        )
            .catch (err => {
                console.error(err);
            })
            .then(result  => {
                // Get Confidence score
              //  let confidence = result.confidence
                // Get full output
                let text = result?.data?.text;
                return result;
                // setPin(patterns);
            })
    }
}