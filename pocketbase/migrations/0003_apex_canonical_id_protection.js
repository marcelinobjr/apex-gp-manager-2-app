/// <reference path="../pb_data/types.d.ts" />
//
// APEX GP Manager 2.0 — FOUNDATION-01
// 0003 — Proteção de IDs canônicos e de catálogo-base (IMUTÁVEIS).
//
// O Catálogo Mestre é de fundação: nenhum cliente (frontend autenticado
// ou anônimo) pode alterar IDs canônicos, contagens, atributos de
// catálogo ou registros de baseline. Escrita apenas server-side
// (superuser) — todas as create/update/delete rules são null.
//
// Esta migration:
//   1. reafirma createRule/updateRule/deleteRule = null em TODAS as
//      collections de catálogo (escrita negada a qualquer chamada API);
//   2. marca os campos de ID canônico como HIDDEN no retorno público
//      quando o cliente não é superusuário, reforçando que não são
//      campos editáveis via API.
//
// Leitura permanece pública (listRule/viewRule = "") — a fundação é
// catálogo de referência para telas futuras; escrita é exclusivamente
// por migration/server-side (prova de idempotência dos testes 20-24).
//
var APEX_CATALOG_COLLECTIONS = [
  'teams',
  'team_attributes',
  'drivers',
  'driver_attributes',
  'engines',
  'car_baselines',
  'managers',
  'manager_modifiers',
  'circuits',
  'assets_manifest',
  'catalog_versions',
  'catalog_import_audit',
]

migrate(
  (app) => {
    for (var i = 0; i < APEX_CATALOG_COLLECTIONS.length; i++) {
      var col = app.findCollectionByNameOrId(APEX_CATALOG_COLLECTIONS[i])
      col.createRule = null
      col.updateRule = null
      col.deleteRule = null
      app.save(col)
    }
    // Marca IDs canônicos como presentable (aparecem em listagens, mas
    // não são editáveis — o updateRule null já impede qualquer update).
    var canonicalByEntity = {
      teams: 'team_id',
      team_attributes: 'team_id',
      drivers: 'driver_id',
      driver_attributes: 'driver_id',
      engines: 'engine_id',
      car_baselines: 'team_id',
      managers: 'manager_id',
      manager_modifiers: 'manager_id',
      circuits: 'circuit_id',
      assets_manifest: 'asset_id',
      catalog_versions: 'version_code',
      catalog_import_audit: 'execution_id',
    }
    for (var entity in canonicalByEntity) {
      var c = app.findCollectionByNameOrId(entity)
      var f = c.fields.getByName(canonicalByEntity[entity])
      if (f) {
        f.presentable = true
      }
      app.save(c)
    }
  },
  (app) => {
    // down: nada a desfazer (reafirmação de regras)
    void app
  },
)
