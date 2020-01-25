import React, { useEffect } from "react";
import { Text, View, AsyncStorage, Button, TextInput } from "react-native";
import init from "react_native_mqtt";

let client;

export default function App() {
  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {}
    });

    //host, port, path, clientId
    client = new Paho.MQTT.Client(
      "hairdresser.cloudmqtt.com",
      38685,
      "ghgaazqp"
    );
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    console.log("\n\nConnecting...");

    client.connect({
      onSuccess: onConnect,
      onFailure: onError,
      useSSL: true,
      userName: "ghgaazqp",
      password: "NvhJXk4htHSG"
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
      }}
    >
      <Button
        title="Send 'Hello Wahid'"
        onPress={() => {
          let message = new Paho.MQTT.Message("Hello Wahid");
          message.destinationName = "FUCK YEAH";

          client.send(message);
        }}
      />
    </View>
  );
}

function onConnect() {
  console.log("onConnect");

  // client.subscribe("/cloudmqtt");
  // let message = new Paho.MQTT.Message("Hello CloudMQTT");
  // message.destinationName = "/cloudmqtt";
  // client.send(message);
}

function onError(e) {
  console.log("error");
  console.log(e);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);
}
