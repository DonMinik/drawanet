export class ScaleService {

    static reset() {
        scaleStore.scale = 100;
    }

    static scale(scale: number):number {
        if (!scaleStore.initialized) {
            scaleStore.initialized = true;
            console.log('set Scale', scale)
            scaleStore.scale = scale;
        }
        console.log(scaleStore.scale);
        return scaleStore.scale;
    }
}

const scaleStore = {
    scale: 100,
    initialized: false,
}

