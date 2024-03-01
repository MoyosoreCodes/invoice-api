const emailConfig = {
  transport: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  },
  defaults: {
    from: process.env.EMAIL_SENDER,
  }
}