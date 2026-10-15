/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // 1. Create collection bootstrap_approval
    const bootstrapApproval = new Collection({
      name: 'bootstrap_approval',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'id',
          type: 'text',
          primaryKey: true,
        },
        {
          name: 'approved',
          type: 'bool',
          required: false,
        },
        {
          name: 'notes',
          type: 'text',
          required: false,
        },
        {
          name: 'decision_status',
          type: 'text',
          required: false,
        },
        {
          name: 'authorized_by',
          type: 'text',
          required: false,
        },
        {
          name: 'next_task',
          type: 'text',
          required: false,
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
    })
    app.save(bootstrapApproval)

    // 2. Create collection project_files
    const projectFiles = new Collection({
      name: 'project_files',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'id',
          type: 'text',
          primaryKey: true,
        },
        {
          name: 'file_name',
          type: 'text',
          required: true,
        },
        {
          name: 'file_type',
          type: 'text',
          required: false,
        },
        {
          name: 'content',
          type: 'text',
          required: false,
        },
        {
          name: 'version',
          type: 'text',
          required: false,
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
    })
    app.save(projectFiles)

    // 3. Seed Owner User: m.blasques@multi.br.com / Skip@Pass
    const users = app.findCollectionByNameOrId('users')
    try {
      const existing = app.findAuthRecordByEmail('users', 'm.blasques@multi.br.com')
      if (!existing) {
        const record = new Record(users)
        record.setEmail('m.blasques@multi.br.com')
        record.setPassword('Skip@Pass')
        record.setVerified(true)
        record.set('name', 'Marcelino Blasques (Proprietário)')
        app.save(record)
      }
    } catch (err) {
      const record = new Record(users)
      record.setEmail('m.blasques@multi.br.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Marcelino Blasques (Proprietário)')
      app.save(record)
    }
  },
  (app) => {
    try {
      const coll1 = app.findCollectionByNameOrId('bootstrap_approval')
      if (coll1) app.delete(coll1)
    } catch (_) {}
    try {
      const coll2 = app.findCollectionByNameOrId('project_files')
      if (coll2) app.delete(coll2)
    } catch (_) {}
  },
)
