fs = require 'fs'

# pull in javascript contracts library

CONTRACTS_JS_PATH = '../contracts.js/src/contracts.js'
STACKTRACE_PATH = '../contracts.js/src/stacktrace.js'
contractsSource = fs.readFileSync CONTRACTS_JS_PATH, 'utf8'
stacktraceSource = fs.readFileSync STACKTRACE_PATH, 'utf8'

exports.contractsSource = "#{stacktraceSource}\n#{contractsSource}"
