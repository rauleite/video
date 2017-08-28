import mongoose from 'mongoose'

// define the User model schema
const CaptchaSchema = new mongoose.Schema({
  email: {
    type: String,
    index: { unique: true }
  },
  hasCaptchaComponent: {
    type: Boolean,
    default: false
  },
  count: {
    type: Number,
    default: 0
  },
  countExpires: Date
})

CaptchaSchema.pre('save', function (next) {
  console.log('[model] pre save')
  return next()
})

CaptchaSchema.pre('save', function (next) {
  console.log('[model] pre save - this.count', this.count)

  // if (this.hasFormError) {
  //   console.log('[model] this.count', this.count)
  //   this.count = this.count + 1
  // }

  if (this.count >= 2) {
    this.hasCaptchaComponent = true
  }

  return next()
})

module.exports = mongoose.model('Captcha', CaptchaSchema)
