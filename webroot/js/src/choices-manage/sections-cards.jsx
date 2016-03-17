var React = require('react');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardMedia  = require('material-ui/lib/card/card-media');
var CardTitle  = require('material-ui/lib/card/card-title');
var CardText  = require('material-ui/lib/card/card-text');
var FontIcon = require('material-ui/lib/font-icon');
var IconButton = require('material-ui/lib/icon-button');
var VerifiedUser = require('material-ui/lib/svg-icons/action/verified-user');

const styles = {
    cardContainer: {
        display: 'inline-block',
        paddingBottom: '1rem'
    },
    card: {
        //width: '23%',
        display: 'inline-block',
        //marginBottom: '2%',
        //marginRight: '2%',
    },
    icon: {
        fontSize: '36px',
        verticalAlign: 'bottom',
        marginRight: '10px'
    }
};

const cardsData = [
    {
        title: 'Permissions',
        //icon: 'verified_user',
        icon: 'block',
    },
    {
        title: 'Options Form',
        //icon: 'input',
        //icon: 'format_list_bulleted',
        //icon: 'reorder',
        icon: 'playlist_add',
    },
    {
        title: 'Editing Setup',
        icon: 'mode_edit',
    },
    {
        title: 'Notifications',
        //icon: 'announcement',
        //icon: 'priority_high',
        icon: 'mail_outline',
    },
    {
        title: 'Profile',
        //icon: 'account_circle',
        icon: 'perm_identity',
    },
    {
        title: 'Options',
        //icon: 'view_list',
        icon: 'list',
        //icon: 'format_list_numbered',
    },
    {
        title: 'Schedules',
        icon: 'schedule',
        //icon: 'timer',
    },
    {
        title: 'Results',
        //icon: 'show_chart',
        //icon: 'insert_chart',
        icon: 'equalizer',
    },
    {
        title: 'Allocations',
        icon: 'compare_arrows',
    },
];

const SectionsCards = () => (
  <div style={styles.root} className="row">
        {cardsData.map(card => (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" style={styles.cardContainer}>
                <Card 
                    key={card.title} 
                    style={styles.card}
                >
                    <CardTitle 
                        title={
                            <span>
                                <FontIcon 
                                    className="material-icons"
                                    style={styles.icon}
                                >
                                    {card.icon}
                                </FontIcon> 
                                {card.title}
                            </span>
                        }
                    />
                    <CardText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                    </CardText>
                </Card>
            </div>
        ))}
    </div>
);

module.exports = SectionsCards;