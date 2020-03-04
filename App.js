import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native"
import init from "react_native_mqtt"

function Separator() {
  return <View style={styles.separator} />
}

const CONNECTION_STATES = {
  connected: "connected",
  disconnected: "disconnected",
  connecting: "connecting..."
}

const RECONNECTION_STATES = {
  reconnecting: "reconnecting"
}

const PROBES = {
  probeOne: "/PROBE/1",
  probeTwo: "/PROBE/2",
  probeThree: "/PROBE/3",
  probeFour: "/PROBE/4",
  probeFive: "/PROBE/5",
  probeSix: "/PROBE/6"
}

let client

/**
 * @SERVER_DETAILS (ADD YOUR DETAILS)
 * make sure to use Websockets Port(TLS only)
 */
const username = ""
const password = ""
const port = 0

export default function App() {
  const [connection, setConnection] = useState(CONNECTION_STATES.connecting)
  const [reconnection, setReconnection] = useState(null)

  const [error, setError] = useState(null)
  const [data, setData] = useState({
    probeOne: null,
    probeTwo: null,
    probeThree: null,
    probeFour: null,
    probeFive: null,
    probeSix: null
  })

  useEffect(() => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {}
    })

    connectToMQTT()
  }, [])

  useEffect(() => {
    if (connection === CONNECTION_STATES.disconnected) {
      setReconnection(RECONNECTION_STATES.reconnecting)

      client.disconnect()

      const interv = setInterval(() => {
        reconnectToMQTT()
      }, 5000)

      return () => {
        clearInterval(interv)
      }
    }
  }, [connection])

  function connectToMQTT() {
    //host, port, path, clientId
    client = new Paho.MQTT.Client("hairdresser.cloudmqtt.com", port, username)

    client.onConnectionLost = onConnectionLost
    client.onMessageArrived = onMessageArrived

    console.log("\n\nConnecting...")

    client.connect({
      onSuccess: onConnect,
      onFailure: onError,
      useSSL: true,
      userName: username,
      password: password
    })
  }

  function reconnectToMQTT() {
    client.connect({
      onSuccess: onConnect,
      onFailure: onError,
      useSSL: true,
      userName: username,
      password: password
    })
  }

  function onConnect() {
    console.log("onConnect")

    setError(null)
    setReconnection(null)

    setConnection(CONNECTION_STATES.connected)
    client.subscribe("/PROBE/#")
  }

  function onError(e) {
    console.log("error")
    console.log(e)

    setConnection(CONNECTION_STATES.disconnected)
    setError("Unexpected error")
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage)

      setConnection(CONNECTION_STATES.disconnected)
      setError(responseObject.errorMessage)
    }
  }

  function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString)

    switch (message.topic) {
      case PROBES.probeOne:
        setData(prevState => ({
          ...prevState,
          probeOne: message.payloadString
        }))
        return
      case PROBES.probeTwo:
        setData(prevState => ({
          ...prevState,
          probeTwo: message.payloadString
        }))
        return
      case PROBES.probeThree:
        setData(prevState => ({
          ...prevState,
          probeThree: message.payloadString
        }))
        return
      case PROBES.probeFour:
        setData(prevState => ({
          ...prevState,
          probeFour: message.payloadString
        }))
        return
      case PROBES.probeFive:
        setData(prevState => ({
          ...prevState,
          probeFive: message.payloadString
        }))
        return
      case PROBES.probeSix:
        setData(prevState => ({
          ...prevState,
          probeSix: message.payloadString
        }))
        return
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000000" />
      <View style={styles.headerContainer}>
        <Text style={[styles.title, styles.textColor]}>
          STATUS
          <Text style={styles.status}>
            {"   "}
            {connection}
          </Text>
        </Text>
        <ActivityIndicator
          color={
            connection === CONNECTION_STATES.connecting ? "yellow" : "#000"
          }
          size={14}
        />
      </View>
      {error && (
        <>
          <Text style={[styles.textColor, styles.title, { marginTop: 16 }]}>
            ERROR
            <Text style={{ color: "crimson" }}>
              {"   "}
              {error}
            </Text>
          </Text>
        </>
      )}
      {reconnection && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16
          }}
        >
          <Text style={[styles.textColor, styles.title]}>Reconnecting...</Text>
          <ActivityIndicator
            color="yellow"
            size={14}
            style={{ alignSelf: "center", textAlignVertical: "center" }}
          />
        </View>
      )}
      <View style={styles.probeContainer}>
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 1</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeOne}
          </Text>
        </View>
        <Separator />
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 2</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeTwo}
          </Text>
        </View>
        <Separator />
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 3</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeThree}
          </Text>
        </View>
        <Separator />
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 4</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeFour}
          </Text>
        </View>
        <Separator />
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 5</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeFive}
          </Text>
        </View>
        <Separator />
        <View style={styles.probeValueContainer}>
          <Text style={[styles.textColor, styles.probeText]}>PROBE 6</Text>
          <Text style={[styles.textColor, styles.probeText, styles.probeValue]}>
            {data.probeSix}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: "#000"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.8,
    paddingHorizontal: 10
  },
  status: {
    fontWeight: "normal",
    textDecorationLine: "none",
    color: "yellowgreen"
  },
  probeContainer: {
    flex: 1,
    marginVertical: 60,
    marginHorizontal: 50
  },
  separator: {
    marginVertical: 20,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  textColor: {
    color: "white"
  },
  probeText: {
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.8,
    textAlignVertical: "center"
  },
  probeValueContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  probeValue: {
    color: "lightgreen"
  }
})
