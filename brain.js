import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Izinkan ambil model dari internet kalau di HP belum ada
env.allowRemoteModels = true;

let model = null;

export async function bangunkanModel() {
    if (model) return true;
    try {
        console.log("Menghubungi pusat otak...");
        // Pakai model yang paling stabil
        model = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct');
        console.log("OTAK BERHASIL BANGUN!");
        return true;
    } catch (e) {
        console.error("Otak pingsan:", e);
        return false;
    }
}

export async function tanyaModel(teksUser, dataTambang) {
    if (!model) {
        const sukses = await bangunkanModel();
        if (!sukses) return "Gagal memuat otak.";
    }

    const prompt = `<|im_start|>system
Kamu adalah Core Intelligence buatan Alan.
Gunakan info ini: "${dataTambang}"
Jelaskan jawaban dengan bahasamu sendiri secara ramah. JANGAN copy-paste!<|im_end|>
<|im_start|>user
${teksUser}<|im_end|>
<|im_start|>assistant\n`;

    const out = await model(prompt, { 
        max_new_tokens: 100, 
        temperature: 0.6,
        repetition_penalty: 1.2 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
