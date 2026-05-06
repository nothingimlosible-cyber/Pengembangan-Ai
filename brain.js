import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Matikan internet, paksa pake file di repo kamu sendiri
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder otak/onnx...");
        // Memanggil folder 'otak' yang berisi sub-folder 'onnx'
        model = await pipeline('text-generation', 'otak', {
            quantized: true,
            model_file_name: 'onnx/model_quantized.onnx' 
        });
        console.log("OTAK AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal! Cek folder otak/onnx kamu, Lan.", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const siap = await bangunkanModel();
        if (!siap) return "Sistem gagal akses otak. Pastikan RAM HP tidak penuh.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten pribadi Alan yang cerdas.
Gunakan info ini sebagai referensi rahasia: "${dataTambang}"
Jawab pertanyaan Alan dengan bahasa Indonesia yang natural dan pinter.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 150, 
        temperature: 0.7,
        repetition_penalty: 1.2
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
