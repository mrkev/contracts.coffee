exports = Contracts.exports "adder_module"

exports.add :: (Num) -> Pos
exports.add = (x) -> x + 10

window.Adder = exports
