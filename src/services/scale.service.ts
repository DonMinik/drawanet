export class ScaleService {

    static reset() {
        scaleStore.scale = 100;
    }

    static scale(scale: number):number {
        if (!scaleStore.initialized) {
            scaleStore.initialized = true;
            scaleStore.scale = scale;
        }
        return scaleStore.scale;
    }
}

const scaleStore = {
    scale: 100,
    initialized: false,
}

