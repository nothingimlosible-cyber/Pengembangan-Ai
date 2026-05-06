import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// WAJIB: Paksa pake folder lokal, jangan cari ke internet
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder otak...");
        // DISESUAIKAN: Nama folder di GitHub kamu adalah 'otak'
        model = await pipeline('text-generation', 'otak', {
            quantized: true 
        });
        console.log("OTAK BERHASIL AKTIF!");
        return true;
    } catch (e) {
        console.error("Folder 'otak' gak ketemu atau isinya kurang, Lan!", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const siap = await bangunkanModel();
        if (!siap) return "Sistem gagal akses folder otak.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten pribadi Alan.
Gunakan info ini: "${dataTambang}"
Jawablah pertanyaan Alan dengan cerdas dan santai.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 120, 
        temperature: 0.7 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
