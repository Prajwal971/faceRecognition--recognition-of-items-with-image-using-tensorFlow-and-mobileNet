import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, Image, Button } from "react-native";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { fetch } from "@tensorflow/tfjs-react-native";
import * as jpeg from "jpeg-js";
// https://oceana.org/sites/default/files/tiger_shark_0.jpg

// https://res.cloudinary.com/dpdbwvzcb/image/upload/v1598344387/goat_tpzqbe.jpg
// https://res.cloudinary.com/dpdbwvzcb/image/upload/v1598344309/sample.jpg
// "https://res.cloudinary.com/dpdbwvzcb/image/upload/v1598344317/samples/bike.jpg"
// https://res.cloudinary.com/dpdbwvzcb/image/upload/v1621029277/samples/people/dog-puppy-on-garden-royalty-free-image-1586966191_e7b6pv.jpg
// https://res.cloudinary.com/dpdbwvzcb/image/upload/v1621029345/samples/people/merlin_102239914_6de5d563-4aaa-44d7-bdb0-2a263e515181-articleLarge_jg3kj8.jpg
//https://res.cloudinary.com/dpdbwvzcb/image/upload/v1621029440/samples/people/ImageResizer.ashx_fxmps2.jpg

// https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.mad4wheels.com%2Fimg%2Ffree-car-images%2Fmobile%2F15319%2Feagle-low-drag-gt-2016-442285.jpg&imgrefurl=https%3A%2F%2Fwww.mad4wheels.com%2Feagle%2Flow-drag-gt-2016%2Fcar-wallpaper-442285&tbnid=BZW3UaKbohezSM&vet=12ahUKEwjPyImJkMrwAhWLSCsKHfQ_AJkQMygBegUIARC8AQ..i&docid=lk92O6Rrq_Pu7M&w=768&h=511&q=low%20resolution%20car%20image&ved=2ahUKEwjPyImJkMrwAhWLSCsKHfQ_AJkQMygBegUIARC8AQ

export default function App() {
  const [url, setUrl] = useState(
    "https://res.cloudinary.com/dpdbwvzcb/image/upload/v1621029543/samples/people/tiger_shark_0_otyxzg.jpg" 
  );
  const [displayText, setDisplayText] = useState("Loading...");

  async function getPrediction(url) {
    setDisplayText("Loading tensor flow");
    console.log("This is image URL"+url)
    await tf.ready();
    setDisplayText("Loading Mobile Net");
    const model = await mobilenet.load(); //neural network used to classify images {{{Mobile NET}}}
    console.log("This is Model"+model)
    setDisplayText("Fetching Image Net");
    const response = await fetch(url, {}, { isBinary: true });
    console.log("This is response"+response)
    setDisplayText("Fetching  Image Buffer");
    const imageDate = await response.arrayBuffer();
    console.log("This is image Data"+imageDate[1])
    setDisplayText("Fetching  Image Tensor");
    const imageTensor = imageToTensor(imageDate);
    setDisplayText("Getting classification result");
    const prediction = await model.classify(imageTensor);
    setDisplayText(JSON.stringify(prediction));
  }
  //Trasnferrimng the image to matrix
  //1)Decode it
  function imageToTensor(rawData) {
    const { width, height, data } = jpeg.decode(rawData, true);
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]; //red
      buffer[i + 1] = data[offset + 1]; //green
      buffer[i + 2] = data[offset + 2]; //blue
      offset += 4; //skips alpha valueF
    }
    return tf.tensor3d(buffer, [height, width, 3]);
  }

  return (
    <View style={styles.container}>
      <Text>Only works with JPEG image</Text>
      <TextInput
        style={{
          height: 40,
          width: "90%",
          borderColor: "grey",
          borderWidth: 1,
        }}
        onChangeText={(text) => setUrl(text)}
        value={url}
      />
      <Image style={styles.imageStyle} source={{ uri: url }}></Image>
      <Button title="Classify Image" onPress={() => getPrediction(url)} />
      <Text>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    height: 200,
    width: 300,
  },
});
