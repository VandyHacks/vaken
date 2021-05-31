import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Spinner } from '../../components/Loading/Spinner';
import { DARK_TEXT_COLOR } from '../../assets/strings';
import { useDetailedHackerQuery, useSignedReadUrlQuery } from '../../generated/graphql';

const Label = styled('td')`
	font-weight: 500;
	font-size: 1.1em;
	font-family: 'Roboto', sans-serif;
	color: ${DARK_TEXT_COLOR};
	text-align: right;
	white-space: wrap;
	flex: 1 1 0px;
`;

const TableRow = styled.tr`
	display: flex;
	padding: 10px 0;

	&:nth-of-type(2n) {
		background: rgba(0, 0, 0, 0.05);
	}

	@media screen and (max-width: 456px) {
		flex-flow: column nowrap;
		padding: 10px;

		${Label} {
			text-align: left;
			padding-bottom: 5px;
		}
	}
`;

const Value = styled('td')`
	font-size: 1.1em;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
	color: ${STRINGS.DARK_TEXT_COLOR};
	flex: 3 1 0px;

	@media screen and (min-width: 457px) {
		margin-left: 10px;
	}
`;

const DangerousRow: FC<{
	label: string;
	value: string;
	onMouseEnter: React.MouseEventHandler;
}> = props => {
	const { label, value, onMouseEnter } = props;

	return (
		<TableRow>
			<Label onMouseEnter={onMouseEnter}>{label}</Label>
			<Value dangerouslySetInnerHTML={{ __html: value }} />
		</TableRow>
	);
};

interface ResumeLinkProps {
	id: string;
}

export const ResumeLink: FC<ResumeLinkProps> = (props: { id: string }) => {
	const { id } = props;
	const { data, loading, error } = useDetailedHackerQuery({ variables: { id } });
	const [linkLoc, setLinkLoc] = useState('');
	const fileReadUrlQuery = useSignedReadUrlQuery({
		variables: { input: (data && data.hacker.id) || '' },
	});
	const { data: { signedReadUrl = '' } = {} } = fileReadUrlQuery || {};

	const getLink = (): void => {
		setLinkLoc(
			signedReadUrl.length > 0
				? `<a href="${signedReadUrl}"  target="_blank" rel="noopener noreferrer">Resume Link</a>`
				: 'Resume not available'
		);
	};

	if (loading) return <Spinner />;

	if (error) return <></>;

	// If an ID was provided, no error was thrown, and it's not loading, then we have a weird problem.
	if (!data) throw new Error('No error was thrown, but no data was found either :(');
	return <DangerousRow onMouseEnter={getLink} key="resume" label="view resume" value={linkLoc} />;
};
