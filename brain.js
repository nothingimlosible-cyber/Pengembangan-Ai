import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// WAJIB: Jangan cari ke internet, pake file di repo
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder otak...");
        
        // Kita panggil folder 'otak'. 
        // Transformers.js akan otomatis cari config.json di situ
        // Dan kita kasih tahu kalau modelnya ada di dalem sub-folder onnx
        model = await pipeline('text-generation', 'otak', {
            quantized: true,
            model_file_name: 'onnx/model_quantized.onnx' 
        });
        
        console.log("OTAK BERHASIL AKTIF!");
        return true;
    } catch (e) {
        // Kalau ini muncul, berarti Vercel nge-block filenya (Butuh vercel.json)
        console.error("Gagal akses folder otak:", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const siap = await bangunkanModel();
        if (!siap) return "Gagal memuat otak. Cek apakah folder 'otak' sudah ada di GitHub.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten pribadi Alan yang cerdas dan berwawasan luas.
Gunakan info ini HANYA JIKA RELEVAN: "${dataTambang}"
TUGAS: Jawablah pertanyaan Alan dengan natural. Kamu bebas menggunakan pengetahuanmu sendiri. 
Jangan kaku, jangan cuma copy-paste, dan gunakan bahasa Indonesia yang asik.<|im_end|>
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
