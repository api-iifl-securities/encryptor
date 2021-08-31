import React from 'react';
import 'antd/dist/antd.css';
import { Button, Layout, Input, Card, Typography, message, Row, Col, Divider } from 'antd';

import './App.css';

const { Content } = Layout;
const { Text } = Typography;

function Results(props) {

  return (
    <Content>
      <Card>
        <Row>
          <Col span={12} style={{ textAlign: "left" }}><Text strong style={{ textAlign: "left" }}>Encrypted Client Code</Text></Col>
          <Col span={12} style={{ textAlign: "right" }}><Text copyable>{props.encryptedClientCode}</Text></Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12} style={{ textAlign: "left" }}><Text strong style={{ textAlign: "left" }}>Encrypted Password</Text></Col>
          <Col span={12} style={{ textAlign: "right" }}><Text copyable>{props.encryptedPassword}</Text></Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12} style={{ textAlign: "left" }}><Text strong style={{ encryptedDOB: "left" }}>Encrypted DOB</Text></Col>
          <Col span={12} style={{ textAlign: "right" }}><Text copyable>{props.encryptedDOB}</Text></Col>
        </Row>
      </Card>
    </Content>
  )
}

class MainComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showResults: false, encryptedClientCode: null, encryptedPassword: null, encryptedDOB: null,
      encryptionKey: null, ClientCode: null, Password: null, DOB: null
    }
  }

  isEmpty = (text) => {
    if (text === null || text === "") {
      return true
    }
    return false
  }

  updateResults = () => {
    if (this.isEmpty(this.state.encryptionKey)) {
      message.error("Please provide encryption key", 1.5)
      this.setState({ showResults: false })
      return
    }
    if (this.isEmpty(this.state.ClientCode) && this.isEmpty(this.state.Password) && this.isEmpty(this.state.DOB)) {
      message.error("Please provide something to encrypt", 1.5)
      this.setState({ showResults: false })
      return
    }
    if (!this.isEmpty(this.state.ClientCode)) {
      const encryptedClientCode = encrypt(this.state.ClientCode, this.state.encryptionKey)
      this.setState({ encryptedClientCode: encryptedClientCode })
    }
    if (!this.isEmpty(this.state.Password)) {
      const encryptedPassword = encrypt(this.state.Password, this.state.encryptionKey)
      this.setState({ encryptedPassword: encryptedPassword })
    }
    if (!this.isEmpty(this.state.DOB)) {
      const encryptedDOB = encrypt(this.state.DOB, this.state.encryptionKey)
      this.setState({ encryptedDOB: encryptedDOB })
    }
    this.setState({ showResults: true })
  }

  updateEncryptionKey = (event) => {
    this.setState({ encryptionKey: event.target.value })
  }

  updateClientCode = (event) => {
    this.setState({ ClientCode: event.target.value })
  }

  updatePassword = (event) => {
    this.setState({ Password: event.target.value })
  }

  updateDOB = (event) => {
    if (!Number(event.target.value)) {
      message.error("Only numbers allowed", 0.5)
      this.setState({ DOB: "" })
    }
    else (
      this.setState({ DOB: event.target.value })
    )
  }

  render() {

    return (

      <div className="App">
        <Layout>
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
          </head>
          <Content>
            <Input size="large" placeholder="Enter your encryption key here" onChange={this.updateEncryptionKey}
              onKeyPress={event => { if (event.key === "Enter" && this.state.encryptionKey !== null) this.updateResults() }}>

            </Input>
            <Input size="large" placeholder="Enter your client code" onChange={this.updateClientCode}
              onKeyPress={event => { if (event.key === "Enter" && this.state.ClientCode !== null) this.updateResults() }}>
            </Input>
            <Input.Password size="large" placeholder="Enter your password" onChange={this.updatePassword}
              onKeyPress={event => { if (event.key === "Enter" && this.state.Password !== null) this.updateResults() }}>

            </Input.Password>
            <Input size="large" placeholder="Enter your DOB in YYYYMMDD" onChange={this.updateDOB} value={this.state.DOB} maxLength={8}
              onKeyPress={event => { if (event.key === "Enter" && this.state.DOB !== null) this.updateResults() }}>

            </Input>
            <Button onClick={this.updateResults} style={{ backgroundColor: "#6699cc" }} > <Text strong style={{ color: "#fafafa" }}>Encrypt</Text></Button>
          </Content>
        </Layout>
        <Layout>
          {this.state.showResults ? <Results encryptedClientCode={this.state.encryptedClientCode}
            encryptedPassword={this.state.encryptedPassword}
            encryptedDOB={this.state.encryptedDOB} /> : null}
        </Layout>

      </div>
    )
  }
}

function App() {
  return (
    <Layout>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <MainComponent></MainComponent>
      </div >
    </Layout>
  )
}
function encrypt(text, enc_key) {
  const CryptoJS = require("crypto-js")
  var iterations = 1000;
  var keySize = 48;
  var iv = new Uint8Array([83, 71, 26, 58, 54, 35, 22, 11, 83, 71, 26, 58, 54, 35, 22, 11])
  var salt = CryptoJS.lib.WordArray.create(iv);

  var derivedKey = CryptoJS.PBKDF2(enc_key, salt, {
    keySize: keySize,
    iterations: iterations
  });
  const derivedKeyToString = derivedKey.toString(CryptoJS.enc.Hex)
  const newiv = derivedKeyToString.slice(0, 32)
  const newkey = derivedKeyToString.slice(32, 96)

  var finalKey = CryptoJS.enc.Hex.parse(newkey);
  var finaliv = CryptoJS.enc.Hex.parse(newiv);
  var encryptedText = CryptoJS.AES.encrypt(text, finalKey, { iv: finaliv })
  return encryptedText.toString()
}

export default App;
