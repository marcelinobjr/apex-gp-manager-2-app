/// <reference path="../pb_data/types.d.ts" />
//
// APEX GP Manager 2.0 — FOUNDATION-01
// 0001 — Criação das collections do Catálogo Mestre.
//
// Entidades: teams, team_attributes, drivers, driver_attributes,
// engines, car_baselines, managers, manager_modifiers, circuits,
// assets_manifest — mais as estruturas de suporte à importação
// (catalog_versions e catalog_import_audit).
//
// Convenções desta fundação:
// - IDs canônicos (team_id, driver_id, ...) são campos próprios com
//   índice UNIQUE e marcados como hidden no update do frontend via
//   API rules ("updateRule" nega qualquer alteração de campo imutável).
// - Relações entre entidades usam campos relation (integridade nativa:
//   o PocketBase rejeita FK para registro inexistente = zero órfãos).
// - 1:1 garantido por índice UNIQUE na chave de relação.
// - Regras de acesso: leitura pública, escrita apenas por superusuário
//   (null) — catálogo é gerido por importação server-side.
//
migrate(
  (app) => {
    // ------------------------------------------------------------------
    // 1. catalog_versions — registro das versões de catálogo importadas
    // ------------------------------------------------------------------
    const catalogVersions = new Collection({
      name: 'catalog_versions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'version_code', type: 'text', required: true },
        { name: 'commit_sha', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
        { name: 'imported_at', type: 'date', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_catalog_versions_code ON catalog_versions (version_code)'],
    })
    app.save(catalogVersions)

    // ------------------------------------------------------------------
    // 2. catalog_import_audit — auditoria por execução de importação
    // ------------------------------------------------------------------
    const catalogImportAudit = new Collection({
      name: 'catalog_import_audit',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'execution_id', type: 'text', required: true },
        { name: 'entity', type: 'text', required: true },
        { name: 'source_file', type: 'text', required: true },
        { name: 'commit_sha', type: 'text', required: true },
        { name: 'file_hash', type: 'text', required: false },
        { name: 'catalog_version', type: 'text', required: false },
        { name: 'expected_count', type: 'number', required: false, onlyInt: true },
        { name: 'processed_count', type: 'number', required: false, onlyInt: true },
        { name: 'inserted_count', type: 'number', required: false, onlyInt: true },
        { name: 'updated_count', type: 'number', required: false, onlyInt: true },
        { name: 'rejected_count', type: 'number', required: false, onlyInt: true },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['pending', 'completed', 'rejected', 'failed'],
          maxSelect: 1,
        },
        { name: 'error_message', type: 'text', required: false },
        { name: 'started_at', type: 'date', required: false },
        { name: 'finished_at', type: 'date', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_audit_exec_entity ON catalog_import_audit (execution_id, entity)',
      ],
    })
    app.save(catalogImportAudit)

    // ------------------------------------------------------------------
    // 3. teams (33 esperados)
    // ------------------------------------------------------------------
    const teams = new Collection({
      name: 'teams',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'team_id', type: 'text', required: true, pattern: '^team_\\d{4}$' },
        { name: 'display_name', type: 'text', required: true },
        { name: 'code', type: 'text', required: true, max: 3 },
        { name: 'country_code', type: 'text', required: true, max: 2 },
        { name: 'primary_color_hex', type: 'text', required: false, pattern: '^#[0-9A-Fa-f]{6}$' },
        {
          name: 'secondary_color_hex',
          type: 'text',
          required: false,
          pattern: '^#[0-9A-Fa-f]{6}$',
        },
        { name: 'emblem_asset_id', type: 'text', required: false },
        { name: 'team_image_asset_id', type: 'text', required: false },
        { name: 'side_view_asset_id', type: 'text', required: false },
        { name: 'small_logo_asset_id', type: 'text', required: false },
        { name: 'active', type: 'bool', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_teams_team_id ON teams (team_id)'],
    })
    app.save(teams)

    // ------------------------------------------------------------------
    // 4. team_attributes (33 esperados; 1:1 com teams)
    // ------------------------------------------------------------------
    const teamAttributes = new Collection({
      name: 'team_attributes',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'team_id', type: 'text', required: true, pattern: '^team_\\d{4}$' },
        { name: 'team', type: 'relation', required: true, collectionId: teams.id, maxSelect: 1 },
        ...[
          'design_center_level',
          'cfd_cluster_level',
          'wind_tunnel_level',
          'industrial_structure_level',
          'factory_level',
          'operations_center_level',
          'pit_stop_center_level',
          'simulator_level',
          'driver_academy_level',
        ].map((n) => ({ name: n, type: 'number', required: true, onlyInt: true, min: 1, max: 5 })),
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_team_attributes_team_id ON team_attributes (team_id)',
        'CREATE UNIQUE INDEX idx_team_attributes_team_rel ON team_attributes (team)',
      ],
    })
    app.save(teamAttributes)

    // ------------------------------------------------------------------
    // 5. drivers (188 esperados)
    // ------------------------------------------------------------------
    const drivers = new Collection({
      name: 'drivers',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'driver_id', type: 'text', required: true, pattern: '^pil_\\d{4}$' },
        { name: 'display_name', type: 'text', required: true },
        { name: 'first_name', type: 'text', required: false },
        { name: 'last_name', type: 'text', required: false },
        { name: 'short_code', type: 'text', required: false, max: 3 },
        { name: 'nationality_code', type: 'text', required: false, max: 2 },
        { name: 'birth_date', type: 'text', required: false },
        {
          name: 'preferred_number',
          type: 'number',
          required: false,
          onlyInt: true,
          min: 0,
          max: 99,
        },
        { name: 'portrait_asset_id', type: 'text', required: false },
        { name: 'active', type: 'bool', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_drivers_driver_id ON drivers (driver_id)'],
    })
    app.save(drivers)

    // ------------------------------------------------------------------
    // 6. driver_attributes (188 esperados; 1:1 com drivers)
    // ------------------------------------------------------------------
    const driverAttributes = new Collection({
      name: 'driver_attributes',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'driver_id', type: 'text', required: true, pattern: '^pil_\\d{4}$' },
        {
          name: 'driver',
          type: 'relation',
          required: true,
          collectionId: drivers.id,
          maxSelect: 1,
        },
        {
          name: 'qualifying_pace',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        { name: 'race_pace', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'consistency', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'starts', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'overtaking', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'defending', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'wet_weather', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        {
          name: 'tyre_management',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        { name: 'adaptability', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        {
          name: 'technical_feedback',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'pressure_control',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        { name: 'teamwork', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'potential_max', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        {
          name: 'development_rate',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'personality',
          type: 'select',
          required: true,
          values: ['equilibrado', 'analitico', 'competitivo', 'agressivo', 'disciplinado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_driver_attributes_driver_id ON driver_attributes (driver_id)',
        'CREATE UNIQUE INDEX idx_driver_attributes_driver_rel ON driver_attributes (driver)',
      ],
    })
    app.save(driverAttributes)

    // ------------------------------------------------------------------
    // 7. engines (11 esperados)
    // ------------------------------------------------------------------
    const engines = new Collection({
      name: 'engines',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'engine_id', type: 'text', required: true, pattern: '^ENG-\\d{4}$' },
        { name: 'display_name', type: 'text', required: true },
        { name: 'country_code', type: 'text', required: true, max: 2 },
        { name: 'power', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'reliability', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        { name: 'efficiency', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        {
          name: 'development_potential',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'cost_tier',
          type: 'select',
          required: true,
          values: ['low', 'medium', 'high'],
          maxSelect: 1,
        },
        { name: 'logo_asset_id', type: 'text', required: false },
        { name: 'logo_file_path', type: 'text', required: false },
        { name: 'active', type: 'bool', required: false },
        // ENG-0006..ENG-0011: parâmetros PROPOSTOS (não homologados)
        { name: 'is_proposed', type: 'bool', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_engines_engine_id ON engines (engine_id)'],
    })
    app.save(engines)

    // ------------------------------------------------------------------
    // 8. car_baselines (33 esperados; 1:1 com teams)
    //    Catálogo-base: evolução JAMAIS sobrescreve — nova versão gera
    //    novo registro (por isso o índice único é team_id+versão).
    // ------------------------------------------------------------------
    const carBaselines = new Collection({
      name: 'car_baselines',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'team_id', type: 'text', required: true, pattern: '^team_\\d{4}$' },
        { name: 'baseline_version', type: 'text', required: true },
        { name: 'team', type: 'relation', required: true, collectionId: teams.id, maxSelect: 1 },
        { name: 'aero_downforce', type: 'number', required: true, onlyInt: true, min: 0, max: 100 },
        {
          name: 'aero_efficiency',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'mechanical_grip',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'chassis_balance',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'braking_performance',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'tyre_preservation',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'thermal_management',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        {
          name: 'chassis_reliability',
          type: 'number',
          required: true,
          onlyInt: true,
          min: 0,
          max: 100,
        },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: autodateOnUpdate() },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_car_baselines_team_ver ON car_baselines (team_id, baseline_version)',
      ],
    })
    app.save(carBaselines)

    // ------------------------------------------------------------------
    // 9. managers (6 esperados)
    // ------------------------------------------------------------------
    const managers = new Collection({
      name: 'managers',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'manager_id', type: 'text', required: true, pattern: '^mgr_\\d{4}$' },
        { name: 'display_order', type: 'number', required: true, onlyInt: true, min: 1, max: 99 },
        { name: 'archetype_code', type: 'text', required: true },
        { name: 'display_name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'headline_quote', type: 'text', required: false },
        { name: 'profile_text', type: 'text', required: false },
        { name: 'ideal_for_1', type: 'text', required: false },
        { name: 'ideal_for_2', type: 'text', required: false },
        { name: 'ideal_for_3', type: 'text', required: false },
        { name: 'signature', type: 'text', required: false },
        { name: 'image_asset_filename', type: 'text', required: false },
        { name: 'is_enabled', type: 'bool', required: false },
        { name: 'record_type', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_managers_manager_id ON managers (manager_id)'],
    })
    app.save(managers)

    // ------------------------------------------------------------------
    // 10. manager_modifiers (24 esperados; 4 por manager)
    //     modifier_value = profile_modifier_points (NÃO é percentual);
    //     mechanic_status preservado ("pending_gameplay_mapping").
    // ------------------------------------------------------------------
    const managerModifiers = new Collection({
      name: 'manager_modifiers',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'manager_id', type: 'text', required: true, pattern: '^mgr_\\d{4}$' },
        {
          name: 'manager',
          type: 'relation',
          required: true,
          collectionId: managers.id,
          maxSelect: 1,
        },
        { name: 'slot', type: 'number', required: true, onlyInt: true, min: 1, max: 4 },
        { name: 'modifier_target', type: 'text', required: true },
        {
          name: 'modifier_value',
          type: 'number',
          required: true,
          onlyInt: true,
          min: -100,
          max: 100,
        },
        {
          name: 'modifier_kind',
          type: 'select',
          required: true,
          values: ['bonus', 'penalty'],
          maxSelect: 1,
        },
        { name: 'unit', type: 'text', required: false },
        { name: 'mechanic_status', type: 'text', required: false },
        { name: 'source_image', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_manager_modifiers_mgr_slot ON manager_modifiers (manager_id, slot)',
      ],
    })
    app.save(managerModifiers)

    // ------------------------------------------------------------------
    // 11. circuits (43 IDs históricos; 41 ativos + 2 inativos reservados)
    // ------------------------------------------------------------------
    const circuits = new Collection({
      name: 'circuits',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'circuit_id', type: 'text', required: true, pattern: '^CIR-\\d{4}$' },
        { name: 'display_name', type: 'text', required: true },
        { name: 'country_code', type: 'text', required: true, max: 2 },
        { name: 'city', type: 'text', required: false },
        { name: 'length_km', type: 'number', required: false, min: 0 },
        { name: 'turn_count', type: 'number', required: false, onlyInt: true, min: 0 },
        { name: 'layout_asset_id', type: 'text', required: false },
        { name: 'active', type: 'bool', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'tipo', type: 'text', required: false },
        { name: 'configuracao_tracado', type: 'text', required: false },
        { name: 'sentido_corrida', type: 'text', required: false },
        { name: 'abrasividade', type: 'text', required: false },
        { name: 'exigencia_aerodinamica', type: 'text', required: false },
        { name: 'exigencia_motor', type: 'text', required: false },
        { name: 'exigencia_tracao', type: 'text', required: false },
        { name: 'exigencia_frenagem', type: 'text', required: false },
        { name: 'carga_lateral', type: 'text', required: false },
        { name: 'recuperacao_energia', type: 'text', required: false },
        { name: 'dificuldade_ultrapassagem', type: 'text', required: false },
        { name: 'perda_pit_stop_s', type: 'number', required: false, min: 0 },
        { name: 'tempo_volta_ref_s', type: 'number', required: false, min: 0 },
        { name: 'altitude_m', type: 'number', required: false, onlyInt: true },
        { name: 'observacoes', type: 'text', required: false },
        { name: 'svg_asset_id', type: 'text', required: false },
        { name: 'svg_path', type: 'text', required: false },
        { name: 'track_path_id', type: 'text', required: false },
        { name: 'svg_track_length_px', type: 'number', required: false, min: 0 },
        { name: 'svg_m_por_px', type: 'number', required: false, min: 0 },
        { name: 'start_finish_progress', type: 'number', required: false, min: 0, max: 1 },
        { name: 'race_direction', type: 'text', required: false },
        { name: 'pit_path_id', type: 'text', required: false },
        { name: 'pit_entry_progress', type: 'number', required: false, min: 0, max: 1 },
        { name: 'pit_exit_progress', type: 'number', required: false, min: 0, max: 1 },
        { name: 'fonte_dados', type: 'text', required: false },
        { name: 'pendencias_validacao', type: 'text', required: false },
        { name: 'start_line_progress', type: 'number', required: false, min: 0, max: 1 },
        { name: 'length_geo_km', type: 'number', required: false, min: 0 },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_circuits_circuit_id ON circuits (circuit_id)'],
    })
    app.save(circuits)

    // ------------------------------------------------------------------
    // 12. assets_manifest — SOMENTE o schema (CSV vazio, zero registros)
    // ------------------------------------------------------------------
    const assetsManifest = new Collection({
      name: 'assets_manifest',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'asset_id', type: 'text', required: true, pattern: '^AST-\\d{4}$' },
        { name: 'category', type: 'text', required: false },
        { name: 'file_path', type: 'text', required: false },
        { name: 'mime_type', type: 'text', required: false },
        { name: 'alt_text', type: 'text', required: false },
        { name: 'width_px', type: 'number', required: false, onlyInt: true, min: 0 },
        { name: 'height_px', type: 'number', required: false, onlyInt: true, min: 0 },
        { name: 'asset_version', type: 'text', required: false },
        { name: 'sha256', type: 'text', required: false },
        { name: 'source_reference', type: 'text', required: false },
        { name: 'rights_status', type: 'text', required: false },
        { name: 'active', type: 'bool', required: false },
        { name: 'notes', type: 'text', required: false },
        { name: 'created', type: 'autodate', onCreate: true },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_assets_manifest_asset_id ON assets_manifest (asset_id)'],
    })
    app.save(assetsManifest)
  },
  (app) => {
    const list = [
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
      'catalog_import_audit',
      'catalog_versions',
    ]
    for (let i = 0; i < list.length; i++) {
      try {
        const col = app.findCollectionByNameOrId(list[i])
        if (col) app.delete(col)
      } catch (_) {}
    }
  },
)
