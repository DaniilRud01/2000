import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

userSchema.method({
  passwordMatches(password) {
    return bcrypt.compareSync(password, this.password)
  }
})
userSchema.statics = {
 async findAndValidateUSer({ email, password }) {
    if (!email) {
      throw new Error('No email')
    }
    if (!password) {
      throw new Error('No password')
    }
    const user = await this.findOne({ email })
    if (!user) {
      throw new Error('no User')
    }
    const isPasswordOk = await user.passwordMatches(password)
    if (!isPasswordOk) {
      throw new Error('Password Incorrect')
    }
    return user
  }
}

userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10)
  return next()
})

export default mongoose.model('users', userSchema)
