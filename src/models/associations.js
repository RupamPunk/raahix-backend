// src/models/associations.js
// Defines all Sequelize model associations in one place.
// Import and call setupAssociations() in your app entry point.

const Driver = require('./Driver');
const Bus = require('./Bus');
const Organization = require('./Organization');
const Trip = require('./Trip');
const LiveLocation = require('./LiveLocation');

const setupAssociations = () => {
    // Driver <-> Bus
    Driver.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });
    Bus.hasMany(Driver, { foreignKey: 'bus_id', as: 'drivers' });

    // Bus <-> Organization
    Bus.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
    Organization.hasMany(Bus, { foreignKey: 'organization_id', as: 'buses' });

    // Driver <-> Organization
    Driver.belongsTo(Organization, { foreignKey: 'organization_id', as: 'organization' });
    Organization.hasMany(Driver, { foreignKey: 'organization_id', as: 'drivers' });

    // Trip <-> Driver, Bus
    Trip.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });
    Trip.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });
    Driver.hasMany(Trip, { foreignKey: 'driver_id', as: 'trips' });
    Bus.hasMany(Trip, { foreignKey: 'bus_id', as: 'trips' });

    // LiveLocation <-> Trip, Driver, Bus
    LiveLocation.belongsTo(Trip, { foreignKey: 'trip_id', as: 'trip' });
    LiveLocation.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });
    LiveLocation.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });
};

module.exports = setupAssociations;
