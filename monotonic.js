var cadence = require('cadence')
var riffle = require('riffle')

function Forward (comparator, versions, iterator, record, visited, key, size) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visited = visited
    this._next = { record: record, key: key, size: size }
}

function valid (versions, visited) {
    return function (key) {
        visited[key.version] = true
        return versions[key.version]
    }
}

Forward.prototype.next = cadence(function (step) {
    if (!this._next) return []
    step(function () {
        var next = this._next
        step(function () {
            this._iterator.next(valid(this._versions, this._visited), step())
        }, function (record, key, size) {
            if (key && this._comparator(key.value, next.key.value) == 0) {
                next = { record: record, key: key, size: size }
            } else {
                this._next = record && { record: record, key: key, size: size }
                return [ step, next.record, next.key, next.size ]
            }
        })()
    })
})

Forward.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.forward = cadence(function (step, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: 0 } : null
    step(function () {
        riffle.forward(strata, composite, step())
    }, function (iterator) {
        step (function () {
            iterator.next(valid(versions, visited), step())
        }, function (record, key, size) {
            return new Forward(comparator, versions, iterator, record, visited, key, size)
        })
    })
})

function Reverse (comparator, versions, iterator, record, visited, key, size) {
    this._iterator = iterator
    this._comparator = comparator
    this._versions = versions
    this._visisted = visited
    this._next = { record: record, key: key, size: size }
}

Reverse.prototype.next = cadence(function (step) {
    if (!this._next) return []
    step(function () {
        var next = this._next
        step(function () {
            this._iterator.next(valid(this._versions, this._visisted), step())
        }, function (record, key, size) {
            if (!key || this._comparator(key.value, next.key.value) != 0) {
                this._next = record && { record: record, key: key, size: size }
                return [ step, next.record, next.key, next.size ]
            }
        })()
    })
})

Reverse.prototype.unlock = function (callback) {
    this._iterator.unlock(callback)
}

exports.reverse = cadence(function (step, strata, comparator, versions, visited, key) {
    var composite = key ? { value: key, version: Number.MAX_VALUE } : null
    step(function () {
        riffle.reverse(strata, composite, step())
    }, function (iterator) {
        step (function () {
            iterator.next(valid(versions, visited), step())
        }, function (record, key, size) {
            return new Reverse(comparator, versions, iterator, record, visited, key, size)
        })
    })
})
