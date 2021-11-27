import Tesseract from "tesseract.js";

export class TextDetectionService {

    private static readonly TESSERACT_CONFIG_WHITELIST =  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    static async detectText(canvas: HTMLCanvasElement ): Promise<string> {
        const ctx = canvas.getContext('2d');
        const src =  ctx.getImageData(0, 0, canvas.width, canvas.height);

        const worker = Tesseract.createWorker();
        let result: string;
        await (async () => {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            await worker.setParameters({
                tessedit_char_whitelist: this.TESSERACT_CONFIG_WHITELIST,
            });
            const {data: {text}} = await worker.recognize(src);
            console.log(text);
            result = text?.trim();
            await worker.terminate();
        })();
        return result;
    }
}

