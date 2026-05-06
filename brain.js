// Di dalam brain.js
model = await pipeline('text-generation', './brain', {
    quantized: true
});
