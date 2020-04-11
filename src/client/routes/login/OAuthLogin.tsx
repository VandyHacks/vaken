import React, { useEffect, useState } from 'react';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import googleLogo from '../../assets/img/google_logo.svg';
import githubLogo from '../../assets/img/github_logo.svg';
import msftLogo from '../../assets/img/msft_logo.svg';
import STRINGS from '../../assets/strings.json';

const OAuthLogin = (): JSX.Element => {
	const [providers, setProviders] = useState([]);

	useEffect(() => {
		const fetchProviders = async (): Promise<void> => {
			const data = await (await fetch('/api/auth')).json();

			setProviders(data);
			console.log(data);
		};

		fetchProviders();
	}, []);

	return (
		<>
			{providers.map(({ name, displayName, svgPath }) => (
				<a href={`/api/auth/${name}`} style={{ textDecoration: 'none' }} key={displayName}>
					<LeftImgButton
						color={STRINGS.DARK_TEXT_COLOR}
						// img={`data:image/svg+xml,${svgPath}`}
						img="data:text/plain;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjUuODU3MiAxMC42MzU3SDEzLjI2NDFWMTUuOTU0M0gyMC40MDE4QzE5LjI2MDUgMTkuNSAxNi40NDIxIDIwLjY4MTQgMTMuMjA2NCAyMC42ODE0QzkuNzYwMjcgMjAuNjg1NyA2LjcyMDE4IDE4LjQ1OTkgNS43Mjk4MSAxNS4yMDc2QzQuNzM5NDMgMTEuOTU1MiA2LjAzMzc5IDguNDQ4MDYgOC45MTMwNyA2LjU4MjI2QzExLjc5MjMgNC43MTY0NiAxNS41NzMzIDQuOTM0ODEgMTguMjExNiA3LjExOTI0TDIyLjEzMzQgMy40Mzg2NEMxNy43ODk2IC0wLjUwNDA4IDExLjMxNTcgLTEuMTIyMDYgNi4yODQ2MSAxLjkyNTc0QzEuMjUzNDkgNC45NzM1NSAtMS4xMDkxIDEwLjk0NDYgMC41MDA3MDMgMTYuNTQzNUMyLjExMDUgMjIuMTQyNSA3LjMwMDQ5IDI2LjAwNTIgMTMuMjA2NCAyNkMyMC40ODA5IDI2IDI3LjA1OTUgMjEuMjcyOSAyNS44NTcyIDEwLjYzNTdaIiBmaWxsPSIjM0YzMzU2Ii8+PC9zdmc+"
						imgAlt={`${displayName} logo`}>
						{`Sign in with ${displayName}`}
					</LeftImgButton>
				</a>
			))}
		</>
	);
};

export default OAuthLogin;
