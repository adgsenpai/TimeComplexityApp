//# ************************************************************************
//# Ashlin Darius Govindasamy - ADGSTUDIOS 2021
//# All rights reserved.
//# security.js - Last modified: 2020-04-24T11:59:00.959Z
//# ************************************************************************

function deleteAllCookies() {
  for (var e = document.cookie.split(';'), t = 0; t < e.length; t++) {
    var o = e[t],
      n = o.indexOf('='),
      c = n > -1 ? o.substr(0, n) : o
    document.cookie = c + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
function logout() {
  deleteAllCookies(),
    document.cookie.split(';').forEach(function (e) {
      document.cookie = e
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    }),
    (document.location.href = 'https://adgstudios.co.za/logout')

    
}
