import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// 1. Kunci agar tidak download dari internet, harus pake folder 'brain' kamu
env.allowRemoteModels = false;
env.localModelPath = './'; 

let model = null;

// 2. Fungsi buat bangunin model dari folder './brain'
export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungkan ke folder brain lokal...");
        // Memanggil model 20MB yang ada di folder brain kamu
        model = await pipeline('text-generation', './brain'); 
        console.log("OTAK MANDIRI AKTIF!");
        return true;
    } catch (e) {
        console.error("Gagal load model lokal. Pastikan file .onnx ada di folder brain.", e);
        return false;
    }
}

// 3. Fungsi buat jawab (Kodingan yang kamu kasih tadi masuk sini)
export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const sukses = await bangunkanModel();
        if (!sukses) return "Waduh Lan, otaknya gagal bangun. Cek folder brain kamu.";
    }

    // Prompt ini yang bikin dia pinter & gak kaku
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

    // Ambil jawaban bersihnya saja
    return out[0].generated_text.split('assistant\n')[1].trim();
}
