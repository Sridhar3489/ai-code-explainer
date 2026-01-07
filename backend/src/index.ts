import express from "express"
import axios from "axios"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.listen(3000, ()=>{
    console.log("Server is listening on port 3000")
})

app.get("/health", (req, res)=>{
    res.status(200).json({
        "status": "OK"
    })
})


app.post("/chat", async(req, res)=>{
    const {code} = req.body;
    if(!code){
        res.status(400).json({
            message: "Code is required"
        })
        return;
    }
    res.setHeader('content-type', 'text/plain')
    res.setHeader('Transfer-Encoding', 'chunked')
    const response = await axios.post("http://127.0.0.1:11434/api/chat", {
        model: "llama3",
        stream: true,
        messages: [
            {"role": "system", "content": "You are a helpful code explainer. Detect the programming language automatically and explain the code clearly and concisely."},
            {"role": "user", "content": code}
        ]
    }, {
        responseType: 'stream'
    })

    response.data.on('data', (chunk:Buffer)=>{
        const d = chunk.toString()
        const json = JSON.parse(d)
        if(json.message?.content){
            res.write(json.message.content)
        }
    })

    response.data.on('end', ()=>{
        res.end()
    })
})