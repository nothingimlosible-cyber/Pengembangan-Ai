import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Paksa pakai folder lokal 'brain', jangan download lagi
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        // Dia akan cari folder 'brain' yang isinya file 20MB itu
        model = await pipeline('text-generation', 'brain'); 
        return true;
    } catch (e) {
        console.error("Folder brain nggak ketemu atau file rusak, Lan!");
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) await bangunkanModel();

    const prompt = `<|im_start|>system
Kamu Core Intelligence. Gunakan data ini jika perlu: "${dataTambang}"
Jawab Alan dengan natural dan cerdas.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 120, 
        temperature: 0.7 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
