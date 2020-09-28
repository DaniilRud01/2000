import mongoose from 'mongoose'

const url = 'mongodb+srv://Daniel:12131441w@cluster0.xkasi.azure.mongodb.net/test'

exports.connect = () => {
  mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
}

mongoose.connection.on('connected', () => {
  console.log('db is connected')
})

mongoose.connection.on('err', (err) => {
  console.log(err)
})
