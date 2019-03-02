require('proof')(20, prove)

function prove (okay) {
    var Monotonic = require('..')

    okay(Monotonic.toString(Monotonic.toWords('88888888/888888888')), '88888888/888888888', 'parse')
    okay(Monotonic.asString.compare('0', '0'), 0, 'compare equal')
    okay(Monotonic.asString.compare('100000000', 'ffffffff') > 0, 'compare longer than')
    okay(Monotonic.asString.compare('fffffffe', 'ffffffff') < 0, 'compare less than')
    okay(Monotonic.asString.compare('ffffffff', 'fffffffe') > 0, 'compare less than')
    okay(Monotonic.asString.compare('ffffffff', 'fffffffe') > 0, 'compare less than')
    okay(Monotonic.asString.increment('0/ffffffff', 1), '0/100000000', 'increment roll over')
    okay(Monotonic.asString.increment('0/fffffffe', 1), '0/ffffffff', 'increment roll over')
    okay(Monotonic.asString.increment('0/fffffffe', 0), '1/0', 'increment path roll over')
    okay(Monotonic.asString.add('0/fffffffa', 5), '0/ffffffff', 'add no carry')
    okay(Monotonic.asString.add('0/fffffffa', 7), '0/100000001', 'add carry')
    okay(!Monotonic.asString.isBoundary('0/fffffffe', 0), 'is not boundary')
    okay(Monotonic.asString.isBoundary('fffffffe/0', 0), 'is boundary')
    okay(Monotonic.asString.compareIndex('0', '0', 0), 0, 'compare index')

    okay(Monotonic.Part.asString.difference('100000000', 'ffffffff'), 1, 'differnce')
    okay(Monotonic.asString.difference('100000000', 'fffffffe', 0), 2, 'difference 2')
    okay(Monotonic.asString.difference('fffffffe', '100000000', 0), -2, 'difference -2')

    okay(Monotonic.Part.asString.compare('0', '0'), 0, 'part difference')
    okay(Monotonic.Part.asString.increment('0'), '1', 'part increment')
    okay(Monotonic.Part.asString.add('0', 1), '1', 'part add')
}
