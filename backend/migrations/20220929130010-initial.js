'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('users', {
    id: {
      type: 'int',
      notNull: true,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: 'string',
      length: 255,
      notNull: true,
      unique: true,
    },
    email: {
      type: 'string',
      length: 254,
      notNull: true,
      unique: true
    },
    password: {
      type: 'string',
      length: 255,
      notNull: true
    },
    avatar: {
      type: 'string',
      length: 255,
      defaultValue: 'NULL'
    }
  });

  await db.createTable('blog_posts', {
    id: {
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    published: {
      type: 'boolean',
      defaultValue: 0
    },
    title: {
      type: 'string',
      length: 500,
      notNull: true
    },
    body: 'text',
    author_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'blog_posts_author_id_fk',
        table: 'users',
        rules: {
          onDelete: 'NO ACTION'
        },
        mapping: 'id'
      }
    },
    img_header: {
      type: 'string',
      length: 1000,
      defaultValue: 'NULL'
    },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'datetime',
      defaultValue: new String('CURRENT_TIMESTAMP'),
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  });

  await db.createTable('slugs', {
    id: {
      type: 'int',
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      length: 600,
      notNull: true
    },
    blog_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'slugs_blog_id_fk',
        table: 'blog_posts',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    }
  });

  await db.addIndex('slugs', 'name_index', ['name']);

  await db.createTable('tags', {
    name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    blog_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'tags_blog_id_fk',
        table: 'blog_posts',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    }
  });

  await db.createTable('comments', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    body: {
      type: 'text',
      notNull: true
    },
    blog_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'comments_blog_id_fk',
        table: 'blog_posts',
        rules: {
          onDelete: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    author_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'comments_author_id_fk',
        table: 'users',
        rules: {
          onDelete: 'NO ACTION'
        },
        mapping: 'id'
      }
    },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'datetime',
      defaultValue: new String('CURRENT_TIMESTAMP'),
      onUpdate: 'CURRENT_TIMESTAMP'
    }
  });
};

exports.down = async function(db) {
  await Promise.all([
    'comments',
    'tags',
    'slugs',
    'blog_posts',
    'users'
  ].map(table => db.dropTable(table)));
};

exports._meta = {
  "version": 1
};
