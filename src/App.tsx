import './App.css'
import {useState} from 'react'
import reactLogo from './assets/react.svg'
import {useFetchTransactions} from "./features/api";


function App() {
  const [count, setCount] = useState(0)
  const {data} = useFetchTransactions([
    'ad4241fca03edab0fd658baef7bb806e22bda2f2557deba3bd27c3e27c63de75',
    '7520bfc329abe14adc9c25b482305dc51bed2532464dbf0be2d8d3d9955f2766',
    '29df3614e22e42ad2158dbd73364b3815c0f5a3e4fe704c7327f559dbfbbc390'])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo"/>
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo"/>
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>{data?.map((d) =>
        <>
          <h1>{d.txID}</h1>
          <p>{d.hex}</p>
        </>
      )}</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
