import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {teal300, teal500, teal700, lightBlack, indigoA200, lightBlue300} from 'material-ui/styles/colors';

//http://www.material-ui.com/#/customization/colors
module.exports = getMuiTheme({
  palette: {
    //primary1Color: indigo700,
    primary1Color: teal500,
    //primary2Color: indigo900,
    primary2Color: teal700,
    primary3Color: lightBlack,
    //accent1Color: indigoA400,
    //accent1Color: indigoA200,
    accent1Color: teal300,
    //pickerHeaderColor: indigo700,
    pickerHeaderColor: teal500,
  }
});