import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Matikan download otomatis dari internet, paksa pake folder 'brain' di GitHub
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder brain...");
        // Jalur lurus ke folder 'brain' yang isinya model 20MB kamu
        model = await pipeline('text-generation', 'brain', {
            quantized: true 
        });
        console.log("SISTEM AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal akses folder brain. Pastikan folder brain ada di root.", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const sukses = await bangunkanModel();
        if (!sukses) return "Gagal memuat sistem.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten pribadi Alan yang cerdas.
Gunakan info ini: "${dataTambang}"
Jawablah dengan bahasa Indonesia yang natural dan solutif.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 150, 
        temperature: 0.7 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
