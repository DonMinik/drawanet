import Tesseract from "tesseract.js";

export class TextDetectionService {

    private static readonly TESSERACT_CONFIG = {
        logger: m => console.log(m),
      //Todo: this does not work, but maybe try to find config parameters to increase precision
        // tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }

    static async detectText(canvas: HTMLCanvasElement ): Promise<any> {
        const ctx = canvas.getContext('2d');
        const src =  ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = await  Tesseract.recognize(src,'eng', this.TESSERACT_CONFIG)
            .catch (err => {
                console.error(err);
            });
        return result.text
    }
}

