import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// WAJIB: Jangan download lagi, pake yang udah didownload Action tadi
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        // Panggil folder 'brain' yang dibuat Action tadi
        model = await pipeline('text-generation', 'brain', {
            quantized: true 
        });
        return true;
    } catch (e) {
        console.error("Gagal baca model lokal!", e);
        return false;
    }
}
