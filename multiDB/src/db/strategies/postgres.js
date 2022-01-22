const ICrud = require('./interfaces/ICrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heroes = null;
  }

  async create(item) {
    return await this._heroes.create(item)
  }

  async isConnected() {
    try {
      await this._driver.authenticate();

      return true;
    } catch (error) {
      console.error('Fail to connect DB', error);

      return false;
    }
  }

  async connect() {
    this._driver = new Sequelize(
      'heroes',
      'user',
      'admin',
      {
        host: 'localhost',
        dialect: 'postgres',
        queueIdentifiers: false,
        operatorAliases: false
      }
    )

    await this.defineModel();
  }

  async defineModel() {
    this._heroes = this._driver.define('heroes', {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        require: true
      },
      power: {
        type: Sequelize.STRING,
        require: true
      }
    }, {
      tableName: 'TB_HEROES',
      freezeTableName: false,
      timestamps: false
    });

    await this._heroes.sync()
  }
}


module.exports = Postgres