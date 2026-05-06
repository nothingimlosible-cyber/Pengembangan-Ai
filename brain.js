import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

let model = null;

// 1. Fungsi buat aktifin model pas aplikasi dibuka
export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Sedang memuat otak AI...");
        model = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct');
        console.log("OTAK AI AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal muat model:", e);
        return false;
    }
}

// 2. Fungsi utama buat ngolah data tambang jadi bahasa manusia
export async function tanyaModel(teksUser, dataTambang) {
    if (!model) throw new Error("Model pingsan");

    // Prompt rahasia biar dia GAK JAWAB MENTAH
    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence, asisten pribadi Alan yang cerdas.
Gunakan data ini sebagai referensi: "${dataTambang}"
TUGAS: Jawab pertanyaan user dengan gaya bahasamu sendiri yang ramah. 
JANGAN menyalin kalimat dari data referensi secara utuh. Jawab yang jelas dan gunakan spasi yang benar.<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 150, 
        temperature: 0.7, // Biar gak kaku
        repetition_penalty: 1.2 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
