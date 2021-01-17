import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { HackerView } from './HackerView';
import HackerTable from './HackerTable';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { useHackersQuery } from '../../generated/graphql';

export const ManageHackers: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useHackersQuery();
	const [tableState, updateTableState] = useImmer(defaultTableState);

	return (
		<FloatingPopup
			borderRadius="1rem"
			height="100%"
			backgroundOpacity="1"
			padding="1.5rem"
			style={{ overflow: 'hidden' }}>
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				<Switch>
					<Route path="/manage/hackers/detail/:id" component={HackerView} />
					<Route
						path="/manage/hackers"
						render={() => {
							if (loading || !data) return <Spinner />;
							if (error) {
								console.log(error);
								return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
							}
							return <HackerTable data={data.hackers} isSponsor={false} viewResumes />;
						}}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default ManageHackers;
