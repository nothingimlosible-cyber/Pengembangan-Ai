export async function tanyaModel(teksUser, dataTambang) {
    if (!model) await bangunkanModel();

    // Prompt ini bikin AI sadar dia punya otak sendiri + info tambahan
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
        temperature: 0.8, // Ditingkatkan biar makin pinter dan luwes
        repetition_penalty: 1.1 
    });

    return out[0].generated_text.split('assistant\n')[1].trim();
}
