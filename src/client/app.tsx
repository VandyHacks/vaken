import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import reset from 'styled-reset';
import LoginPage from './routes/login/Login';
import Frame from './routes/dashboard/Frame';
import { AuthContext } from './contexts/AuthContext';
import { useMeQuery } from './generated/graphql';
import 'react-toastify/dist/ReactToastify.css';

const loremipsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam etiam erat velit scelerisque in dictum non. Sagittis orci a scelerisque purus semper eget duis at tellus. Condimentum vitae sapien pellentesque habitant. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat. Tellus orci ac auctor augue mauris. Diam vulputate ut pharetra sit. Elementum integer enim neque volutpat ac tincidunt. Lectus urna duis convallis convallis tellus id interdum. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat. Lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant. Lacinia quis vel eros donec ac odio tempor orci dapibus. Tortor at auctor urna nunc id cursus. Est ullamcorper eget nulla facilisi. Aliquet eget sit amet tellus cras. At volutpat diam ut venenatis tellus. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.

Tincidunt ornare massa eget egestas purus viverra accumsan in. Malesuada fames ac turpis egestas sed tempus urna et. Nulla pharetra diam sit amet nisl suscipit. Sed risus pretium quam vulputate. Purus semper eget duis at tellus. Purus sit amet volutpat consequat mauris nunc congue. Lorem donec massa sapien faucibus et molestie ac feugiat sed. Risus quis varius quam quisque. Magnis dis parturient montes nascetur ridiculus. Dui vivamus arcu felis bibendum. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi.

Neque sodales ut etiam sit amet nisl purus. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Etiam dignissim diam quis enim lobortis. Scelerisque varius morbi enim nunc faucibus a pellentesque sit amet. Sit amet massa vitae tortor condimentum lacinia quis. Pellentesque elit eget gravida cum sociis. Volutpat odio facilisis mauris sit amet massa vitae tortor. Luctus venenatis lectus magna fringilla urna porttitor. Sit amet purus gravida quis blandit. Sit amet tellus cras adipiscing enim. Et sollicitudin ac orci phasellus egestas tellus rutrum.

Eu ultrices vitae auctor eu augue. Vitae et leo duis ut diam quam nulla porttitor. Nunc sed velit dignissim sodales ut. Duis at tellus at urna. Vel turpis nunc eget lorem dolor sed viverra. Nisi lacus sed viverra tellus in hac habitasse platea. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis. Non enim praesent elementum facilisis leo. Accumsan tortor posuere ac ut consequat semper. Lectus arcu bibendum at varius vel pharetra vel turpis nunc.

A diam maecenas sed enim ut sem. Vel orci porta non pulvinar. Et malesuada fames ac turpis egestas sed tempus urna. Bibendum est ultricies integer quis auctor elit sed. Elementum pulvinar etiam non quam. Morbi tincidunt ornare massa eget. Tellus pellentesque eu tincidunt tortor. Nisl rhoncus mattis rhoncus urna neque. Quam adipiscing vitae proin sagittis. Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Pellentesque habitant morbi tristique senectus et netus. Mollis aliquam ut porttitor leo. Pulvinar mattis nunc sed blandit libero volutpat. Morbi non arcu risus quis varius quam quisque id. Sed turpis tincidunt id aliquet risus feugiat in ante. Ut placerat orci nulla pellentesque dignissim enim sit amet venenatis. Amet facilisis magna etiam tempor orci. Diam quis enim lobortis scelerisque fermentum dui faucibus in.

Eu non diam phasellus vestibulum lorem sed risus ultricies tristique. Leo duis ut diam quam nulla porttitor. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Enim lobortis scelerisque fermentum dui faucibus in ornare quam. Risus nec feugiat in fermentum posuere urna nec tincidunt. Nulla porttitor massa id neque aliquam vestibulum morbi. Urna condimentum mattis pellentesque id nibh tortor id aliquet. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut. Eu ultrices vitae auctor eu augue ut lectus. Metus vulputate eu scelerisque felis. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Integer malesuada nunc vel risus commodo. Dui accumsan sit amet nulla facilisi morbi tempus iaculis urna. Tincidunt arcu non sodales neque. Sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit. Amet luctus venenatis lectus magna fringilla. Mi eget mauris pharetra et ultrices neque ornare aenean.

Viverra nam libero justo laoreet. Nunc sed id semper risus in hendrerit gravida. Metus vulputate eu scelerisque felis imperdiet. Neque gravida in fermentum et sollicitudin ac. Augue eget arcu dictum varius duis. Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan. Elit ut aliquam purus sit amet luctus venenatis lectus. Auctor urna nunc id cursus metus aliquam eleifend mi in. Massa enim nec dui nunc. Cursus metus aliquam eleifend mi in. Id donec ultrices tincidunt arcu non sodales. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Enim diam vulputate ut pharetra sit amet aliquam id. Porttitor leo a diam sollicitudin tempor. Porttitor lacus luctus accumsan tortor. Ut porttitor leo a diam sollicitudin tempor. Mattis nunc sed blandit libero volutpat sed cras. In pellentesque massa placerat duis ultricies lacus.

Semper risus in hendrerit gravida rutrum quisque non. Viverra vitae congue eu consequat. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Mauris nunc congue nisi vitae. A erat nam at lectus urna duis convallis. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Dolor purus non enim praesent elementum facilisis leo vel fringilla. Maecenas pharetra convallis posuere morbi leo urna molestie at. Fringilla ut morbi tincidunt augue interdum velit euismod in. Tempor orci eu lobortis elementum nibh tellus molestie nunc non. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Quam quisque id diam vel quam elementum pulvinar. Quis commodo odio aenean sed adipiscing diam. Ac odio tempor orci dapibus ultrices in iaculis nunc sed.

Massa enim nec dui nunc mattis. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Lacus sed turpis tincidunt id aliquet. Leo duis ut diam quam nulla. Neque sodales ut etiam sit amet nisl purus in. Sit amet mattis vulputate enim nulla aliquet. Sit amet dictum sit amet justo donec. Nulla facilisi cras fermentum odio eu feugiat pretium. Mus mauris vitae ultricies leo integer. Volutpat est velit egestas dui id ornare. Commodo viverra maecenas accumsan lacus. Mi bibendum neque egestas congue quisque egestas diam. Suspendisse in est ante in nibh mauris.

Dictumst vestibulum rhoncus est pellentesque elit. Ornare quam viverra orci sagittis eu. Odio ut enim blandit volutpat maecenas. Porttitor lacus luctus accumsan tortor posuere ac. Tortor id aliquet lectus proin nibh nisl condimentum id venenatis. Nunc mattis enim ut tellus elementum. At ultrices mi tempus imperdiet nulla malesuada. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere. In pellentesque massa placerat duis ultricies lacus. Volutpat diam ut venenatis tellus in metus. Mi bibendum neque egestas congue quisque. Varius sit amet mattis vulputate. Purus semper eget duis at tellus at urna. Purus in massa tempor nec feugiat nisl pretium fusce id.
`;

const GlobalStyle = createGlobalStyle`
	${reset}

	html, body, #App {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		font-size: 14px;
		font-family: 'Roboto', sans-serif;
		user-select: none;
		overflow: hidden;
	}

	a {
		text-decoration: none;
	}

	/* Styling for the toast messages. The toast library overrides
		 these values so !important is required. */
	.french-toast {
		padding: 20px !important;
		border-radius: 4px !important;
		font-family: 'Roboto', sans-serif !important;
		font-size: 1.1em !important;
	}
`;

toast.configure();

const Vaken: React.FunctionComponent = (): JSX.Element => {
	const [ready, setReady] = useState(false);
	const { data, error, loading } = useMeQuery();

	const StateMachine: React.FunctionComponent = (): JSX.Element | null => {
		if (!ready) return null;
		return data && data.me ? (
			<AuthContext.Provider value={data.me}>
				<Frame />
				<ToastContainer toastClassName="french-toast" autoClose={5000} />
			</AuthContext.Provider>
		) : (
			<LoginPage />
		);
	};

	useEffect(() => {
		if (loading && ready) {
			setReady(false);
		} else if (error && !ready) {
			setReady(true);
		} else if (data && data.me && !ready) {
			setReady(true);
		}
	}, [loading, ready, error, data]);

	return (
		<BrowserRouter>
			<GlobalStyle />
			<StateMachine data-foo={loremipsum} />
		</BrowserRouter>
	);
};

export default Vaken;
