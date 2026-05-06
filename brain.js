import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// WAJIB: Jangan cari ke internet, pake file di repo
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder brain...");
        // Memanggil folder 'brain' yang ada di GitHub kamu
        model = await pipeline('text-generation', 'brain', {
            quantized: true,
            model_file_name: 'onnx/model_quantized.onnx' 
        });
        console.log("SISTEM AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal! Cek apakah file .onnx ada di brain/onnx/", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const siap = await bangunkanModel();
        if (!siap) return "Gagal memuat otak lokal.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten Alan yang cerdas.
Gunakan info ini: "${dataTambang}"
Jawablah dengan natural dan asik.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 150, 
        temperature: 0.8 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
