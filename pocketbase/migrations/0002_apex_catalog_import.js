/// <reference path="../pb_data/types.d.ts" />
//
// APEX GP Manager 2.0 — FOUNDATION-01
// 0002 — Importação idempotente do Catálogo Mestre.
//
// Fonte canônica FIXADA (não usar HEAD/main):
//   https://github.com/marcelinobjr/apex-gp-manager-2-assets
//   commit 15f9d3052859536d75b44b007048044b7baeecb5
//
// Executa em cada apply da migration; é idempotente:
//   - mesmo version_code + mesmo commit_sha + mesmo file_hash => importação
//     anterior idêntica => no-op (0 inseridos, 0 atualizados, 0 rejeitados);
//   - registros existentes são localizados por ID canônico e comparados;
//     divergência de conteúdo NÃO é "corrigida": é reportada e rejeitada
//     (rejeita apenas se o CSV divergir; dados idênticos = no-op).
//   - divergência ESTRUTURAL do CSV (contagem/colunas) => PARAR e reportar
//     a divergência literal, sem corrigir silenciosamente.
//
// Estrutura importada:
//   catalog_versions (1) + catalog_import_audit (12 entidades)
//   teams 33, team_attributes 33, drivers 188, driver_attributes 188,
//   engines 11, car_baselines 33, managers 6, manager_modifiers 24,
//   circuits 43, assets_manifest 0 (schema pronto, CSV vazio).
//
var APEX_COMMIT_SHA = '15f9d3052859536d75b44b007048044b7baeecb5'
var APEX_BASE =
  'https://raw.githubusercontent.com/marcelinobjr/apex-gp-manager-2-assets/' + APEX_COMMIT_SHA + '/'
var APEX_CATALOG_VERSION = 'v01'

var APEX_TEAMS_COL = [
  'team_id',
  'display_name',
  'code',
  'country_code',
  'primary_color_hex',
  'secondary_color_hex',
  'emblem_asset_id',
  'team_image_asset_id',
  'side_view_asset_id',
  'small_logo_asset_id',
  'active',
  'notes',
]
var APEX_TEAM_ATTR_COL = [
  'team_id',
  'design_center_level',
  'cfd_cluster_level',
  'wind_tunnel_level',
  'industrial_structure_level',
  'factory_level',
  'operations_center_level',
  'pit_stop_center_level',
  'simulator_level',
  'driver_academy_level',
]
var APEX_DRIVERS_COL = [
  'driver_id',
  'display_name',
  'first_name',
  'last_name',
  'short_code',
  'nationality_code',
  'birth_date',
  'preferred_number',
  'portrait_asset_id',
  'active',
  'notes',
]
var APEX_DRIVER_ATTR_COL = [
  'driver_id',
  'qualifying_pace',
  'race_pace',
  'consistency',
  'starts',
  'overtaking',
  'defending',
  'wet_weather',
  'tyre_management',
  'adaptability',
  'technical_feedback',
  'pressure_control',
  'teamwork',
  'potential_max',
  'development_rate',
  'personality',
]
var APEX_ENGINES_COL = [
  'engine_id',
  'display_name',
  'country_code',
  'power',
  'reliability',
  'efficiency',
  'development_potential',
  'cost_tier',
  'logo_asset_id',
  'logo_file_path',
  'active',
  'notes',
]
var APEX_CAR_BASELINES_COL = [
  'team_id',
  'baseline_version',
  'aero_downforce',
  'aero_efficiency',
  'mechanical_grip',
  'chassis_balance',
  'braking_performance',
  'tyre_preservation',
  'thermal_management',
  'chassis_reliability',
]
var APEX_MANAGERS_COL = [
  'manager_id',
  'display_order',
  'archetype_code',
  'display_name',
  'role',
  'headline_quote',
  'profile_text',
  'ideal_for_1',
  'ideal_for_2',
  'ideal_for_3',
  'signature',
  'image_asset_filename',
  'is_enabled',
  'record_type',
]
var APEX_MANAGER_MOD_COL = [
  'manager_id',
  'slot',
  'modifier_target',
  'modifier_value',
  'modifier_kind',
  'unit',
  'mechanic_status',
  'source_image',
]
var APEX_CIRCUITS_COL = [
  'circuit_id',
  'display_name',
  'country_code',
  'city',
  'length_km',
  'turn_count',
  'layout_asset_id',
  'active',
  'notes',
  'tipo',
  'configuracao_tracado',
  'sentido_corrida',
  'abrasividade',
  'exigencia_aerodinamica',
  'exigencia_motor',
  'exigencia_tracao',
  'exigencia_frenagem',
  'carga_lateral',
  'recuperacao_energia',
  'dificuldade_ultrapassagem',
  'perda_pit_stop_s',
  'tempo_volta_ref_s',
  'altitude_m',
  'observacoes',
  'svg_asset_id',
  'svg_path',
  'track_path_id',
  'svg_track_length_px',
  'svg_m_por_px',
  'start_finish_progress',
  'race_direction',
  'pit_path_id',
  'pit_entry_progress',
  'pit_exit_progress',
  'fonte_dados',
  'pendencias_validacao',
  'start_line_progress',
  'length_geo_km',
]
var APEX_ASSETS_COL = [
  'asset_id',
  'category',
  'file_path',
  'mime_type',
  'alt_text',
  'width_px',
  'height_px',
  'asset_version',
  'sha256',
  'source_reference',
  'rights_status',
  'active',
  'notes',
]

var APEX_SOURCES = [
  { entity: 'teams', file: 'APEX2_catalogos_v01/teams.csv', columns: APEX_TEAMS_COL, expected: 33 },
  {
    entity: 'team_attributes',
    file: 'APEX2_catalogos_v01/team_attributes.csv',
    columns: APEX_TEAM_ATTR_COL,
    expected: 33,
  },
  {
    entity: 'drivers',
    file: 'APEX2_catalogos_v01/drivers.csv',
    columns: APEX_DRIVERS_COL,
    expected: 188,
  },
  {
    entity: 'driver_attributes',
    file: 'APEX2_catalogos_v01/driver_attributes.csv',
    columns: APEX_DRIVER_ATTR_COL,
    expected: 188,
  },
  {
    entity: 'engines',
    file: 'APEX2_catalogos_v01/engines.csv',
    columns: APEX_ENGINES_COL,
    expected: 11,
  },
  {
    entity: 'car_baselines',
    file: 'APEX2_catalogos_v01/car_baselines.csv',
    columns: APEX_CAR_BASELINES_COL,
    expected: 33,
  },
  {
    entity: 'managers',
    file: 'APEX2_catalogos_v01/managers.csv',
    columns: APEX_MANAGERS_COL,
    expected: 6,
  },
  {
    entity: 'manager_modifiers',
    file: 'APEX2_catalogos_v01/manager_modifiers.csv',
    columns: APEX_MANAGER_MOD_COL,
    expected: 24,
  },
  {
    entity: 'circuits',
    file: 'APEX2_circuitos_43/CSV/circuits.csv',
    columns: APEX_CIRCUITS_COL,
    expected: 43,
  },
  {
    entity: 'assets_manifest',
    file: 'APEX2_catalogos_v01/assets_manifest.csv',
    columns: APEX_ASSETS_COL,
    expected: 0,
  },
]

// --------------------------------------------------------------------
// Parser CSV RFC-4180 simplificado (aspas duplas, vírgulas internas,
// CRLF). Não usa expressões com lookbehind (goja).
// --------------------------------------------------------------------
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
      } else if (c !== '\r') {
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

function apexHasValue(row) {
  for (var i = 0; i < row.length; i++) {
    if (row[i] !== '') return true
  }
  return false
}

// --------------------------------------------------------------------
// Conversão por tipo de campo da collection
// --------------------------------------------------------------------
function apexToBool(v) {
  var s = String(v).trim().toLowerCase()
  if (s === 'true' || s === '1') return true
  if (s === 'false' || s === '0' || s === '') return false
  throw new Error('valor booleano inválido: ' + JSON.stringify(v))
}

function apexToNumber(v) {
  var s = String(v).trim()
  if (s === '') return null // null distinto de zero e de erro
  if (!/^-?\d+(\.\d+)?$/.test(s)) throw new Error('valor numérico inválido: ' + JSON.stringify(v))
  return Number(s)
}

function apexToText(v) {
  return String(v).trim() === '' ? '' : String(v)
}

function apexConvert(col, v) {
  var t = String(col.type)
  if (t === 'bool') return apexToBool(v)
  if (t === 'number') return apexToNumber(v)
  if (t === 'select') return String(v).trim()
  return apexToText(v)
}

// --------------------------------------------------------------------
// Fetch e hash
// --------------------------------------------------------------------
function apexFetch(url) {
  var res = $http.send({ url: url, method: 'GET', timeout: 60 })
  if (res.statusCode !== 200) {
    throw new Error('falha HTTP ' + res.statusCode + ' ao baixar ' + url)
  }
  return res.body
}

function apexFetchCsv(source) {
  var text = apexFetch(APEX_BASE + source.file)
  var hash = $security.sha256(text)
  var rows = apexParseCsv(text).filter(apexHasValue)
  if (rows.length === 0) {
    throw new Error('CSV vazio: ' + source.file)
  }
  var header = rows.shift()
  // Remove BOM da primeira coluna, se presente
  header[0] = header[0].replace(/^\uFEFF/, '')
  if (header.length !== source.columns.length) {
    throw new Error(
      'DIVERGÊNCIA ESTRUTURAL em ' +
        source.file +
        ': cabeçalho tem ' +
        header.length +
        ' colunas, esperadas ' +
        source.columns.length +
        '. Cabeçalho lido: ' +
        header.join('|'),
    )
  }
  for (var i = 0; i < source.columns.length; i++) {
    if (header[i] !== source.columns[i]) {
      throw new Error(
        'DIVERGÊNCIA ESTRUTURAL em ' +
          source.file +
          ': coluna ' +
          i +
          ' é "' +
          header[i] +
          '", esperada "' +
          source.columns[i] +
          '"',
      )
    }
  }
  for (var r = 0; r < rows.length; r++) {
    if (rows[r].length !== header.length) {
      throw new Error(
        'DIVERGÊNCIA ESTRUTURAL em ' +
          source.file +
          ': linha ' +
          (r + 1) +
          ' tem ' +
          rows[r].length +
          ' campos, esperados ' +
          header.length,
      )
    }
  }
  return { hash: hash, rows: rows }
}

// --------------------------------------------------------------------
// Audit helper
// --------------------------------------------------------------------
function apexAuditCol(app) {
  return app.findCollectionByNameOrId('catalog_import_audit')
}

function apexAuditWrite(app, entry) {
  var col = apexAuditCol(app)
  var rec = new Record(col)
  rec.set('execution_id', entry.execution_id)
  rec.set('entity', entry.entity)
  rec.set('source_file', entry.source_file)
  rec.set('commit_sha', entry.commit_sha)
  rec.set('file_hash', entry.file_hash)
  rec.set('catalog_version', entry.catalog_version)
  rec.set('expected_count', entry.expected_count)
  rec.set('processed_count', entry.processed_count)
  rec.set('inserted_count', entry.inserted_count)
  rec.set('updated_count', entry.updated_count)
  rec.set('rejected_count', entry.rejected_count)
  rec.set('status', entry.status)
  rec.set('error_message', entry.error_message)
  rec.set('started_at', entry.started_at)
  rec.set('finished_at', entry.finished_at)
  app.save(rec)
}

// --------------------------------------------------------------------
// Upsert idempotente por ID canônico.
// Retorna { inserted, updated, rejected }.
// --------------------------------------------------------------------
function apexIdFor(entity, canonicalId) {
  // PocketBase record id: [a-zA-Z0-9] 15 chars — usa o ID canônico
  // como id do registro (imutável, auditável, único).
  return canonicalId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 15)
}

function apexImportEntity(app, source, parsed, executionId, startedAt) {
  var col = app.findCollectionByNameOrId(source.entity)
  var idField = source.columns[0] // primeira coluna = ID canônico
  var inserted = 0
  var updated = 0
  var rejected = 0
  var seenIds = {}
  var errors = []

  for (var i = 0; i < parsed.rows.length; i++) {
    var raw = parsed.rows[i]
    var data = {}
    for (var c = 0; c < source.columns.length; c++) {
      var v = raw[c] === undefined ? '' : raw[c]
      try {
        data[source.columns[c]] = apexConvert(col.fields.getByName(source.columns[c]), v)
      } catch (err) {
        throw new Error(
          'DIVERGÊNCIA em ' +
            source.file +
            ' linha ' +
            (i + 1) +
            ' coluna "' +
            source.columns[c] +
            '": ' +
            err.message +
            ' (valor bruto: ' +
            JSON.stringify(v) +
            ')',
        )
      }
    }

    var canonicalId = String(data[idField])
    if (!canonicalId) {
      rejected++
      errors.push('linha ' + (i + 1) + ': ID canônico vazio')
      continue
    }
    if (seenIds[canonicalId]) {
      rejected++
      errors.push('linha ' + (i + 1) + ': ID canônico duplicado no CSV: ' + canonicalId)
      continue
    }
    seenIds[canonicalId] = true

    var recordId = apexIdFor(source.entity, canonicalId)
    var existing = null
    try {
      existing = app.findRecordById(source.entity, recordId)
    } catch (_) {
      existing = null
    }

    if (existing) {
      var changed = false
      for (var key in data) {
        if (String(existing.get(key)) !== String(data[key])) {
          changed = true
        }
      }
      if (!changed) {
        continue // no-op idempotente
      }
      // Conteúdo divergente: NÃO corrigir silenciosamente — reporta e rejeita.
      rejected++
      errors.push('linha ' + (i + 1) + ': registro ' + canonicalId + ' divergente do já importado')
      continue
    }

    var rec = new Record(col)
    rec.set('id', recordId)
    for (var key2 in data) {
      rec.set(key2, data[key2])
    }
    try {
      app.save(rec)
      inserted++
    } catch (err) {
      rejected++
      errors.push('linha ' + (i + 1) + ' (' + canonicalId + '): ' + err.message)
    }
  }

  if (parsed.rows.length !== source.expected) {
    throw new Error(
      'DIVERGÊNCIA ESTRUTURAL em ' +
        source.file +
        ': ' +
        parsed.rows.length +
        ' linhas de dados, esperadas ' +
        source.expected,
    )
  }

  var finishedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + '.000Z'
  apexAuditWrite(app, {
    execution_id: executionId,
    entity: source.entity,
    source_file: source.file,
    commit_sha: APEX_COMMIT_SHA,
    file_hash: parsed.hash,
    catalog_version: APEX_CATALOG_VERSION,
    expected_count: source.expected,
    processed_count: parsed.rows.length,
    inserted_count: inserted,
    updated_count: updated,
    rejected_count: rejected,
    status: rejected > 0 ? 'rejected' : 'completed',
    error_message: errors.length > 0 ? errors.slice(0, 20).join('; ') : '',
    started_at: startedAt,
    finished_at: finishedAt,
  })

  return { inserted: inserted, updated: updated, rejected: rejected, errors: errors }
}

// --------------------------------------------------------------------
// Derivações documentadas (não alteram o CSV, são campos derivados):
//   - engines.is_proposed: ENG-0006..ENG-0011 (notas do CSV declaram
//     "PROPOSTA DE BALANCEAMENTO" — status preservado, não homologado).
//   - driver_attributes relation "driver" e team_attributes/car_baselines
//     relation "team": resolvidas a partir dos IDs canônicos (1:1).
//   - manager_modifiers relation "manager": idem.
// --------------------------------------------------------------------
function apexResolveRelations(app) {
  // team_attributes.team e car_baselines.team
  var ta = app.findCollectionByNameOrId('team_attributes')
  var cb = app.findCollectionByNameOrId('car_baselines')
  var taRows = app.findRecordsByFilter('team_attributes', '', 'team_id', 0, 0)
  for (var i = 0; i < taRows.length; i++) {
    var teamId = taRows[i].getString('team_id')
    var team = app.findRecordsByFilter('teams', 'team_id="' + teamId + '"', '', 1, 0)
    if (team.length !== 1) {
      throw new Error('órfão team_attributes sem team: ' + teamId)
    }
    var r1 = taRows[i]
    r1.set('team', team[0].id)
    app.save(r1)
    var r1b = app.findRecordById('car_baselines', apexIdFor('car_baselines', teamId))
    r1b.set('team', team[0].id)
    app.save(r1b)
  }
  void cb

  // driver_attributes.driver
  var daRows = app.findRecordsByFilter('driver_attributes', '', 'driver_id', 0, 0)
  for (var j = 0; j < daRows.length; j++) {
    var driverId = daRows[j].getString('driver_id')
    var driver = app.findRecordsByFilter('drivers', 'driver_id="' + driverId + '"', '', 1, 0)
    if (driver.length !== 1) {
      throw new Error('órfão driver_attributes sem driver: ' + driverId)
    }
    var r2 = daRows[j]
    r2.set('driver', driver[0].id)
    app.save(r2)
  }

  // manager_modifiers.manager
  var mmRows = app.findRecordsByFilter('manager_modifiers', '', 'manager_id', 0, 0)
  for (var k = 0; k < mmRows.length; k++) {
    var mgrId = mmRows[k].getString('manager_id')
    var mgr = app.findRecordsByFilter('managers', 'manager_id="' + mgrId + '"', '', 1, 0)
    if (mgr.length !== 1) {
      throw new Error('órfão manager_modifiers sem manager: ' + mgrId)
    }
    var r3 = mmRows[k]
    r3.set('manager', mgr[0].id)
    app.save(r3)
  }

  // engines.is_proposed (ENG-0006..ENG-0011: PROPOSTA de balanceamento)
  var engRows = app.findRecordsByFilter('engines', '', 'engine_id', 0, 0)
  for (var m = 0; m < engRows.length; m++) {
    var engId = engRows[m].getString('engine_id')
    var num = Number(engId.replace('ENG-', ''))
    var proposed = num >= 6 && num <= 11
    engRows[m].set('is_proposed', proposed)
    app.save(engRows[m])
  }
}

// --------------------------------------------------------------------
// migrate
// --------------------------------------------------------------------
migrate(
  (app) => {
    // 0. Execução idempotente: já há execução completa com o MESMO
    //    commit_sha e MESMAS versões de arquivo? => no-op.
    var audits = app.findRecordsByFilter(
      'catalog_import_audit',
      'commit_sha="' + APEX_COMMIT_SHA + '" && status="completed"',
      '',
      0,
      0,
    )
    if (audits.length === APEX_SOURCES.length) {
      console.log('APEX import: já executada para commit ' + APEX_COMMIT_SHA + ' — no-op.')
      return
    }

    var executionId = 'exec_' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)
    var startedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + '.000Z'

    // Registra a versão do catálogo (idempotente)
    try {
      app.findFirstRecordByData('catalog_versions', 'version_code', APEX_CATALOG_VERSION)
    } catch (_) {
      var cv = new Record(app.findCollectionByNameOrId('catalog_versions'))
      cv.set('version_code', APEX_CATALOG_VERSION)
      cv.set('commit_sha', APEX_COMMIT_SHA)
      cv.set('description', 'Catálogo Mestre APEX2 v01 — commit ' + APEX_COMMIT_SHA)
      cv.set('imported_at', startedAt)
      app.save(cv)
    }

    // 1. Baixa e valida ESTRUTURA de todos os CSVs ANTES de inserir.
    var parsed = {}
    for (var i = 0; i < APEX_SOURCES.length; i++) {
      parsed[APEX_SOURCES[i].entity] = apexFetchCsv(APEX_SOURCES[i])
    }

    // 2. Importa (após validação completa das estruturas).
    var totals = { inserted: 0, updated: 0, rejected: 0 }
    for (var j = 0; j < APEX_SOURCES.length; j++) {
      var res = apexImportEntity(
        app,
        APEX_SOURCES[j],
        parsed[APEX_SOURCES[j].entity],
        executionId,
        startedAt,
      )
      totals.inserted += res.inserted
      totals.updated += res.updated
      totals.rejected += res.rejected
      console.log(
        'APEX import ' +
          APEX_SOURCES[j].entity +
          ': esperados ' +
          APEX_SOURCES[j].expected +
          ' / processados ' +
          parsed[APEX_SOURCES[j].entity].rows.length +
          ' / inseridos ' +
          res.inserted +
          ' / rejeitados ' +
          res.rejected,
      )
    }

    // 3. Deriva relations 1:1 a partir dos IDs canônicos (não são
    //    vínculos de gameplay; apenas integridade estrutural da fundação).
    apexResolveRelations(app)

    console.log(
      'APEX import concluída: inseridos ' +
        totals.inserted +
        ', atualizados ' +
        totals.updated +
        ', rejeitados ' +
        totals.rejected,
    )
  },
  (app) => {
    // down: limpa os registros importados (migrations ficam, dados não)
    var list = [
      'assets_manifest',
      'circuits',
      'manager_modifiers',
      'managers',
      'car_baselines',
      'engines',
      'driver_attributes',
      'drivers',
      'team_attributes',
      'teams',
    ]
    for (var i = 0; i < list.length; i++) {
      try {
        var col = app.findCollectionByNameOrId(list[i])
        app.truncateCollection(col)
      } catch (_) {}
    }
  },
)
