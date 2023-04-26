import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import ShowWeatherView from "./views/ShowWeatherView";

const navigator = createStackNavigator(
  {
    Home: ShowWeatherView,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

export default createAppContainer(navigator);