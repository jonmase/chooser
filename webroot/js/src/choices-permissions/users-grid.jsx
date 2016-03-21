var React = require('react');
var GridList = require('material-ui/lib/grid-list/grid-list');
var GridTile = require('material-ui/lib/grid-list/grid-tile');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');

var styles = {
  root: {
    //display: 'flex',
    //flexWrap: 'wrap',
    //justifyContent: 'space-around',
  },
  gridList: {
    //width: '100%',
    //overflowY: 'auto',
    //marginBottom: 24,
  },
  gridTile: {
    //textAlign: 'center',
  },
  icon: {
    //paddingTop: '48px',
    //height: '100%',
    //width: 'auto',
  }
};

var UsersGrid = React.createClass({
    render: function() {
        <div style={styles.root}>
            <GridList
                cellHeight={200}
                //cols={3}
                style={styles.gridList}
            >
                {tilesData.map(tile => (
                    <GridTile
                        key={tile.title}
                        title={tile.title}
                        titlePosition='bottom'
                        style={styles.gridTile}
                        actionIcon={<VerifiedUser color="white" />}
                        actionPosition='left'
                    >

                    </GridTile>
                ))}
            </GridList>
        </div>
    
    }
});

module.exports = UsersGrid;