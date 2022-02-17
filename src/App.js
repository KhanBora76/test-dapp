import './App.css';
import { useState } from 'react'
import { ethers } from 'ethers'
import Greeter from './Greeter.json'

// Deploy sonrası verdiği adresi buraya giriyoruz

/*

// mumbai
 const greeterAddress = "0xCA6C2c8c6946Ae0Ee8375cC6468ef34d1C1db3d2"

 // ropsten
const greeterAddress = "0xCA6C2c8c6946Ae0Ee8375cC6468ef34d1C1db3d2"

//bsc 
const greeterAddress = "0x75A3cCa0938fA45207B2002468A1B6389324657c"
*/

function App() {
  // local state de kayıtları tutuyoruz.
  const [greeting, setGreetingValue] = useState()

   /*******************************************/
  /* greeterAddress atamasını yapacak değişken ve fonksiyonu ayarlayalım*/
  const [greeterAddress, setGreeterAddress] = useState();

  // Metamask izni için kullanıyoruz.
  async function requestAccount() {
    // cüzdan bağlanmamış ise connect için popup aç
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // smart contract ı çağırma mevcut mesajı okumak için 
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      // ether.js ile provider ı başlat
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // kontrat başlat
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        // kontratta yer alan greet fonksiyonunu çağır
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        // hata varsa ekrana yaz
        console.log("Error: ", err)
      }
    }    
  }

  // smart kontratı çağır ve mesajı güncelle
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      // metamask ile bağlantı için popup açar
      await requestAccount()
      // provider ı başlatır
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // cüzdan sahibini tanır
      const signer = provider.getSigner()
      // cüzdan sahibi mesajı ayarlayanın mesajını akıllı kontrat için kontrat başlatır
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      // kontrattaki setGreeting mesaj ayarlama fonksiyonuna mesajı gönderir
      const transaction = await contract.setGreeting(greeting)
      // transactionın oluşması için bekler
      await transaction.wait()
      // transaction oluştuktan sonra mesajı console a basar
      fetchGreeting()
    }
  }

  // React in html kod bloğu 2 buton ve 1 input box oluşturur
  return (
    <div className="App">
      <header className="App-header">

                {/***************** Radio Buton kodlarını ekleyelim **************************/}
                <div>
            <label>Network: </label>
            <input type="radio" name="ag" value="0x75A3cCa0938fA45207B2002468A1B6389324657c" onChange={e => setGreeterAddress(e.target.value)} /> BSC
            <input type="radio" name="ag" value="0xf1039101B07aC0cBeC8f6d2050B69E295893A4D0" onChange={e => setGreeterAddress(e.target.value)} /> Ropsten
            <input type="radio" name="ag" value="0xCA6C2c8c6946Ae0Ee8375cC6468ef34d1C1db3d2" onChange={e => setGreeterAddress(e.target.value)} /> Polygon Mumbai
        </div>
        {/****************************************************************************/}

        <p>(Please change the Network from MetaMask)</p>
        <button onClick={fetchGreeting}>Call</button>
        <button onClick={setGreeting}>Re-Configure</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Change Configuration" />
      </header>
    </div>
  );
}

export default App;