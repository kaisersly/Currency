var test = new TestJs("document");

var Change = function (from, to, rate) {
    var Change = {
        from: from,
        to: to,
        rate: rate,
        direction: "from"
    }
    Change.convert = function (value, direction) {
        var convertedValue;
        direction = direction || this.direction;
        if (direction === "to") {
            convertedValue = value / this.rate;
        } else {
            convertedValue = value * this.rate;
        }
        return convertedValue;
    };
    Change.copy = function () {
        return Object.create(Change);
    };
    return Change;
}

var change = new Change("EUR", "YEN", 120);
test.assert(change.from, "EUR", "from: EUR");
test.assert(change.to, "YEN", "to: YEN");
test.assert(change.rate, 120, "rate: 120");

test.assert(change.convert(1), 120, "convert 1 EUR to 120 YEN");
test.assert(change.convert(1, "from"), 120, "convert 1 EUR to 120 YEN");
test.assert(change.convert(120, "to"), 1, "convert 120 YEN to 1 EUR");
change.direction = "to";
test.assert(change.convert(120), 1, "convert 120 YEN to 1 EUR");

test.clear();

var ChangeList = function (changes) {
    var ChangeList = {};
    if (changes) {
        ChangeList.changes = changes;
    } else {
        ChangeList.changes = [];
    }
    ChangeList.find = function (from, to, copy) {
        if (copy === undefined) {
            copy = true;
        }
        var changeToReturn;
        ChangeList.changes.forEach(function (change){
            if (change.from === from && change.to === to) {
                changeToReturn = copy ? change.copy() : change;
            } else if (change.from === to && change.to === from) {
                if (copy) {
                    changeToReturn = change.copy();
                    changeToReturn.direction = "to";
                } else {
                    changeToReturn = change;
                }
            }
        });
        return changeToReturn;
    };
    ChangeList.findId = function (from, to) {
        var change = ChangeList.find(from, to, false);
        return ChangeList.changes.indexOf(change);
    };
//    Find and Update or Create
    ChangeList.add = function (from, to, rate) {
        var change = ChangeList.find(from, to, false);
        if (change) {
            if (change.from === from) {
                change.rate = rate;
            } else {
                change.rate = 1/rate;
            }
        } else {
            change = new Change(from, to, rate);
            changeList.changes.push(change);
        }
        ChangeList.changes
        return change;
    };
    
    ChangeList.destroy = function (from, to) {
        var id = ChangeList.findId(from, to);
        ChangeList.changes.splice(id, 1);
    }
    
    return ChangeList;
}

var changes = [
    new Change("EUR", "YEN", 120),
    new Change("EUR", "USD", 1.28)
]
var changeList = new ChangeList(changes);
test.assert(changeList.find("EUR", "YEN").convert(1), 120, "find EUR to YEN and change 1 EUR to 120 YEN" );
test.assert(changeList.find("YEN", "EUR").convert(120), 1, "find YEN to EUR and change 120 YEN to 1 EUR" );
test.assert(changeList.find("EUR", "USD").convert(10), 12.8, "find EUR to USD and change 10 EUR to 12.8 USD" );
changeList.destroy("EUR", "YEN");
test.assert(changeList.find("EUR", "YEN"), undefined, "EUR to YEN is deleted");
test.assert(changeList.add("EUR", "USD", 1.27).convert(1), 1.27, "update EUR to USD and convert 1 EUR to 1.27 USD");
test.assert(changeList.add("EUR", "YEN", 115).convert(1), 115, "create EUR to YEN and convert 1 EUR to 115 YEN");
test.assert(changeList.add("YEN", "EUR", 1/115).convert(1), 115, "update YEN to EUR and convert 1 EUR to 115 YEN");

test.clear();



var Currency = function (name, symbol) {
    var Currency = {
        name: name,
        symbol: symbol
    };
    
    return Currency;
}

var yen = new Currency("YEN", "Y");
test.assert(yen.name, "YEN", "name is YEN");
test.assert(yen.symbol, "Y", "symbol is Y");

test.clear();



var CurrencyList = function (currencies) {
    var CurrencyList = {};
    if (currencies) {
        CurrencyList.currencies = currencies;
    } else {
        CurrencyList.currencies = [];
    }
    CurrencyList.find = function (name) {
        var currency;
        CurrencyList.currencies.forEach(function (c) {
            if (c.name === name) {
                currency = c;
            }
        });
        return currency;
    };
//    Find and Update or Create
    CurrencyList.add = function (name, symbol) {
        var currency = CurrencyList.find(name);     
        if (currency) {
            currency.symbol = symbol;
        } else {
            currency = new Currency(name, symbol);
            CurrencyList.currencies.push(currency);
        }
        return currency;
    };
    
    return CurrencyList;
}

var currencies = [
    new Currency("EUR", "E")
];
var currencyList = new CurrencyList(currencies);
test.assert(currencyList.find("EUR").name, "EUR", "find EUR");
test.assert(currencyList.add("YEN", "Y").symbol, "Y", "create YEN");
test.assert(currencyList.add("EUR", "e").symbol, "e", "update EUR");
test.assert(currencyList.currencies.length, 2, "currencies has 2 items");