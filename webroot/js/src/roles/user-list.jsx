import React from 'react';
import {List, ListItem} from 'material-ui/List';

function UserList(props) {
    return (
		<List style={{paddingTop: '0px', marginBottom: '15px'}}>
			{props.userIndexesToList.map(function(userIndex) {
				var user = props.users[userIndex];
				var nameOrEmail = user.fullname || user.email;
				var nameAndEmail = user.fullname && user.email;
				return (
					<ListItem 
						disabled={true}
						key={user.username}
						primaryText={user.username}
						secondaryText={nameOrEmail?(user.fullname + (nameAndEmail?", ":"") + user.email):false}
					/>
				);
			})}
		</List>
    );
}

module.exports = UserList;
