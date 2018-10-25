const express = require('express');
const { join } = require('path');
const {
  checkSchema,
  validationResult
} = require('express-validator/check');
const expressSanitizer = require('express-sanitizer');
const helmet = require('helmet');
const schema = require('./validationSchema');

const app = express();

app.use(helmet.xssFilter());
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

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/process', checkSchema(schema), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  // const { formInput } = req.body;
  const sanitizedOutput = req.sanitize(req.body.formInput);
  
  res.render('output', {
    output: sanitizedOutput
  });
});

app.listen(3000, () => console.log(`Express app running on Port 3000`));