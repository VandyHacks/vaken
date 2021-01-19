// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
	export interface DefaultTheme {
		borderRadius: string;

		colors: {
			main: string;
			secondary: string;
			darkTextColor: string;
			lightTextColor: string;
			warning: string;
		};
	}
}
