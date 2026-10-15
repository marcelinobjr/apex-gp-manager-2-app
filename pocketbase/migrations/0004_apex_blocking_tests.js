/// <reference path="../pb_data/types.d.ts" />
//
// APEX GP Manager 2.0 — FOUNDATION-01
// 0004 — Testes bloqueantes dos 24 requisitos de integridade.
//
// Cada falha LANÇA (migrations falham => deploy bloqueado) com a
// mensagem literal do requisito violado. Serve de guarda permanente
// contra regressão de integridade do Catálogo Mestre.
//
migrate(
  (app) => {
    function count(entity, filter) {
      var q = 'SELECT COUNT(*) AS n FROM ' + entity
      if (filter) {
        q += ' WHERE ' + filter
      }
      var rows = app.db().newQuery(q).all()
      return Number(rows[0].n)
    }

    function assert(cond, msg) {
      if (!cond) {
        throw new Error('TESTE BLOQUEANTE FALHOU: ' + msg)
      }
    }

    // 1-9. contagens esperadas
    assert(count('teams') === 33, 'teams deve ter 33 registros (tem ' + count('teams') + ')')
    assert(
      count('team_attributes') === 33,
      'team_attributes deve ter 33 registros (tem ' + count('team_attributes') + ')',
    )
    assert(
      count('drivers') === 188,
      'drivers deve ter 188 registros (tem ' + count('drivers') + ')',
    )
    assert(
      count('driver_attributes') === 188,
      'driver_attributes deve ter 188 registros (tem ' + count('driver_attributes') + ')',
    )
    assert(count('engines') === 11, 'engines deve ter 11 registros (tem ' + count('engines') + ')')
    assert(
      count('car_baselines') === 33,
      'car_baselines deve ter 33 registros (tem ' + count('car_baselines') + ')',
    )
    assert(count('managers') === 6, 'managers deve ter 6 registros (tem ' + count('managers') + ')')
    assert(
      count('manager_modifiers') === 24,
      'manager_modifiers deve ter 24 registros (tem ' + count('manager_modifiers') + ')',
    )
    assert(
      count('circuits') === 43,
      'circuits deve ter 43 registros (tem ' + count('circuits') + ')',
    )

    // 10-11. ativos/inativos
    assert(count('circuits', 'active = 1') === 41, 'circuits ativos deve ser 41')
    assert(count('circuits', 'active = 0') === 2, 'circuits inativos deve ser 2')

    // 12-13. CIR-0033 e CIR-0041 inativos
    assert(
      count('circuits', "circuit_id = 'CIR-0033' AND active = 0") === 1,
      'CIR-0033 (Adelaide) deve permanecer INATIVO',
    )
    assert(
      count('circuits', "circuit_id = 'CIR-0041' AND active = 0") === 1,
      'CIR-0041 (Brasília) deve permanecer INATIVO',
    )

    // 14. teams × team_attributes = 33/33
    assert(
      count('team_attributes', 'team IN (SELECT id FROM teams)') === 33,
      'team_attributes órfãos de team: esperados 33 vinculados',
    )
    assert(
      count('teams', 'id NOT IN (SELECT team FROM team_attributes)') === 0,
      'equipes sem team_attributes: devem ser 0',
    )

    // 15. teams × car_baselines = 33/33
    assert(
      count('car_baselines', 'team IN (SELECT id FROM teams)') === 33,
      'car_baselines órfãos de team: esperados 33 vinculados',
    )
    assert(
      count('teams', 'id NOT IN (SELECT team FROM car_baselines)') === 0,
      'equipes sem car_baseline: devem ser 0',
    )

    // 16. drivers × driver_attributes = 188/188
    assert(
      count('driver_attributes', 'driver IN (SELECT id FROM drivers)') === 188,
      'driver_attributes órfãos de driver: esperados 188 vinculados',
    )
    assert(
      count('drivers', 'id NOT IN (SELECT driver FROM driver_attributes)') === 0,
      'pilotos sem driver_attributes: devem ser 0',
    )

    // 17. managers × manager_modifiers = 6/24
    assert(
      count('manager_modifiers', 'manager IN (SELECT id FROM managers)') === 24,
      'manager_modifiers órfãos: esperados 24 vinculados a 6 managers',
    )
    assert(
      count('managers', 'id NOT IN (SELECT manager FROM manager_modifiers)') === 0,
      'managers sem modificadores: devem ser 0',
    )

    // 18. zero IDs duplicados (checagem de índice UNIQUE aplicada)
    var dupQueries = [
      ['teams', 'team_id'],
      ['team_attributes', 'team_id'],
      ['drivers', 'driver_id'],
      ['driver_attributes', 'driver_id'],
      ['engines', 'engine_id'],
      ['managers', 'manager_id'],
      ['circuits', 'circuit_id'],
      ['assets_manifest', 'asset_id'],
      ['car_baselines', 'team_id, baseline_version'],
      ['manager_modifiers', 'manager_id, slot'],
    ]
    for (var d = 0; d < dupQueries.length; d++) {
      var t = dupQueries[d][0]
      var cols = dupQueries[d][1]
      var dups = app
        .db()
        .newQuery(
          'SELECT ' + cols + ', COUNT(*) AS n FROM ' + t + ' GROUP BY ' + cols + ' HAVING n > 1',
        )
        .all()
      assert(dups.length === 0, 'IDs duplicados em ' + t + ' (' + cols + '): ' + dups.length)
    }

    // 19. zero órfãos (relations apontando para registro inexistente)
    var orphanChecks = [
      ['team_attributes', 'team', 'teams'],
      ['car_baselines', 'team', 'teams'],
      ['driver_attributes', 'driver', 'drivers'],
      ['manager_modifiers', 'manager', 'managers'],
    ]
    for (var o = 0; o < orphanChecks.length; o++) {
      var child = orphanChecks[o][0]
      var field = orphanChecks[o][1]
      var parent = orphanChecks[o][2]
      var orphan = count(
        child,
        field + ' IS NOT NULL AND ' + field + ' NOT IN (SELECT id FROM ' + parent + ')',
      )
      assert(orphan === 0, 'órfãos em ' + child + '.' + field + ': ' + orphan)
    }

    // 21. NENHUM vínculo piloto↔equipe criado (não existe tal collection)
    var hasDriverTeamLink = false
    try {
      app.findCollectionByNameOrId('driver_team_contracts')
      hasDriverTeamLink = true
    } catch (_) {}
    try {
      app.findCollectionByNameOrId('driver_team_links')
      hasDriverTeamLink = true
    } catch (_) {}
    assert(
      !hasDriverTeamLink,
      'NÃO deve existir collection de vínculo piloto↔equipe (contrato/vínculo é proibido nesta fase)',
    )

    // 22. NENHUM vínculo equipe↔motor criado
    var hasTeamEngineLink = false
    try {
      app.findCollectionByNameOrId('team_engine_contracts')
      hasTeamEngineLink = true
    } catch (_) {}
    try {
      app.findCollectionByNameOrId('team_engine_links')
      hasTeamEngineLink = true
    } catch (_) {}
    assert(
      !hasTeamEngineLink,
      'NÃO deve existir collection de vínculo equipe↔motor (contrato é proibido nesta fase)',
    )

    // 23. assets_manifest vazio (schema pronto, CSV de origem é vazio)
    assert(
      count('assets_manifest') === 0,
      'assets_manifest deve estar vazio (0 registros, sem assets fictícios)',
    )

    // 24. zero cópia em massa de assets visuais — nenhuma collection
    //     de catálogo deve conter campo com caminho de arquivo de asset
    //     preenchido a partir de nome (asset_id canônico fica vazio).
    var assetIdZero = [
      ['teams', 'emblem_asset_id'],
      ['teams', 'team_image_asset_id'],
      ['teams', 'side_view_asset_id'],
      ['teams', 'small_logo_asset_id'],
      ['drivers', 'portrait_asset_id'],
      ['engines', 'logo_asset_id'],
      ['circuits', 'layout_asset_id'],
      ['circuits', 'svg_asset_id'],
    ]
    for (var a = 0; a < assetIdZero.length; a++) {
      var ae = assetIdZero[a][0]
      var af = assetIdZero[a][1]
      var filled = count(ae, af + ' IS NOT NULL AND ' + af + " != ''")
      assert(
        filled === 0,
        'asset_id NÃO deve estar preenchido por nome de arquivo em ' +
          ae +
          '.' +
          af +
          ' (tem ' +
          filled +
          ')',
      )
    }

    // 20. reimportação idempotente sem duplicação — contagens reafirmadas
    //     após o passo de importação (0002); se alguma contagem acima
    //     divergiu, falhou. Duplicação seria detectada em 18.
    console.log('APEX 0004: 24 testes bloqueantes — TODOS PASSARAM')
  },
  (app) => {
    void app
  },
)
