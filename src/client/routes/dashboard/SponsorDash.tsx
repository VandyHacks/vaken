import React, { FunctionComponent, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export const SponsorDash: FunctionComponent = (): JSX.Element => {
	const currentUser = useContext(AuthContext);
	return <div>{currentUser.firstName}</div>;
};

export default SponsorDash;
