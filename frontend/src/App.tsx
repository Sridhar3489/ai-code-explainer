import { useRef, useState } from "react"

export default function App(){
  const codeRef = useRef<HTMLInputElement>(null)
  const [response, setResponse] = useState("")
  async function explain(){
    const code = codeRef.current?.value;
    console.log(code)
    if(codeRef.current?.value){
      const r= await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({code})
      })
      const reader = r.body?.getReader()
      const decoder = new TextDecoder()

      while(reader){
        const {done, value} = await reader.read()
        if(done) break
        setResponse(prev => prev + decoder.decode(value))
      }
      
    }
  }
  return (
    <div>
      <input ref={codeRef}></input>
      <button onClick={explain}>Explain</button>
      <p>{response}</p>
    </div>
  )
}