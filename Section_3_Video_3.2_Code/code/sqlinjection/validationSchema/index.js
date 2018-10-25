module.exports = {
  username: {
    in: 'body',
    exists: true,
    isEmail: true,
    errorMessage: 'Invalid username format'
  },
  password: {
    in: 'body',
    exists: true,
    matches: {
      options: /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()\|\[\]\-\$\^\@\/]{8,32}$/,
      errorMessage: 'Invalid password format'
    }
  }
}