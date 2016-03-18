var React = require('react');
var GridList = require('material-ui/lib/grid-list/grid-list');
var GridTile = require('material-ui/lib/grid-list/grid-tile');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var VerifiedUser = require('material-ui/lib/svg-icons/action/verified-user');

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
    marginBottom: 24,
  },
  gridTile: {
    //textAlign: 'center',
  },
  icon: {
    paddingTop: '48px',
    height: '100%',
    width: 'auto',
  }
};

const tilesData = [
  {
    title: 'Permissions',
    icon: 'verified_user',
  },
  {
    title: 'Options Form',
    icon: 'input',
  },
  {
    title: 'Editing Setup',
    icon: 'mode_edit',
  },
  {
    title: 'Notifications',
    icon: 'announcement',
  },
  {
    title: 'Profile',
    icon: 'account_circle',
  },
  {
    title: 'Options',
    icon: 'view_list',
  },
  {
    title: 'Schedules',
    icon: 'timer',
  },
  {
    title: 'Results',
    icon: 'show_chart',
  },
  {
    title: 'Allocations',
    icon: 'compare_arrows',
  },
];

const SectionsGrid = () => (
  <div style={styles.root}>
    <GridList
      cellHeight={200}
      cols={3}
      style={styles.gridList}
    >
      {tilesData.map(tile => (
        <GridTile
            key={tile.title}
            title={tile.title}
            titlePosition='top'
            style={styles.gridTile}
            actionIcon={<VerifiedUser color="white" />}
            actionPosition='left'
        >
            
        </GridTile>
      ))}
    </GridList>
  </div>
);

module.exports = SectionsGrid;