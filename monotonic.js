var toWords = function (string) {
    var padding = 8 - (string.length & 0x7)
    if (padding != 8) {
        string = '00000000'.substring(0, padding) + string
    }
    return string.match(/(.{1,8})/g).map(function (word) {
        return parseInt(word, 16)
    })
}

var toString = function (words) {
    var string = [ words[0].toString(16) ]
    for (var i = 1, I = words.length; i < I; i++) {
        string.push(('00000000000' + words[i].toString(16)).substr(-8))
    }
    var string = string.join('')
    return string
}

var Part = {
    toWords: toWords,
    toString: toString,
    compare: function (these, those) {
        var compare = these.length - those.length
        if (!compare) {
            for (var i = 0, I = these.length; i < I; i++) {
                compare = these[i] - those[i]
                if (compare) {
                    return compare
                }
            }
        }
        return compare
    },
    increment: function (words) {
        words = words.slice()
        for (var i = words.length - 1; i != -1; i--) {
            if (words[i] == 0xffffffff) {
                words[i] = 0
            } else {
                words[i]++
                break
            }
        }
        if (words[0] == 0) {
            words.unshift(0x1)
        }
        return words
    },
    add: function (words, value) {
        words = words.slice()
        var carry = value
        for (var i = words.length - 1; i != -1; i--) {
            words[i] += carry
            if (words[i] > 0xffffffff) {
                carry = Math.floor(words[i] / Math.pow(2, 32))
                words[i] = words[i] & 0xffffffff
            } else {
                carry = 0
            }
        }
        if (carry != 0) {
            words.unshift(carry)
        }
        return words
    },
    difference: function (these, those) {
        these = these.slice().reverse()
        those = those.slice().reverse()
        var difference = 0
        for (var i = 0, I = Math.max(these.length, those.length); i < I; i++) {
            difference += ((these[i] || 0) - (those[i] || 0)) * Math.pow(2, 32 * i)
        }
        return difference
    },
    asString: {
        toWords: toWords,
        toString: toString,
        compare: function (a, b) {
            return Part.compare(Part.toWords(a), Part.toWords(b))
        },
        increment: function (number) {
            return Part.toString(Part.increment(Part.toWords(number)))
        },
        add: function (number, value) {
            return Part.toString(Part.increment(Part.toWords(number)))
        },
        difference: function (a, b) {
            return Part.difference(Part.toWords(a), Part.toWords(b))
        }
    }
}

var toWords = function (number) {
    return number.split('/').map(function (part) { return Part.toWords(part) })
}

var toString = function (number) {
    return number.map(function (part) { return Part.toString(part) }).join('/')
}

var Path = {
    toWords: toWords,
    toString: toString,
    compare: function (a, b) {
        for (var i = 0, I = Math.min(a.length, b.length); i < I; i++) {
            var compare = Part.compare(a[i], b[i])
            if (compare) {
                return compare
            }
        }
        return a.length - b.length
    },
    compareIndex: function (a, b, index) {
        return Part.compare(a[index], b[index])
    },
    increment: function (number, index) {
        number = Path.toWords(Path.toString(number))
        number[index] = Part.increment(number[index])
        for (var i = index + 1, I = number.length; i < I; i++) {
            number[i] = [ 0 ]
        }
        return number
    },
    add: function (number, value) {
        number = Path.toWords(Path.toString(number))
        number[number.length - 1] = Part.add(number[number.length - 1], value)
        return number
    },
    difference: function (a, b, index) {
        return Part.difference(a[index], b[index])
    },
    isBoundary: function (number, index) {
        for (var i = index + 1, I = number.length; i < I; i++) {
            if (!(number[i].length == 1 && number[i][0] == 0)) {
                return false
            }
        }
        return true
    },
    Part: Part,
    asString: {
        toWords: toWords,
        toString: toString,
        compare: function (a, b) {
            return Path.compare(Path.toWords(a), Path.toWords(b))
        },
        compareIndex: function (a, b, index) {
            return Path.compareIndex(Path.toWords(a), Path.toWords(b), index)
        },
        increment: function (number, index) {
            return Path.toString(Path.increment(Path.toWords(number), index))
        },
        add: function (number, value) {
            return Path.toString(Path.add(Path.toWords(number), value))
        },
        isBoundary: function (number, index) {
            return Path.isBoundary(Path.toWords(number), index)
        },
        difference: function (a, b, index) {
            return Path.difference(Path.toWords(a), Path.toWords(b), index)
        }
    }
}

module.exports = Path
