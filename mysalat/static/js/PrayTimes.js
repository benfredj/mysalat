function PrayTimes(t) {
    var i, a, n, r, s, e = {
            imsak: "Imsak",
            fajr: "Fajr",
            sunrise: "Sunrise",
            dhuhr: "Dhuhr",
            asr: "Asr",
            sunset: "Sunset",
            maghrib: "Maghrib",
            isha: "Isha",
            midnight: "Midnight"
        },
        h = {
            MWL: {
                name: "Muslim World League",
                params: {
                    fajr: 18,
                    isha: 17
                }
            },
            ISNA: {
                name: "Islamic Society of North America (ISNA)",
                params: {
                    fajr: 15,
                    isha: 15
                }
            },
            Egypt: {
                name: "Egyptian General Authority of Survey",
                params: {
                    fajr: 19.5,
                    isha: 17.5
                }
            },
            Makkah: {
                name: "Umm Al-Qura University, Makkah",
                params: {
                    fajr: 18.5,
                    isha: "90 min"
                }
            },
            Karachi: {
                name: "University of Islamic Sciences, Karachi",
                params: {
                    fajr: 18,
                    isha: 18
                }
            },
            Tehran: {
                name: "Institute of Geophysics, University of Tehran",
                params: {
                    fajr: 17.7,
                    isha: 14,
                    maghrib: 4.5,
                    midnight: "Jafari"
                }
            },
            Jafari: {
                name: "Shia Ithna-Ashari, Leva Institute, Qum",
                params: {
                    fajr: 16,
                    isha: 14,
                    maghrib: 4,
                    midnight: "Jafari"
                }
            }
        },
        u = {
            maghrib: "0 min",
            midnight: "Standard"
        },
        o = "Makkah",
        f = {
            imsak: "10 min",
            dhuhr: "0 min",
            asr: "Standard",
            highLats: "NightMiddle"
        },
        m = "24h",
        c = ["am", "pm"],
        g = "-----",
        d = 1,
        M = {},
        l = u;
    for (var v in h) {
        var D = h[v].params;
        for (var T in l) "undefined" == typeof D[T] && (D[T] = l[T])
    }
    o = h[t] ? t : o;
    var D = h[o].params;
    for (var j in D) f[j] = D[j];
    for (var v in e) M[v] = 0;
    return {
        setMethod: function(t) {
            h[t] && (this.adjust(h[t].params), o = t)
        },
        adjust: function(t) {
            for (var i in t) f[i] = t[i]
        },
        tune: function(t) {
            for (var i in t) M[i] = t[i]
        },
        getMethod: function() {
            return o
        },
        getMethodName: function() { //wiss:added
            return h[o].name
        },
        getSetting: function() {
            return f
        },
        getOffsets: function() {
            return M
        },
        getDefaults: function() {
            return h
        },
        getTimes: function(t, e, h, u, o) {
            return i = 1 * e[0], a = 1 * e[1], n = e[2] ? 1 * e[2] : 0, m = o || m, t.constructor === Date && (t = [t.getFullYear(), t.getMonth() + 1, t.getDate()]), ("undefined" == typeof h || "auto" == h) && (h = this.getTimeZone(t)), ("undefined" == typeof u || "auto" == u) && (u = this.getDst(t)), r = 1 * h + (1 * u ? 1 : 0), s = this.julian(t[0], t[1], t[2]) - a / 360, this.computeTimes()
        },
        getFormattedTime: function(t, i, a) {
            if (isNaN(t)) return g;
            if ("Float" == i) return t;
            a = a || c, t = DMath.fixHour(t + .5 / 60);
            var n = Math.floor(t),
                r = Math.floor(60 * (t - n)),
                s = "12h" == i ? a[12 > n ? 0 : 1] : "",
                e = "24h" == i ? this.twoDigitsFormat(n) : (n + 12 - 1) % 12 + 1;
            return e + ":" + this.twoDigitsFormat(r) + (s ? " " + s : "")
        },
        midDay: function(t) {
            var i = this.sunPosition(s + t).equation,
                a = DMath.fixHour(12 - i);
            return a
        },
        sunAngleTime: function(t, a, n) {
            var r = this.sunPosition(s + a).declination,
                e = this.midDay(a),
                h = 1 / 15 * DMath.arccos((-DMath.sin(t) - DMath.sin(r) * DMath.sin(i)) / (DMath.cos(r) * DMath.cos(i)));
            return e + ("ccw" == n ? -h : h)
        },
        asrTime: function(t, a) {
            var n = this.sunPosition(s + a).declination,
                r = -DMath.arccot(t + DMath.tan(Math.abs(i - n)));
            return this.sunAngleTime(r, a)
        },
        sunPosition: function(t) {
            var i = t - 2451545,
                a = DMath.fixAngle(357.529 + .98560028 * i),
                n = DMath.fixAngle(280.459 + .98564736 * i),
                r = DMath.fixAngle(n + 1.915 * DMath.sin(a) + .02 * DMath.sin(2 * a)),
                s = (1.00014 - .01671 * DMath.cos(a) - 14e-5 * DMath.cos(2 * a), 23.439 - 3.6e-7 * i),
                e = DMath.arctan2(DMath.cos(s) * DMath.sin(r), DMath.cos(r)) / 15,
                h = n / 15 - DMath.fixHour(e),
                u = DMath.arcsin(DMath.sin(s) * DMath.sin(r));
            return {
                declination: u,
                equation: h
            }
        },
        julian: function(t, i, a) {
            2 >= i && (t -= 1, i += 12);
            var n = Math.floor(t / 100),
                r = 2 - n + Math.floor(n / 4),
                s = Math.floor(365.25 * (t + 4716)) + Math.floor(30.6001 * (i + 1)) + a + r - 1524.5;
            return s
        },
        computePrayerTimes: function(t) {
            t = this.dayPortion(t);
            var i = f,
                a = this.sunAngleTime(this.eval(i.imsak), t.imsak, "ccw"),
                n = this.sunAngleTime(this.eval(i.fajr), t.fajr, "ccw"),
                r = this.sunAngleTime(this.riseSetAngle(), t.sunrise, "ccw"),
                s = this.midDay(t.dhuhr),
                e = this.asrTime(this.asrFactor(i.asr), t.asr),
                h = this.sunAngleTime(this.riseSetAngle(), t.sunset),
                u = this.sunAngleTime(this.eval(i.maghrib), t.maghrib),
                o = this.sunAngleTime(this.eval(i.isha), t.isha);
            return {
                imsak: a,
                fajr: n,
                sunrise: r,
                dhuhr: s,
                asr: e,
                sunset: h,
                maghrib: u,
                isha: o
            }
        },
        computeTimes: function() {
            for (var t = {
                    imsak: 5,
                    fajr: 5,
                    sunrise: 6,
                    dhuhr: 12,
                    asr: 13,
                    sunset: 18,
                    maghrib: 18,
                    isha: 18
                }, i = 1; d >= i; i++) t = this.computePrayerTimes(t);
            return t = this.adjustTimes(t), t.midnight = "Jafari" == f.midnight ? t.sunset + this.timeDiff(t.sunset, t.fajr) / 2 : t.sunset + this.timeDiff(t.sunset, t.sunrise) / 2, t = this.tuneTimes(t), this.modifyFormats(t)
        },
        adjustTimes: function(t) {
            var i = f;
            for (var n in t) t[n] += r - a / 15;
            return "None" != i.highLats && (t = this.adjustHighLats(t)), this.isMin(i.imsak) && (t.imsak = t.fajr - this.eval(i.imsak) / 60), this.isMin(i.maghrib) && (t.maghrib = t.sunset + this.eval(i.maghrib) / 60), this.isMin(i.isha) && (t.isha = t.maghrib + this.eval(i.isha) / 60), t.dhuhr += this.eval(i.dhuhr) / 60, t
        },
        asrFactor: function(t) {
            var i = {
                Standard: 1,
                Hanafi: 2
            }[t];
            return i || this.eval(t)
        },
        riseSetAngle: function() {
            var t = .0347 * Math.sqrt(n);
            return .833 + t
        },
        tuneTimes: function(t) {
            for (var i in t) t[i] += M[i] / 60;
            return t
        },
        modifyFormats: function(t) {
            for (var i in t) t[i] = this.getFormattedTime(t[i], m);
            return t
        },
        adjustHighLats: function(t) {
            var i = f,
                a = this.timeDiff(t.sunset, t.sunrise);
            return t.imsak = this.adjustHLTime(t.imsak, t.sunrise, this.eval(i.imsak), a, "ccw"), t.fajr = this.adjustHLTime(t.fajr, t.sunrise, this.eval(i.fajr), a, "ccw"), t.isha = this.adjustHLTime(t.isha, t.sunset, this.eval(i.isha), a), t.maghrib = this.adjustHLTime(t.maghrib, t.sunset, this.eval(i.maghrib), a), t
        },
        adjustHLTime: function(t, i, a, n, r) {
            var s = this.nightPortion(a, n),
                e = "ccw" == r ? this.timeDiff(t, i) : this.timeDiff(i, t);
            return (isNaN(t) || e > s) && (t = i + ("ccw" == r ? -s : s)), t
        },
        nightPortion: function(t, i) {
            var a = f.highLats,
                n = .5;
            return "AngleBased" == a && (n = 1 / 60 * t), "OneSeventh" == a && (n = 1 / 7), n * i
        },
        dayPortion: function(t) {
            for (var i in t) t[i] /= 24;
            return t
        },
        getTimeZone: function(t) {
            var i = t[0],
                a = this.gmtOffset([i, 0, 1]),
                n = this.gmtOffset([i, 6, 1]);
            return Math.min(a, n)
        },
        getDst: function(t) {
            return 1 * (this.gmtOffset(t) != this.getTimeZone(t))
        },
        gmtOffset: function(t) {
            var i = new Date(t[0], t[1] - 1, t[2], 12, 0, 0, 0),
                a = i.toGMTString(),
                n = new Date(a.substring(0, a.lastIndexOf(" ") - 1)),
                r = (i - n) / 36e5;
            return r
        },
        eval: function(t) {
            return 1 * (t + "").split(/[^0-9.+-]/)[0]
        },
        isMin: function(t) {
            return -1 != (t + "").indexOf("min")
        },
        timeDiff: function(t, i) {
            return DMath.fixHour(i - t)
        },
        twoDigitsFormat: function(t) {
            return 10 > t ? "0" + t : t
        }
    }
}
var DMath = {
        dtr: function(t) {
            return t * Math.PI / 180
        },
        rtd: function(t) {
            return 180 * t / Math.PI
        },
        sin: function(t) {
            return Math.sin(this.dtr(t))
        },
        cos: function(t) {
            return Math.cos(this.dtr(t))
        },
        tan: function(t) {
            return Math.tan(this.dtr(t))
        },
        arcsin: function(t) {
            return this.rtd(Math.asin(t))
        },
        arccos: function(t) {
            return this.rtd(Math.acos(t))
        },
        arctan: function(t) {
            return this.rtd(Math.atan(t))
        },
        arccot: function(t) {
            return this.rtd(Math.atan(1 / t))
        },
        arctan2: function(t, i) {
            return this.rtd(Math.atan2(t, i))
        },
        fixAngle: function(t) {
            return this.fix(t, 360)
        },
        fixHour: function(t) {
            return this.fix(t, 24)
        },
        fix: function(t, i) {
            return t -= i * Math.floor(t / i), 0 > t ? t + i : t
        }
    },
    prayTimes = new PrayTimes;