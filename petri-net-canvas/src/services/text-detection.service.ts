import Tesseract from "tesseract.js";

export class TextDetectionService {

    constructor() {

    }

    static async detectText(canvas: HTMLCanvasElement ): Promise<any> {
        const ctx = canvas.getContext('2d');
        const src =  ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = await  Tesseract.recognize(src,'eng', {logger: m => console.log(m)})
            .catch (err => {
                console.error(err);
            });
        return result.text
    }
}