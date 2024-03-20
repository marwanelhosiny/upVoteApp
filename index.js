import express from 'express'
import db_connection from './DB/connection.js'
import userRouter from './src/modules/user/user.routes.js'
import productRouter from './src/modules/product/product.routes.js'
import { globalResponse } from './src/middlewares/globalResponse.js'
import commentRouter from './src/modules/comment/comment.routes.js'
import likeRouter from './src/modules/like/like.routes.js'
const app = express()
const port = 3000
db_connection()
app.use(express.json())
app.use('/user',userRouter)
app.use('/product',productRouter)
app.use('/comment',commentRouter)
app.use('/like',likeRouter)

app.use(globalResponse)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))