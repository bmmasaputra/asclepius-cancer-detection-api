const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try{
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()
 
  const prediction = model.predict(tensor);
  const score = await prediction.data();
  const cancerScore = score * 100;

  const classes = ["Cancer", "Non-cancer"];
  const classResult = cancerScore > 50 ? 0 : 1;
  const label = classes[classResult];

  let suggestion;
  if (label === "Cancer") {
    suggestion = "Kamu terindikasi Cancer, Segera ke dokter, semoga kamu sehat ya!";
  } else {
    suggestion = "Kamu tidak terindikasi Cancer, Kamu Sehat, tetap jangan lupa jaga kesahatan ya!";
  }

  return { label, suggestion };
}catch (error){
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi", 400)
    }
}

module.exports = predictClassification;
