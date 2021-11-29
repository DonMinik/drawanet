import Tesseract from "tesseract.js";

export class TextDetectionService {

    private static readonly TESSERACT_CONFIG = {
        tessedit_char_whitelist: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9 ',
        tessedit_pageseg_mode: 10
    }
    private static readonly TESSERACT_WORKER_CONFIG = {
        logger: m => console.log(m),
    }

    static async detectText(canvas: HTMLCanvasElement): Promise<any> {
        const scaledCanvas = this.scaleCanvas(canvas);
        const result = await Tesseract.recognize(scaledCanvas, this.TESSERACT_CONFIG, this.TESSERACT_WORKER_CONFIG)
            .catch(err => {
                console.error(err);
            });
        return result.text?.trim()
    }

    private static scaleCanvas(canvas: HTMLCanvasElement) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width * 5;
        newCanvas.height = canvas.height * 5;
        const newCtx = newCanvas.getContext('2d');
        newCtx.scale(5, 5)
        newCtx.drawImage(canvas, 0, 0);
        return newCanvas;
    }

}

