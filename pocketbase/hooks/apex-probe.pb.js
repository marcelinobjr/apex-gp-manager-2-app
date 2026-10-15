// ============================================================
// APEX GP Manager 2.0 — Sonda de diagnóstico (TEMPORÁRIO)
// Busca os CSVs no commit fixado do repositório de assets
// (somente leitura, nada é alterado no repositório) e expõe a
// estrutura de cada arquivo para desenhar o schema da fundação.
// Este arquivo é de diagnóstico e será removido antes do commit.
// ============================================================

var APEX_SHA = '15f9d3052859536d75b44b007048044b7baeecb5'
var APEX_BASE =
  'https://raw.githubusercontent.com/marcelinobjr/apex-gp-manager-2-assets/' + APEX_SHA + '/'

var APEX_FILES = [
  'APEX2_catalogos_v01/teams.csv',
  'APEX2_catalogos_v01/team_attributes.csv',
  'APEX2_catalogos_v01/drivers.csv',
  'APEX2_catalogos_v01/driver_attributes.csv',
  'APEX2_catalogos_v01/engines.csv',
  'APEX2_catalogos_v01/car_baselines.csv',
  'APEX2_catalogos_v01/managers.csv',
  'APEX2_catalogos_v01/manager_modifiers.csv',
  'APEX2_catalogos_v01/assets_manifest.csv',
  'APEX2_circuitos_43/CSV/circuits.csv',
  'APEX2_circuitos_43/SHA256SUMS.txt',
]

function apexParseCsv(text) {
  var rows = []
  var row = []
  var field = ''
  var inQuotes = false
  for (var i = 0; i < text.length; i++) {
    var c = text.charAt(i)
    if (inQuotes) {
      if (c === '"') {
        if (text.charAt(i + 1) === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else {
      if (c === '"') {
        inQuotes = true
      } else if (c === ',') {
        row.push(field)
        field = ''
      } else if (c === '\n') {
        row.push(field)
        rows.push(row)
        row = []
        field = ''
      } else if (c === '\r') {
        // ignorado (CRLF)
      } else {
        field += c
      }
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

function apexIsNumeric(v) {
  return /^-?\d+(\.\d+)?$/.test(v)
}

function apexAnalyze(name, text) {
  var parsed = apexParseCsv(text)
  var data = []
  for (var r = 0; r < parsed.length; r++) {
    var row = parsed[r]
    var hasValue = false
    for (var c = 0; c < row.length; c++) {
      if (row[c] !== '') {
        hasValue = true
        break
      }
    }
    if (hasValue) data.push(row)
  }
  var header = data.length > 0 ? data.shift() : []
  var result = {
    file: name,
    sha256: $security.sha256(text),
    dataRows: data.length,
    header: header,
    raggedRows: [],
    samples: [],
    columns: [],
  }
  for (var ri = 0; ri < data.length; ri++) {
    if (data[ri].length !== header.length) {
      result.raggedRows.push({ row: ri + 1, cols: data[ri].length })
    }
  }
  result.samples = data.slice(0, 2)
  for (var ci = 0; ci < header.length; ci++) {
    var col = { name: header[ci], numeric: true, min: null, max: null, nulls: 0, distinct: null }
    var distinctMap = {}
    var distinctCount = 0
    for (var di = 0; di < data.length; di++) {
      var v = data[di][ci] === undefined ? '' : data[di][ci]
      if (v === '') {
        col.nulls++
        continue
      }
      if (col.numeric && !apexIsNumeric(v)) {
        col.numeric = false
      }
      if (col.numeric) {
        var n = Number(v)
        if (col.min === null || n < col.min) col.min = n
        if (col.max === null || n > col.max) col.max = n
      }
      if (distinctMap[v] === undefined) {
        distinctMap[v] = true
        distinctCount++
        if (distinctCount <= 12) {
          if (col.distinct === null) col.distinct = []
          col.distinct.push(v)
        }
      }
    }
    if (distinctCount > 12) col.distinct = null
    result.columns.push(col)
  }
  return result
}

routerAdd('GET /api/apex/probe', function (e) {
  var out = []
  for (var i = 0; i < APEX_FILES.length; i++) {
    try {
      var res = $http.send({ url: APEX_BASE + APEX_FILES[i], method: 'GET', timeout: 60 })
      if (res.statusCode !== 200) {
        out.push({ file: APEX_FILES[i], error: 'HTTP ' + res.statusCode })
        continue
      }
      if (APEX_FILES[i].indexOf('SHA256SUMS') !== -1) {
        out.push({ file: APEX_FILES[i], sha256: $security.sha256(res.body), content: res.body })
        continue
      }
      out.push(apexAnalyze(APEX_FILES[i], res.body))
    } catch (err) {
      out.push({ file: APEX_FILES[i], error: String(err) })
    }
  }
  e.json(200, { probe: 'apex-foundation', sha: APEX_SHA, results: out })
})
