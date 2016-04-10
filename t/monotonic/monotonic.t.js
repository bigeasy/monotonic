require('proof')(17, prove)

function prove (assert) {
    var Monotonic = require('../..')

    assert(Monotonic.toString(Monotonic.toWords('88888888/888888888')), '88888888/888888888', 'parse')
    assert(Monotonic.asString.compare('0', '0'), 0, 'compare equal')
    assert(Monotonic.asString.compare('100000000', 'ffffffff') > 0, 'compare longer than')
    assert(Monotonic.asString.compare('fffffffe', 'ffffffff') < 0, 'compare less than')
    assert(Monotonic.asString.compare('ffffffff', 'fffffffe') > 0, 'compare less than')
    assert(Monotonic.asString.compare('ffffffff', 'fffffffe') > 0, 'compare less than')
    assert(Monotonic.asString.increment('0/ffffffff', 1), '0/100000000', 'increment roll over')
    assert(Monotonic.asString.increment('0/fffffffe', 1), '0/ffffffff', 'increment roll over')
    assert(Monotonic.asString.increment('0/fffffffe', 0), '1/0', 'increment path roll over')
    assert(!Monotonic.asString.isBoundary('0/fffffffe', 0), 'is not boundary')
    assert(Monotonic.asString.isBoundary('fffffffe/0', 0), 'is boundary')
    assert(Monotonic.asString.compareIndex('0', '0', 0), 0, 'compare index')

    assert(Monotonic.Part.asString.difference('100000000', 'ffffffff'), 1, 'differnce')
    assert(Monotonic.asString.difference('100000000', 'fffffffe', 0), 2, 'difference 2')
    assert(Monotonic.asString.difference('fffffffe', '100000000', 0), -2, 'difference -2')

    assert(Monotonic.Part.asString.compare('0', '0'), 0, 'part difference')
    assert(Monotonic.Part.asString.increment('0'), '1', 'part increment')
}
