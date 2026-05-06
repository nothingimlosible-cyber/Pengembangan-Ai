import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Matikan koneksi ke internet, paksa pake file di GitHub kamu
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Membuka folder brain...");
        // Kita panggil folder 'brain' dan arahkan ke file onnx di dalamnya
        model = await pipeline('text-generation', 'brain', {
            quantized: true,
            model_file_name: 'onnx/model_quantized.onnx'
        });
        console.log("OTAK AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal load model:", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) await bangunkanModel();
    
    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten cerdas Alan.
Gunakan info ini jika relevan: "${dataTambang}"
Jawab dengan gaya yang asik dan pinter.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 150, 
        temperature: 0.8,
        repetition_penalty: 1.1 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
