const express = require('express');
const { join } = require('path');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const {
  checkSchema,
  validationResult
} = require('express-validator/check');
const csurf = require('csurf');
const schema = require('./validationSchema');

const app = express();
const csurfGuard = csurf();

app.use(session({
  secret: 'superSecretSessionPassword',
  resave: false,
  saveUninitialized: true
}));
app.use(helmet.xssFilter());
// CSRF Protection
app.use(helmet.frameguard({ action: 'deny' }));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'fonts.googleapis.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
    scriptSrc: ["'self'", 'code.jquery.com']
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(expressSanitizer());
app.use('/public', express.static(join(__dirname, 'public')));
app.locals.basedir = join(__dirname, 'public');

app.set('view engine', 'pug');

app.get('/', csurfGuard, (req, res) => {
  res.render('index', {
    _csrf: req.csrfToken()
  });
});

app.post('/process', checkSchema(schema), csurfGuard, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  const sanitizedOutput = req.sanitize(req.body.formInput);
  console.log(req.session);
  res.render('output', {
    output: sanitizedOutput
  });
});


app.listen(3000, () => console.log(`Express app running on Port 3000`));