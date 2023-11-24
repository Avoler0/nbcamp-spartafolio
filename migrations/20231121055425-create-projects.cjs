'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      project_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      like: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      team_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      over_view: {
        type: Sequelize.STRING,
      },
      view: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      tech_stack: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      github_address: {
        type: Sequelize.STRING,
      },
      demo_site: {
        type: Sequelize.STRING,
      },
      core_function: {
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      images_path: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};